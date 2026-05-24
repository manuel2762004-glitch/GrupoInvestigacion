/**
 * Módulo de Autenticación y Autorización de Seguridad (RBAC)
 * Simula el control de acceso a rutas protegidas y endpoints de API
 */

// Roles admitidos en el sistema
const Roles = {
  ANONYMOUS: 'ANONYMOUS',
  RESEARCHER: 'RESEARCHER',
  ADMIN: 'ADMIN'
};

// Mapa de permisos de rutas
const PermisosRutas = {
  // Rutas públicas
  '/': [Roles.ANONYMOUS, Roles.RESEARCHER, Roles.ADMIN],
  '/login': [Roles.ANONYMOUS, Roles.RESEARCHER, Roles.ADMIN],
  '/search': [Roles.ANONYMOUS, Roles.RESEARCHER, Roles.ADMIN],
  
  // Rutas privadas de investigadores y administradores
  '/dashboard': [Roles.RESEARCHER, Roles.ADMIN],
  '/projects/new': [Roles.RESEARCHER, Roles.ADMIN],
  
  // Rutas exclusivas del administrador
  '/admin': [Roles.ADMIN]
};

// Mapa de permisos de endpoints de API
const PermisosAPI = {
  '/api/auth/login': {
    'POST': [Roles.ANONYMOUS, Roles.RESEARCHER, Roles.ADMIN]
  },
  '/api/projects': {
    'GET': [Roles.ANONYMOUS, Roles.RESEARCHER, Roles.ADMIN],
    'POST': [Roles.RESEARCHER, Roles.ADMIN]
  },
  '/api/publications': {
    'GET': [Roles.ANONYMOUS, Roles.RESEARCHER, Roles.ADMIN],
    'POST': [Roles.RESEARCHER, Roles.ADMIN]
  },
  '/api/admin/approve': {
    'POST': [Roles.ADMIN]
  }
};

/**
 * Verifica si un rol específico tiene acceso a una página/ruta del frontend
 */
function verificarAccesoRuta(rol, ruta) {
  const rolActual = rol || Roles.ANONYMOUS;
  
  // Si la ruta no está registrada, por seguridad la bloqueamos
  if (!PermisosRutas[ruta]) {
    return {
      allowed: false,
      status: 404,
      error: 'Not Found'
    };
  }

  const rolesPermitidos = PermisosRutas[ruta];
  
  if (rolesPermitidos.includes(rolActual)) {
    return { allowed: true };
  }

  // Devolver el código HTTP adecuado según el estado de autenticación
  if (rolActual === Roles.ANONYMOUS) {
    return {
      allowed: false,
      status: 401,
      error: 'Authentication required. Please log in.'
    };
  } else {
    return {
      allowed: false,
      status: 403,
      error: 'Forbidden: You do not have permission to access this resource.'
    };
  }
}

/**
 * Verifica si un rol específico tiene acceso a un endpoint de API
 */
function verificarAccesoAPI(rol, endpoint, metodo) {
  const rolActual = rol || Roles.ANONYMOUS;
  const metodoMayusc = (metodo || 'GET').toUpperCase();

  if (!PermisosAPI[endpoint] || !PermisosAPI[endpoint][metodoMayusc]) {
    return {
      allowed: false,
      status: 404,
      error: 'Endpoint or Method Not Found'
    };
  }

  const rolesPermitidos = PermisosAPI[endpoint][metodoMayusc];

  if (rolesPermitidos.includes(rolActual)) {
    return { allowed: true };
  }

  if (rolActual === Roles.ANONYMOUS) {
    return {
      allowed: false,
      status: 401,
      error: 'Unauthorized: Missing or invalid token'
    };
  } else {
    return {
      allowed: false,
      status: 403,
      error: 'Forbidden: Insufficient privileges'
    };
  }
}

/**
 * Valida la autenticidad y estado de un token JWT
 */
function validarSesionToken(token) {
  if (!token) {
    return { autenticado: false, rol: Roles.ANONYMOUS };
  }

  // Simular validación de firma y expiración
  if (token.includes('expired')) {
    const error = new Error('Session expired');
    error.name = 'TokenExpiredError';
    throw error;
  }

  if (token.includes('tampered') || token.includes('invalid') || !token.startsWith('jwt-')) {
    const error = new Error('Invalid token signature');
    error.name = 'JsonWebTokenError';
    throw error;
  }

  // Parsear rol del token válido
  if (token === 'jwt-admin-token') {
    return {
      autenticado: true,
      rol: Roles.ADMIN,
      email: 'admin@university.edu',
      nombre: 'Administrador Principal'
    };
  }

  if (token === 'jwt-researcher-token') {
    return {
      autenticado: true,
      rol: Roles.RESEARCHER,
      email: 'manuel@university.edu',
      nombre: 'Manuel Espinoza'
    };
  }

  return { autenticado: false, rol: Roles.ANONYMOUS };
}

module.exports = {
  Roles,
  verificarAccesoRuta,
  verificarAccesoAPI,
  validarSesionToken
};
