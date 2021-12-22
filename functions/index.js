// TUTORIAL PARA EMPEZAR Y DESPLEGAR FUNCIONES: https://firebase.google.com/docs/functions/get-started?authuser=1
// Siguiente Tuto: https://firebase.google.com/docs/functions/database-events?authuser=1
// QUé puedo hacer con Cloud Functions: https://firebase.google.com/docs/functions/use-cases?authuser=1

// EJEMPLOS PARA REALTIME DATABASE https://firebase.google.com/docs/functions/database-events 

const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
/*
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
*/
// Take the text parameter passed to this HTTP endpoint and insert it into 
// Firestore under the path /messages/:documentId/original
exports.addMessage = functions
  .region('europe-west1')
  .https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await admin.firestore().collection('messages').add({original: original});
  // Send back a message that we've successfully written the message
  res.json({result: `Message with ID: ${writeResult.id} added.`});
});

// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
exports.makeUppercase = functions
  .region('europe-west1')
  .firestore.document('/messages/{documentId}')
    .onCreate((snap, context) => {
      // Grab the current value of what was written to Firestore.
      const original = snap.data().original;
      // EXAMPLE de llamada: http://localhost:5001/smartcity-e45bb/europe-west1/addMessage?text=uppercaseme
      // Access the parameter `{documentId}` with `context.params`
      functions.logger.log('Uppercasing', context.params.documentId, original);
      
      const uppercase = original.toUpperCase();
      
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to Firestore.
      // Setting an 'uppercase' field in Firestore document returns a Promise.
      return snap.ref.set({uppercase}, {merge: true});
    });

exports.addAccidente = functions
  .region('europe-west1')
  .https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const lugar = req.query.lugar;
    // Push the new message into Firestore using the Firebase Admin SDK.
    const writeResult = await admin.firestore().collection('accidentes').add({lugar: lugar});
    // Send back a message that we've successfully written the message
    // res.json({result: `Message with ID: ${writeResult.id} added.`});
    res.json({result: `Message with ID: added.`});
  });

exports.saveAccidente = functions // FUNCIONANDO
  .region('europe-west1')
  .database.ref('/accidentes/{accidenteId}') // Para realtime database
    .onCreate((snap, context) => {
      // Grab the current value of what was written to Firestore.
      const lugar = "nuevoLugarCrear";
      functions.logger.log('Creando...', context.params.documentId);
      functions.logger.log('CreandoSnap...', snap);
      
      return snap.ref.child("lugar").set(lugar);
      // .set(estado, {merge: true});
    });

exports.updateAccidente = functions // FUNCIONANDO
  .region('europe-west1')
  .database.ref('/accidentes/{accidenteId}') // Para realtime database
    .onUpdate((change, context) => {
      const accidenteId = context.params.accidenteId; // the id of the entry that was just updated.
        console.log(`A published accidente has just been updated, Id: ${accidenteId}`);

        const updatedLugarContent = change.after.val().lugar; // the new value
        const previousLugarContent = change.before.val().lugar; // the previous value
        console.log(`${accidenteId} changed the content from: ${previousLugarContent} to ${updatedLugarContent}`);
        
        return change.after.ref.child('atendido').set(true);

    });
