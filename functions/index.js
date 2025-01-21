const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Inicializa el SDK de Firebase Admin
admin.initializeApp();

const storage = admin.storage();

exports.getFont = functions.https.onRequest(async (req, res) => {
  try {
    const file = storage.bucket().file('fuentes/GreatVibes-Regular.ttf');
    const [fileContent] = await file.download();

    // Establece el tipo de contenido correctamente para TTF
    res.set('Content-Type', 'font/ttf');
    res.set('Content-Disposition', 'attachment; filename="GreatVibes-Regular.ttf"');
    res.send(fileContent);
  } catch (error) {
    res.status(500).send('Error al obtener la fuente: ' + error.message);
  }
});
