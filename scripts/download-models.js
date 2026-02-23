const fs = require('fs');
const path = require('path');
const https = require('https');

const modelsDir = path.join(__dirname, '../public/assets/models');

if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

const filesToDownload = [
  'https://static.remove-bg.io/download/models/isnet-general-use/isnet-general-use.onnx',
  'https://static.remove-bg.io/download/models/ort-wasm-simd.wasm',
  'https://static.remove-bg.io/download/models/ort-wasm.wasm'
];

filesToDownload.forEach(url => {
  const fileName = path.basename(url);
  const destPath = path.join(modelsDir, fileName);
  
  if (!fs.existsSync(destPath)) {
    console.log(`Downloading ${fileName}...`);
    const file = fs.createWriteStream(destPath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Successfully downloaded ${fileName}`);
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      console.error(`Error downloading ${fileName}:`, err.message);
    });
  } else {
    console.log(`${fileName} already exists, skipping download.`);
  }
});
