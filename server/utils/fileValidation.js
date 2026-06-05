const path = require('node:path');

function hasAllowedExtension(filename, allowedExtensions) {
  const extension = path.extname(filename || '').toLowerCase();
  return allowedExtensions.includes(extension);
}

function createFileFilter(allowedExtensions, label) {
  return (req, file, callback) => {
    if (hasAllowedExtension(file.originalname, allowedExtensions)) {
      callback(null, true);
      return;
    }

    callback(new Error(`${label} inválido. Use: ${allowedExtensions.join(', ')}`));
  };
}

module.exports = {
  createFileFilter,
  hasAllowedExtension
};
