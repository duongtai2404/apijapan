var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

//config connect db
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "ixnzh1cxch6rtdrx.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  user: "cbua1o5kgyu35taq",
  password: "s3fbdtkmn7351y92",
  database: "d858igmcf4agz2e2"
});


//test connect db
// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!!!")
// });

//get /
app.get('/', (req, res) => {
  res.send('Hello');
});

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