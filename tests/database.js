/**
 * Simulador de Base de Datos Relacional de Alta Fidelidad
 * Simula restricciones de integridad de PostgreSQL / Supabase
 */

class DatabaseSimulada {
  constructor() {
    this.reset();
  }

  reset() {
    this.usuarios = new Map();
    this.proyectos = new Map();
    this.publicaciones = new Map();
    this.lineasInvestigacion = new Map();
    
    // Inicializar datos semilla para las pruebas
    this.lineasInvestigacion.set('linea-1', { id: 'linea-1', nombre: 'Inteligencia Artificial' });
  }

  // --- USUARIOS ---
  async registrarUsuario(email, password, nombre) {
    if (!email || !password) {
      throw new Error("El correo y contraseña son campos obligatorios");
    }

    // Restricción de Clave Única (Unique Constraint) - Código SQL: 23505
    for (const user of this.usuarios.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        const error = new Error(`duplicate key value violates unique constraint "usuarios_email_key"`);
        error.code = '23505';
        error.detail = `Key (email)=(${email}) already exists.`;
        throw error;
      }
    }

    const nuevoUsuario = {
      id: `usr-${Math.random().toString(36).substr(2, 9)}`,
      email,
      password,
      nombre,
      created_at: new Date().toISOString()
    };

    this.usuarios.set(nuevoUsuario.id, nuevoUsuario);
    return nuevoUsuario;
  }

  // --- PROYECTOS ---
  async insertarProyecto(proyecto) {
    if (!proyecto.nombre) {
      const error = new Error('null value in column "nombre" of relation "proyectos" violates not-null constraint');
      error.code = '23502';
      throw error;
    }

    // Restricción de Dominio (Presupuesto no negativo)
    if (proyecto.presupuesto !== undefined && proyecto.presupuesto !== null) {
      const presupuesto = parseFloat(proyecto.presupuesto);
      if (isNaN(presupuesto)) {
        const error = new Error('invalid input syntax for type numeric');
        error.code = '22P02';
        throw error;
      }
      if (presupuesto < 0) {
        const error = new Error('new row for relation "proyectos" violates check constraint "proyectos_presupuesto_check"');
        error.code = '23514';
        throw error;
      }
    }

    // Restricción de Clave Foránea con Línea de Investigación
    if (proyecto.id_linea && !this.lineasInvestigacion.has(proyecto.id_linea)) {
      const error = new Error(`insert or update on table "proyectos" violates foreign key constraint "proyectos_id_linea_fkey"`);
      error.code = '23503';
      error.detail = `Key (id_linea)=(${proyecto.id_linea}) is not present in table "lineas_investigacion".`;
      throw error;
    }

    const nuevoProyecto = {
      id: proyecto.id || `pry-${Math.random().toString(36).substr(2, 9)}`,
      id_linea: proyecto.id_linea || null,
      nombre: proyecto.nombre,
      descripcion: proyecto.descripcion || null,
      entidad_financiadora: proyecto.entidad_financiadora || null,
      fecha_inicio: proyecto.fecha_inicio || null,
      fecha_fin: proyecto.fecha_fin || null,
      presupuesto: proyecto.presupuesto ? parseFloat(proyecto.presupuesto) : null,
      estado: proyecto.estado || 'PENDING_APPROVAL',
      created_at: new Date().toISOString()
    };

    this.proyectos.set(nuevoProyecto.id, nuevoProyecto);
    return nuevoProyecto;
  }

  // --- PUBLICACIONES ---
  async insertarPublicacion(publicacion) {
    if (!publicacion.titulo) {
      const error = new Error('null value in column "titulo" of relation "publicaciones" violates not-null constraint');
      error.code = '23502';
      throw error;
    }

    // Restricción de Clave Foránea con Proyectos (Foreign Key Constraint) - Código SQL: 23503
    if (publicacion.id_proyecto && !this.proyectos.has(publicacion.id_proyecto)) {
      const error = new Error(`insert or update on table "publicaciones" violates foreign key constraint "publicaciones_id_proyecto_fkey"`);
      error.code = '23503';
      error.detail = `Key (id_proyecto)=(${publicacion.id_proyecto}) is not present in table "proyectos".`;
      throw error;
    }

    const nuevaPublicacion = {
      id: publicacion.id || `pub-${Math.random().toString(36).substr(2, 9)}`,
      id_proyecto: publicacion.id_proyecto || null,
      id_medio: publicacion.id_medio || null,
      doi: publicacion.doi || null,
      titulo: publicacion.titulo,
      autores: publicacion.autores || null,
      estado: publicacion.estado || 'SUBMITTED',
      created_at: new Date().toISOString()
    };

    this.publicaciones.set(nuevaPublicacion.id, nuevaPublicacion);
    return nuevaPublicacion;
  }
}

const dbSimulada = new DatabaseSimulada();

module.exports = { dbSimulada, DatabaseSimulada };
