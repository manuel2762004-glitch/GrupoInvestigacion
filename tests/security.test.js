const { sanitizeInput } = require('./security');
const { Roles, verificarAccesoRuta, verificarAccesoAPI, validarSesionToken } = require('./securityAuth');

describe('Suite de Pruebas de Seguridad - Entrada y Acceso', () => {

  describe('1. Sanitización de Entradas (XSS e Inyecciones)', () => {
    test('debe neutralizar un ataque básico de XSS con etiquetas <script>', () => {
      const inputMalicioso = "<script>alert('Ataque XSS!')</script>";
      const resultado = sanitizeInput(inputMalicioso);
      
      expect(resultado).not.toContain('<script>');
      expect(resultado).toBe("&lt;script&gt;alert(&#x27;Ataque XSS!&#x27;)&lt;&#x2F;script&gt;");
    });

    test('debe desarmar un XSS embebido dentro de atributos HTML de imágenes', () => {
      const inputMalicioso = '<img src="x" onerror="alert(1)">';
      const resultado = sanitizeInput(inputMalicioso);
      
      expect(resultado).not.toContain('<img');
      expect(resultado).toBe("&lt;img src=&quot;x&quot; onerror=&quot;alert(1)&quot;&gt;");
    });

    test('debe desactivar intentos de inyección SQL como UNION SELECT y comentarios de línea', () => {
      const inputMalicioso = "' OR 1=1 --";
      const resultado = sanitizeInput(inputMalicioso);
      
      expect(resultado).not.toContain('--');
      expect(resultado).toBe("&#x27; OR 1=1 ");
    });

    test('debe eliminar la palabra clave DROP TABLE ignorando mayúsculas y minúsculas', () => {
      const inputMalicioso = "input; DrOp TaBlE usuarios;";
      const resultado = sanitizeInput(inputMalicioso);
      
      expect(resultado).not.toContain('DROP TABLE');
      expect(resultado).toBe("input;  usuarios;");
    });

    test('debe retornar un texto limpio si la entrada no contiene payloads maliciosos', () => {
      const inputSeguro = "Mi nombre es Manuel y soy investigador.";
      const resultado = sanitizeInput(inputSeguro);
      expect(resultado).toBe(inputSeguro);
    });
  });

  describe('2. Control de Accesos Frontend (RBAC)', () => {
    test('debe permitir acceso a rutas públicas a cualquier usuario (incluso anónimos)', () => {
      const paginasPublicas = ['/', '/login', '/search'];
      
      paginasPublicas.forEach(ruta => {
        const accesoAnonimo = verificarAccesoRuta(Roles.ANONYMOUS, ruta);
        const accesoInvestigador = verificarAccesoRuta(Roles.RESEARCHER, ruta);
        
        expect(accesoAnonimo.allowed).toBe(true);
        expect(accesoInvestigador.allowed).toBe(true);
      });
    });

    test('debe denegar acceso a rutas privadas (/dashboard) a usuarios anónimos (retorna 401)', () => {
      const acceso = verificarAccesoRuta(Roles.ANONYMOUS, '/dashboard');
      
      expect(acceso.allowed).toBe(false);
      expect(acceso.status).toBe(401);
      expect(acceso.error).toContain('Authentication required');
    });

    test('debe permitir a investigadores y administradores acceder a rutas de trabajo (/dashboard, /projects/new)', () => {
      const paginasPrivadas = ['/dashboard', '/projects/new'];
      
      paginasPrivadas.forEach(ruta => {
        const accesoInvestigador = verificarAccesoRuta(Roles.RESEARCHER, ruta);
        const accesoAdmin = verificarAccesoRuta(Roles.ADMIN, ruta);
        
        expect(accesoInvestigador.allowed).toBe(true);
        expect(accesoAdmin.allowed).toBe(true);
      });
    });

    test('debe impedir a un Investigador ingresar al panel de administración (/admin) (retorna 403)', () => {
      const acceso = verificarAccesoRuta(Roles.RESEARCHER, '/admin');
      
      expect(acceso.allowed).toBe(false);
      expect(acceso.status).toBe(403);
      expect(acceso.error).toContain('Forbidden');
    });

    test('debe permitir únicamente al Administrador acceder a la ruta /admin', () => {
      const acceso = verificarAccesoRuta(Roles.ADMIN, '/admin');
      expect(acceso.allowed).toBe(true);
    });
  });

  describe('3. Protección de Endpoints API', () => {
    test('debe denegar peticiones POST a /api/projects a usuarios no autenticados', () => {
      const acceso = verificarAccesoAPI(Roles.ANONYMOUS, '/api/projects', 'POST');
      expect(acceso.allowed).toBe(false);
      expect(acceso.status).toBe(401);
    });

    test('debe permitir peticiones GET a /api/projects a cualquier usuario', () => {
      const acceso = verificarAccesoAPI(Roles.ANONYMOUS, '/api/projects', 'GET');
      expect(acceso.allowed).toBe(true);
    });

    test('debe permitir peticiones POST a /api/publications a investigadores autenticados', () => {
      const acceso = verificarAccesoAPI(Roles.RESEARCHER, '/api/publications', 'POST');
      expect(acceso.allowed).toBe(true);
    });

    test('debe impedir a investigadores realizar aprobaciones administrativas en API', () => {
      const acceso = verificarAccesoAPI(Roles.RESEARCHER, '/api/admin/approve', 'POST');
      expect(acceso.allowed).toBe(false);
      expect(acceso.status).toBe(403);
    });
  });

  describe('4. Gestión y Validación de Sesiones (Tokens)', () => {
    test('debe parsear y autenticar un token de sesión de investigador válido', () => {
      const sesion = validarSesionToken('jwt-researcher-token');
      
      expect(sesion.autenticado).toBe(true);
      expect(sesion.rol).toBe(Roles.RESEARCHER);
      expect(sesion.email).toBe('manuel@university.edu');
    });

    test('debe rechazar tokens con firmas alteradas o inválidas', () => {
      expect(() => {
        validarSesionToken('jwt-researcher-token-tampered');
      }).toThrow('Invalid token signature');
    });

    test('debe expirar sesiones con tokens marcados como expirados', () => {
      expect(() => {
        validarSesionToken('jwt-session-expired-token');
      }).toThrow('Session expired');
    });
  });
});
