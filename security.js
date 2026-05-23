function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/UNION\s+SELECT/gi, '')
    .replace(/--/g, '')
    .replace(/DROP\s+TABLE/gi, '');
}

module.exports = { sanitizeInput };
