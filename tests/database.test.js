const { dbSimulada } = require('./database');

describe('Suite de Pruebas de Integridad de Base de Datos', () => {
  
  beforeEach(() => {
    dbSimulada.reset();
  });

  describe('1. Integridad de Usuarios (Unique Constraints)', () => {
    test('debe registrar un usuario correctamente si el email no existe', async () => {
      const usuario = await dbSimulada.registrarUsuario(
        'investigador.juan@university.edu', 
        'Segura123!', 
        'Juan Pérez'
      );
      
      expect(usuario).toHaveProperty('id');
      expect(usuario.email).toBe('investigador.juan@university.edu');
      expect(usuario.nombre).toBe('Juan Pérez');
    });

    test('debe lanzar error de violación de clave única (Código 23505) si el email ya existe', async () => {
      // Registrar primer usuario
      await dbSimulada.registrarUsuario(
        'duplicado@university.edu', 
        'Segura123!', 
        'Usuario Original'
      );

      // Intentar registrar segundo usuario con el mismo correo
      await expect(
        dbSimulada.registrarUsuario(
          'duplicado@university.edu', 
          'OtraClave99!', 
          'Usuario Clon'
        )
      ).rejects.toThrow('duplicate key value violates unique constraint "usuarios_email_key"');

      // Verificar detalles del código de error estándar de PostgreSQL
      try {
        await dbSimulada.registrarUsuario('duplicado@university.edu', 'OtraClave99!', 'Usuario Clon');
      } catch (error) {
        expect(error.code).toBe('23505');
        expect(error.detail).toContain('already exists');
      }
    });
  });

  describe('2. Integridad de Proyectos (Not-Null, Check y FK Constraints)', () => {
    test('debe lanzar error de violación de restricción NOT NULL (Código 23502) si falta el nombre del proyecto', async () => {
      await expect(
        dbSimulada.insertarProyecto({
          descripcion: 'Proyecto sin nombre',
          presupuesto: 15000
        })
      ).rejects.toThrow('violates not-null constraint');

      try {
        await dbSimulada.insertarProyecto({ descripcion: 'Proyecto sin nombre' });
      } catch (error) {
        expect(error.code).toBe('23502');
      }
    });

    test('debe lanzar error de CHECK constraint (Código 23514) si el presupuesto es negativo', async () => {
      await expect(
        dbSimulada.insertarProyecto({
          nombre: 'Detección de Anomalías',
          presupuesto: -500.00
        })
      ).rejects.toThrow('violates check constraint "proyectos_presupuesto_check"');

      try {
        await dbSimulada.insertarProyecto({
          nombre: 'Detección de Anomalías',
          presupuesto: -500.00
        });
      } catch (error) {
        expect(error.code).toBe('23514');
      }
    });

    test('debe lanzar error de Clave Foránea (Código 23503) si se vincula a una línea de investigación inexistente', async () => {
      await expect(
        dbSimulada.insertarProyecto({
          nombre: 'Análisis de Redes Neuronales',
          id_linea: 'linea-inexistente-999'
        })
      ).rejects.toThrow('violates foreign key constraint');

      try {
        await dbSimulada.insertarProyecto({
          nombre: 'Análisis de Redes Neuronales',
          id_linea: 'linea-inexistente-999'
        });
      } catch (error) {
        expect(error.code).toBe('23503');
        expect(error.detail).toContain('is not present in table "lineas_investigacion"');
      }
    });

    test('debe insertar correctamente si se vincula a una línea de investigación existente', async () => {
      const proyecto = await dbSimulada.insertarProyecto({
        nombre: 'Visión por Computador Avanzada',
        id_linea: 'linea-1', // Línea semilla 'AI'
        presupuesto: 12500.50
      });

      expect(proyecto.id).toContain('pry-');
      expect(proyecto.id_linea).toBe('linea-1');
      expect(proyecto.presupuesto).toBe(12500.50);
    });
  });

  describe('3. Integridad de Publicaciones (Foreign Key Constraints)', () => {
    test('debe registrar publicación correctamente vinculada a un proyecto existente', async () => {
      // 1. Insertar proyecto
      const proyecto = await dbSimulada.insertarProyecto({
        nombre: 'Proyecto Computación Cuántica'
      });

      // 2. Insertar publicación asociada
      const pub = await dbSimulada.insertarPublicacion({
        titulo: 'Entrelazamiento Cuántico Aplicado',
        id_proyecto: proyecto.id,
        autores: 'Dr. Alice, Dr. Bob'
      });

      expect(pub.id_proyecto).toBe(proyecto.id);
      expect(pub.estado).toBe('SUBMITTED');
    });

    test('debe lanzar error de Clave Foránea (Código 23503) si se asocia a un proyecto que no existe', async () => {
      await expect(
        dbSimulada.insertarPublicacion({
          titulo: 'Avances en Fusión Nuclear',
          id_proyecto: 'pry-no-existente-123'
        })
      ).rejects.toThrow('violates foreign key constraint');

      try {
        await dbSimulada.insertarPublicacion({
          titulo: 'Avances en Fusión Nuclear',
          id_proyecto: 'pry-no-existente-123'
        });
      } catch (error) {
        expect(error.code).toBe('23503');
        expect(error.detail).toContain('is not present in table "proyectos"');
      }
    });
  });
});
