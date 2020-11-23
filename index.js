var express = require('express');
var app = express();
var port = 3000;

//config connect db
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "japan"
});


//test connect db
// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!!!")
// });


//access table 
app.get('/api/course', function (req, res) {
  var sql = "SELECT * FROM course";
  con.query(sql, function(err, results) {
    if (err) throw err;
    res.json(results);
  });
});

app.listen(port,function(){
    console.log('Node server running @ http://localhost:3000')
});