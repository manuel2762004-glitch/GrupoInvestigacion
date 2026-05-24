const { dbSimulada } = require('./database');
const { validarDOI, calcularDuracionProyectoMeses, clasificarImpactoRevista } = require('./researchHelper');

describe('Suite de Pruebas Funcionales - Ciclo de Vida del Portal Científico', () => {

  beforeEach(() => {
    dbSimulada.reset();
  });

  describe('1. Ciclo de Vida Funcional de Proyectos', () => {
    test('debe crear un proyecto correctamente con estado inicial PENDING_APPROVAL y campos mapeados', async () => {
      const datosProyecto = {
        nombre: 'Detección Automática de Fugas de Agua',
        descripcion: 'Algoritmo basado en IoT y sensores de flujo',
        entidad_financiadora: 'Gobierno de España - MINECO',
        fecha_inicio: '2026-01-01',
        fecha_fin: '2026-12-31',
        presupuesto: '75000.00',
        id_linea: 'linea-1'
      };

      const proyectoGuardado = await dbSimulada.insertarProyecto(datosProyecto);

      // Verificaciones funcionales de creación
      expect(proyectoGuardado).toHaveProperty('id');
      expect(proyectoGuardado.estado).toBe('PENDING_APPROVAL');
      expect(proyectoGuardado.nombre).toBe(datosProyecto.nombre);
      expect(proyectoGuardado.presupuesto).toBe(75000.00); // Parseado a float
      expect(proyectoGuardado.fecha_inicio).toBe('2026-01-01');
    });

    test('debe validar reglas de negocio temporales (duración del proyecto)', () => {
      const inicio = '2026-01-01';
      const fin = '2028-06-30'; // 2 años y 6 meses (29 meses y fracción)
      
      const meses = calcularDuracionProyectoMeses(inicio, fin);
      expect(meses).toBe(30); // 29 meses + 29 días -> Aproxima a 30 meses

      // Regla de negocio: Fecha de fin no puede ser anterior a la de inicio
      expect(() => {
        calcularDuracionProyectoMeses('2026-12-31', '2026-01-01');
      }).toThrow('La fecha de finalización no puede ser anterior a la fecha de inicio');
    });

    test('debe permitir la aprobación del proyecto por parte del Administrador (Transición de Estado)', async () => {
      // 1. Investigador registra proyecto
      const proyecto = await dbSimulada.insertarProyecto({
        nombre: 'Estudio de Redes 6G'
      });
      expect(proyecto.estado).toBe('PENDING_APPROVAL');

      // 2. Simulamos la acción del Administrador que aprueba y activa el proyecto
      proyecto.estado = 'ACTIVE';
      
      // Actualizamos en base de datos
      dbSimulada.proyectos.set(proyecto.id, proyecto);

      // 3. Verificar persistencia de la aprobación
      const proyectoVerificado = dbSimulada.proyectos.get(proyecto.id);
      expect(proyectoVerificado.estado).toBe('ACTIVE');
    });

    test('debe permitir el rechazo del proyecto por parte del Administrador (Transición de Estado)', async () => {
      const proyecto = await dbSimulada.insertarProyecto({
        nombre: 'Estudio inviable'
      });
      
      // Administrador rechaza
      proyecto.estado = 'REJECTED';
      dbSimulada.proyectos.set(proyecto.id, proyecto);

      const proyectoVerificado = dbSimulada.proyectos.get(proyecto.id);
      expect(proyectoVerificado.estado).toBe('REJECTED');
    });
  });

  describe('2. Ciclo de Vida de Publicaciones Científicas', () => {
    test('debe registrar una publicación, validar su DOI e iniciar en estado SUBMITTED', async () => {
      const proyecto = await dbSimulada.insertarProyecto({
        nombre: 'Estudio del Clima Polar'
      });

      const doiValido = '10.1016/j.polenv.2026.02.004';
      expect(validarDOI(doiValido)).toBe(true);

      const publicacion = await dbSimulada.insertarPublicacion({
        titulo: 'Reducción del hielo en Groenlandia central',
        autores: 'Dr. Manuel, Dra. Elena',
        doi: doiValido,
        id_proyecto: proyecto.id
      });

      expect(publicacion.id_proyecto).toBe(proyecto.id);
      expect(publicacion.estado).toBe('SUBMITTED');
      expect(publicacion.doi).toBe(doiValido);
    });

    test('debe rechazar publicaciones con DOI inválido en la lógica de negocio', () => {
      const doiInvalido = 'https://doi.org/10.1016/j.cell';
      expect(validarDOI(doiInvalido)).toBe(false);
    });

    test('debe simular la transición de revisión de pares (SUBMITTED -> ACCEPTED)', async () => {
      const pub = await dbSimulada.insertarPublicacion({
        titulo: 'Análisis de Redes Wifi-7',
        autores: 'Ing. Carlos'
      });
      expect(pub.estado).toBe('SUBMITTED');

      // Par revisor acepta la publicación
      pub.estado = 'ACCEPTED';
      dbSimulada.publicaciones.set(pub.id, pub);

      const pubVerificada = dbSimulada.publicaciones.get(pub.id);
      expect(pubVerificada.estado).toBe('ACCEPTED');
    });

    test('debe categorizar correctamente el impacto del medio donde se publica', () => {
      // Impacto Excelente
      expect(clasificarImpactoRevista(12.5)).toBe('Excelente');
      // Impacto Alto
      expect(clasificarImpactoRevista(6.8)).toBe('Alto');
      // Impacto Medio
      expect(clasificarImpactoRevista(3.2)).toBe('Medio');
      // Impacto Bajo
      expect(clasificarImpactoRevista(1.1)).toBe('Bajo');
    });
  });

  describe('3. Motor de Búsqueda y Filtrados', () => {
    test('debe buscar y filtrar proyectos por coincidencia de texto (case-insensitive)', async () => {
      await dbSimulada.insertarProyecto({ nombre: 'Inteligencia Artificial e Innovación Inteligente' });
      await dbSimulada.insertarProyecto({ nombre: 'Sistemas de Recomendación Inteligente' });
      await dbSimulada.insertarProyecto({ nombre: 'Computación Verde y Eficiente' });

      const buscarProyectos = (termino) => {
        const query = termino.toLowerCase();
        return Array.from(dbSimulada.proyectos.values()).filter(p => 
          p.nombre.toLowerCase().includes(query)
        );
      };

      // Búsqueda 1: Coincidencia múltiple
      const resultadosMultiples = buscarProyectos('inteligente');
      expect(resultadosMultiples.length).toBe(2);

      // Búsqueda 2: Coincidencia única
      const resultadosUnicos = buscarProyectos('verde');
      expect(resultadosUnicos.length).toBe(1);
      expect(resultadosUnicos[0].nombre).toBe('Computación Verde y Eficiente');

      // Búsqueda 3: Sin coincidencias
      const sinResultados = buscarProyectos('Blockchain');
      expect(sinResultados.length).toBe(0);
    });
  });
});
