/**
 * Utilidades de lógica de negocio para la gestión de proyectos e investigaciones
 */

/**
 * Valida si un identificador DOI (Digital Object Identifier) tiene un formato correcto.
 * Un DOI válido comienza con "10." seguido de un número de 4 o más dígitos, una barra "/" y un sufijo.
 * Ejemplo: 10.1016/j.cell.2023.05.001
 * 
 * @param {string} doi - El identificador DOI a validar.
 * @returns {boolean} True si el formato es válido, False en caso contrario.
 */
function validarDOI(doi) {
  if (typeof doi !== 'string') {
    return false;
  }
  // Expresión regular estándar para DOIs comunes: 10.xxxx/xxxxx
  const doiRegex = /^10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+$/;
  return doiRegex.test(doi.trim());
}

/**
 * Calcula la duración en meses de un proyecto de investigación y valida las fechas.
 * 
 * @param {string|Date} fechaInicio - Fecha de inicio del proyecto.
 * @param {string|Date} fechaFin - Fecha de finalización del proyecto.
 * @returns {number} Duración en meses redondeada.
 */
function calcularDuracionProyectoMeses(fechaInicio, fechaFin) {
  if (!fechaInicio || !fechaFin) {
    throw new Error("Ambas fechas son obligatorias");
  }

  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);

  if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
    throw new Error("Formatos de fecha inválidos");
  }

  if (fin < inicio) {
    throw new Error("La fecha de finalización no puede ser anterior a la fecha de inicio");
  }

  const aniosDiferencia = fin.getFullYear() - inicio.getFullYear();
  const mesesDiferencia = fin.getMonth() - inicio.getMonth();
  
  // Calcular duración total en meses
  let totalMeses = (aniosDiferencia * 12) + mesesDiferencia;
  
  // Si queda alguna fracción de días significativa en el mes, aproximamos
  const diasDiferencia = fin.getDate() - inicio.getDate();
  if (diasDiferencia >= 15) {
    totalMeses += 1;
  }

  return totalMeses;
}

/**
 * Clasifica la categoría de impacto de una publicación científica según su Factor de Impacto (Journal Impact Factor - JIF)
 * 
 * @param {number} factorImpacto - El JIF de la revista.
 * @returns {string} Clasificación ("Excelente", "Alto", "Medio", "Bajo")
 */
function clasificarImpactoRevista(factorImpacto) {
  if (typeof factorImpacto !== 'number' || isNaN(factorImpacto)) {
    throw new Error("El factor de impacto debe ser un número válido");
  }

  if (factorImpacto < 0) {
    throw new Error("El factor de impacto no puede ser negativo");
  }

  if (factorImpacto >= 10) {
    return "Excelente"; // Revistas de primer nivel mundial (Nature, Science, etc.)
  } else if (factorImpacto >= 5) {
    return "Alto";
  } else if (factorImpacto >= 2) {
    return "Medio";
  } else {
    return "Bajo";
  }
}

module.exports = {
  validarDOI,
  calcularDuracionProyectoMeses,
  clasificarImpactoRevista
};
