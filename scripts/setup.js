const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.join(__dirname, '..');

for (const filename of ['admin_config', 'admin_tools']) {
  const source = path.join(projectRoot, `${filename}.example.json`);
  const destination = path.join(projectRoot, `${filename}.json`);
  try {
    fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
    console.log(`Created ${filename}.json`);
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    console.log(`Keeping existing ${filename}.json`);
  }
}

console.log('Review admin_config.json, start Ollama, then run npm start.');
