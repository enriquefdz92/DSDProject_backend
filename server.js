'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const fs = require('fs');
// App
const app = express();
app.set('view engine', 'html');

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
  var arreglo=[]
  for(var i = 0; i < team.length; i++) {
    var obj = team[i];
    var json={"name":obj.name+" "+obj.lastname,"id":obj.id}
    console.log(json)
    arreglo.push(json)
  }
  json=JSON.stringify(arreglo)
  console.log("here comes json")
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true); // If needed
  res.end(json)
});

app.get('/teambad', (req, res) => {
  let rawdata = fs.readFileSync('curriculums.json');  
  let team = JSON.parse(rawdata);
  var arreglo=[]
  for(var i = 0; i < team.length; i++) {
    var obj = team[i];
    var json={"name":obj.name+" "+obj.lastname,"id":obj.id}
    console.log(json)
    arreglo.push(json)
  }
  json=JSON.stringify(arreglo)
  console.log("here comes json")
  res.end(json)
});
//devolver toda la informacion de acuerdo al id
app.get("/cv/:id", (req, res) => {
  console.log(req.params.id)
  var json=JSON.stringify(req.params.id);
  let rawdata = fs.readFileSync('curriculums.json');  
  let team = JSON.parse(rawdata);  
  console.log(typeof(team))
  console.log(team.length)
  var busqueda="";
  for(var i = 0; i < team.length; i++) {
    var obj = team[i];
    if(obj.id==req.params.id){
      busqueda=i
    }
  }
  console.log(team[busqueda]);
  json=JSON.stringify(team[busqueda])
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true); // If needed
  res.end(json)
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);