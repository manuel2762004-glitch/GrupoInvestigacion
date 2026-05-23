const { sanitizeInput } = require('./security');

describe('Suite de Pruebas de Seguridad - sanitizeInput()', () => {
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
