const {
  validarDOI,
  calcularDuracionProyectoMeses,
  clasificarImpactoRevista
} = require('./researchHelper');

describe('Suite de Pruebas Funcionales de Dominio Científico - researchHelper', () => {

  describe('validarDOI()', () => {
    test('debe aceptar formatos de DOI estándar válidos', () => {
      expect(validarDOI('10.1016/j.cell.2023.05.001')).toBe(true);
      expect(validarDOI('10.1109/TSE.2020.1234567')).toBe(true);
    });

    test('debe rechazar formatos que no inicien con el prefijo 10.', () => {
      expect(validarDOI('11.1016/j.cell')).toBe(false);
      expect(validarDOI('https://doi.org/10.1016/j.cell')).toBe(false);
    });

    test('debe rechazar valores nulos, vacíos o tipos no strings', () => {
      expect(validarDOI(null)).toBe(false);
      expect(validarDOI(undefined)).toBe(false);
      expect(validarDOI(12345)).toBe(false);
    });
  });

  describe('calcularDuracionProyectoMeses()', () => {
    test('debe calcular correctamente la duración exacta en meses', () => {
      const duracion = calcularDuracionProyectoMeses('2025-01-01', '2025-06-01');
      expect(duracion).toBe(5); // Enero a Junio = 5 meses
    });

    test('debe aproximar al mes siguiente si la diferencia de días es mayor o igual a 15', () => {
      const duracion = calcularDuracionProyectoMeses('2025-01-01', '2025-02-18');
      expect(duracion).toBe(2); // 1 mes y 17 días -> Aproxima a 2 meses
    });

    test('debe lanzar error si la fecha de fin es menor a la de inicio', () => {
      expect(() => {
        calcularDuracionProyectoMeses('2025-12-31', '2025-01-01');
      }).toThrow('La fecha de finalización no puede ser anterior a la fecha de inicio');
    });

    test('debe lanzar error si faltan argumentos o son inválidos', () => {
      expect(() => {
        calcularDuracionProyectoMeses(null, '2025-01-01');
      }).toThrow('Ambas fechas son obligatorias');

      expect(() => {
        calcularDuracionProyectoMeses('fecha-invalida', '2025-01-01');
      }).toThrow('Formatos de fecha inválidos');
    });
  });

  describe('clasificarImpactoRevista()', () => {
    test('debe categorizar como Excelente un factor de impacto >= 10', () => {
      expect(clasificarImpactoRevista(15.4)).toBe('Excelente');
      expect(clasificarImpactoRevista(10.0)).toBe('Excelente');
    });

    test('debe clasificar correctamente categorías Alto, Medio y Bajo', () => {
      expect(clasificarImpactoRevista(7.2)).toBe('Alto');
      expect(clasificarImpactoRevista(3.5)).toBe('Medio');
      expect(clasificarImpactoRevista(0.8)).toBe('Bajo');
    });

    test('debe lanzar error ante entradas no numéricas o negativas', () => {
      expect(() => {
        clasificarImpactoRevista(-1);
      }).toThrow('El factor de impacto no puede ser negativo');

      expect(() => {
        clasificarImpactoRevista('alto');
      }).toThrow('El factor de impacto debe ser un número válido');
    });
  });

});
