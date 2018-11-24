'use strict';

// format code with shift alt f

const express = require('express');
const bodyParser = require("body-parser");
var admin = require("firebase-admin");
var cors = require('cors')

// api settings
// https://console.cloud.google.com/apis/api/firestore.googleapis.com/credentials?project=cetysdsd
// npm install firebase-admin --save
// npm install firebase-functions@latest --save
// sudo npm install -g firebase-tools
// node version on package.json v6.14.0.
// delete node modules and npm install

//good references
// https://github.com/googleapis/nodejs-firestore
// https://cloud.google.com/nodejs/docs/reference/firestore/0.17.x/

// cetysDSD proyecto
//enable google cloud api
// https://console.cloud.google.com/flows/enableapi?apiid=firestore.googleapis.com

var serviceAccount = require("./cetysdsd-firebase-adminsdk-cgqgq-5dcb36595c.json");
const settings = {
  timestampsInSnapshots: true
};
// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const fs = require('fs');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cetysdsd.firebaseio.com"
});
var firestore = admin.firestore();
firestore.settings(settings)
var collection = firestore.collection('usuarios');

// App
const app = express();
app.use(cors())
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({
  extended: true,
  limit:"50mb"
}));
app.options('*', cors());


//devolver en ruta 1 lista de nombres, apellidos e id
//ejemplo:
// [
//   {"nombre":"Enrique Fernandez","id":"1"},
//   {"nombre":"Elizabeth Montoya","id":"2"},
//   {"nombre":"Oscar Rosete","id":"3"},
// ])
app.get('/team', (req, res) => {
  let rawdata = fs.readFileSync('curriculums.json');
  let team = JSON.parse(rawdata);
  var arreglo = []
  var arreglo2 = []

  for (var i = 0; i < team.length; i++) {
    var obj = team[i];
    var json = { "name": obj.name + " " + obj.lastname, "id": obj.id }
    // console.log(json)
    arreglo.push(json)
  }
  console.log("===information from database")
  collection.get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      // console.log(doc.id,"=>",doc.data().lastname)
      var json2 = { "name": doc.data().name + " " + doc.data().lastname, "id": doc.id }
      arreglo2.push(json2)
    })
    console.log("arreglo 2 ","=>",arreglo2)
    json = JSON.stringify(arreglo2)
    console.log("here comes json")
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    res.end(json)
  })
});

app.get('/teambad', (req, res) => {
  let rawdata = fs.readFileSync('curriculums.json');
  let team = JSON.parse(rawdata);
  var arreglo = []
  for (var i = 0; i < team.length; i++) {
    var obj = team[i];
    var json = { "name": obj.name + " " + obj.lastname, "id": obj.id }
    // console.log(json)
    arreglo.push(json)
  }
  json = JSON.stringify(arreglo)
  console.log("here comes json")
  res.end(json)
});

//devolver toda la informacion de acuerdo al id
app.get("/cv/:id", (req, res) => {
  console.log(req.params.id)
  var json = JSON.stringify(req.params.id);
  let rawdata = fs.readFileSync('curriculums.json');
  let team = JSON.parse(rawdata);
  // console.log(typeof (team))
  // console.log(team.length)
  var busqueda = "";
  for (var i = 0; i < team.length; i++) {
    var obj = team[i];
    if (obj.id == req.params.id) {
      busqueda = i
    }
  }
  console.log(team[busqueda]);
  json = JSON.stringify(team[busqueda])

  collection.doc(req.params.id).get()
  .then(function(doc) {
    if (doc.exists) {
        console.log("Document data:", doc.data());
        json=JSON.stringify(doc.data());
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        res.setHeader('Access-Control-Allow-Credentials', true); // If needed
        res.end(json)
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });
});

// https://api.jquery.com/jquery.post/
app.post("/cv/", (req, res) => {
  console.log("entre a cv")
  console.log(req.body.name)
  collection.doc(req.body.name+req.body.lastname+"id").set(
    req.body
  ).then(() => {
  var json = JSON.stringify(req.body.name+req.body.lastname+"id")
    console.log("Document created successfully.")
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    res.end(json)
  });
})


// Enter new data into the document erick1 of collection usuarios of firestore
// collection.doc('erick3').set({
//   name: 'erick3',
//   lastname: 'rosete3',
// }).then(() => {

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);