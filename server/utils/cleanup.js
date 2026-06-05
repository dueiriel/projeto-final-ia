const fs = require('node:fs/promises');

async function removeFiles(paths) {
  await Promise.all(
    paths
      .filter(Boolean)
      .map(async (filePath) => {
        try {
          await fs.unlink(filePath);
        } catch (error) {
          if (error.code !== 'ENOENT') {
            console.warn(`Não foi possível remover arquivo temporário ${filePath}: ${error.message}`);
          }
        }
      })
  );
}

module.exports = {
  removeFiles
};
