var express = require('express');
var app = express();
var port = 3000;

//config connect db
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "japanese"
});


//test connect db
// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!!!")
// });


//access table course
app.get('/api/course', function (req, res) {
  var sql = "SELECT * FROM course";
  con.query(sql, function(err, results) {
    if (err) throw err;
    res.json(results);
  });
});

//get detail course with id
app.get('/api/course/:id', (req,res) => {
	let id = req.params.id ;
	var sql = "SELECT id,jWord,vnWord,imgWord FROM detailcourse WHERE idCourse=" + id;
	con.query(sql, function(err, results) {
    if (err) throw err;
    res.json(results);
  });
});

//get all vocabulary
app.get('/api/vocabulary', function (req, res) {
  var sql = "SELECT * FROM vocabulary";
  con.query(sql, function(err, results) {
    if (err) throw err;
    res.json(results);
  });
});

//get detail vocabulary with id
app.get('/api/vocabulary/:id', (req,res) => {
	let id = req.params.id ;
	var sql = "SELECT dv.id,jWord,vnWord,tw.name,tw.shortName FROM detailvocabulary as dv, typeword AS tw WHERE typeWord=tw.id and idVocabulary=" 
	+ id + " ORDER BY dv.id;" ;
	con.query(sql, function(err, results) {
    if (err) throw err;
    res.json(results);
  });
});

app.listen(port,function(){
    console.log('Node server running @ http://localhost:' + port)
});