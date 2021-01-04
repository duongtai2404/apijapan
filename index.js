var express = require('express');
var bodyParser = require('body-parser');
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

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended : true}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());
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

app.post('/api/course',(req,res)=>{
 	let course = req.body;
	 let isExitsName = (nameCourse) => {
	 	return new Promise((resolve,reject)=> {
	 		let query = "SELECT name FROM course WHERE name='" + course.name +"'";
	 		con.query(query,(err,results)=>{
			 	if(err) throw err;
			 	if(results.length === 0){
			 		resolve(false);
			 	}
			 	else{
			 		resolve(true);
			 	}
			 });
	 	});
	 }
	 let addCourse = (course)=>{
	 	return new Promise((resolve,reject)=>{
	 		 let query = "INSERT INTO course (name,img) VALUE (?,?)";
			 con.query(query,[course.name,course.img],(err,results)=>{
			 	if(err) throw err;
			 	res.json(course);
			 });
	 	});
	 };
	isExitsName(course.name).then((results)=>{
	 	if(!results){
	 		addCourse(course);
	 	}
	 	else{
	 		res.json({result: "courseIsExits"});
	 	}
	 }).catch((reject)=>{

	 });

})
//comment
//get detail course with id
app.get('/api/course/:id',(req,res) => {
	let id = req.params.id ;
	var sql = "SELECT id,jWord,vnWord,imgWord,type FROM detailcourse WHERE idCourse=" + id;
	con.query(sql, function(err, results) {
    if (err) throw err;
    res.json(results);
  });
});
// update course with id
app.put('/api/course/:id',(req,res) => {
	let id = req.params.id ;
	let course = req.body;
	var sql = "UPDATE course SET name = ?, img = ? WHERE id = ?";
	con.query(sql,[course.name,course.img,id], function(err, results) {
    if (err) throw err;
    res.json(results);
  });
});
// add detailcourse
app.post('/api/detailcourse',(req,res)=>{
	let idCourse = req.body.idCourse;
	let detailCourse = req.body;
	let isExitsCourse = (idCourse) => {
		return new Promise((resolve,reject)=>{
			let sql = "SELECT id FROM course WHERE id=" + idCourse;
			con.query(sql,(err,results)=>{
			if(err) throw err;
			if(results.length !== 0){
				resolve(true);
			}
			else{
				resolve(false);
			}
			});
		});
	};
	let isExitsCourseWord = (jWord,idCourse)=>{
		return new Promise((resolve,reject) => {
			let sql = "SELECT * FROM detailcourse WHERE jWord = ? AND idCourse = ?";
			con.query(sql,[jWord,idCourse],(err,results,fields)=>{
			 	if(err) throw err;
			 	if(results.length !== 0){
					resolve(true);
				}
				else{
					resolve(false);
				}
			 });
		});
	};

	let addDetailCourse = (detailCourse) => {
		return new Promise((resolve,reject) => {
			isExitsCourseWord(detailCourse.jWord,detailCourse.idCourse).then((results)=>{
		 		if(results){
		 			res.json({result : "jWord is Exits"})
		 		}
		 		else{
		 			let sql = "INSERT INTO detailcourse (jWord,vnWord,idCourse,type,imgWord) VALUE (?,?,?,?,?)";
					con.query(sql,[detailCourse.jWord,detailCourse.vnWord,detailCourse.idCourse,detailCourse.type,detailCourse.imgWord],(err,results,fields)=>{
		 			if(err) throw err;
		 			res.json(detailCourse);
		 			});
		 		}
			 });
		});
	};

	isExitsCourse(idCourse).then((results)=>{
		if(results){
			addDetailCourse(detailCourse);
		}
		else{
			res.json({result : "courseNotExits"});
		}
	});
});
//update detailcourse with id
app.put('/api/detailcourse/:id',(req,res) => {
	let id = req.params.id ;
	let detailcourse = req.body;
	var sql = "UPDATE detailcourse SET jWord = ?,vnWord = ?,idCourse = ?,type = ?,imgWord = ? WHERE id = ?";
	con.query(sql,[detailcourse.jWord,detailcourse.vnWord,detailcourse.idCourse,detailcourse.type,detailcourse.imgWord,id], function(err, results) {
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
// add vocabulary
app.post('/api/vocabulary',(req,res)=>{
 let vocabulary = req.body;
 let name = req.body.name;
 let isExitsVocabulary = (name)=>{
 	return new Promise((resolve,reject)=>{
		let sql = "SELECT * FROM vocabulary WHERE name = ?";
		con.query(sql,[name],(err,results,fields)=>{
		 	if(err) throw err;
		 	if(results.length !== 0){
				resolve(true);
			}
			else{
				resolve(false);
			}
		 });
 	});
 };
 let addVocabulary = (vocabulary)=>{
	return new Promise((resolve,reject)=>{
		let sql = "INSERT INTO vocabulary (name) VALUE (?)";
		con.query(sql,[vocabulary.name],(err,results,fields)=>{
		 	if(err) throw err;
		 	res.json(vocabulary);
		 });
 	});
 };
 isExitsVocabulary(name).then((results)=>{
		if(results){
			res.json({result : "Name vocabulary is Exits"});
		}
		else{
			addVocabulary(vocabulary);
		}
	});
});

//get detail vocabulary with id
app.get('/api/vocabulary/:id', (req,res) => {
	let id = req.params.id ;
	var sql = "SELECT dv.id,jWord,vnWord,imgWord,tw.name,tw.shortName FROM detailvocabulary as dv, typeword AS tw WHERE typeWord=tw.id and idVocabulary=" 
	+ id + " ORDER BY dv.id;" ;
	con.query(sql, function(err, results) {
    if (err) throw err;
    res.json(results);
  });
});
//update vocabulary with id
app.put('/api/vocabulary/:id', (req,res) => {
	let id = req.params.id ;
	let vocabulary = req.body;
	var sql = "UPDATE vocabulary SET name = ? WHERE id = ?";
	con.query(sql,[vocabulary.name, id], function(err, results) {
    if (err) throw err;
    res.json(results);
  });
});
// add detailvocabulary
app.post('/api/detailvocabulary',(req,res)=>{
	let idVocabulary = req.body.idVocabulary;
	console.log(idVocabulary);
	let typeWord = req.body.typeWord;
	let jWord = req.body.jWord;
	let detailVocabulary = req.body;
	let isExitsVocabulary = (idVocabulary) => {
		return new Promise((resolve,reject)=>{
			let sql = "SELECT id FROM vocabulary WHERE id=" + idVocabulary;
			console.log(sql);
			con.query(sql,(err,results)=>{
			if(err) throw err;
			if(results.length !== 0){
				resolve(true);
			}
			else{
				resolve(false);
			}
			});
		});
	};
	let isExitsTypeWord = (typeWord) =>{
		return new Promise((resolve,reject)=>{
			let sql = "SELECT id FROM typeword WHERE id=" + typeWord;
			con.query(sql,(err,results)=>{
			if(err) throw err;
			if(results.length !== 0){
				resolve(true);
			}
			else{
				resolve(false);
			}
			});
		});
	};
	let isExitsVocabularyWord = (jWord,idVocabulary)=>{
		console.log(jWord,idVocabulary);
		return new Promise((resolve,reject) => {
			let sql = "SELECT * FROM detailvocabulary WHERE jWord = ? AND idVocabulary = ?";
			con.query(sql,[jWord,idVocabulary],(err,results,fields)=>{
			 	if(err) throw err;
			 	if(results.length !== 0){
					resolve(true);
				}
				else{
					resolve(false);
				}
			 });
		});
	};

	let addDetailVocabulary = (detailVocabulary) => {
		return new Promise((resolve,reject) => {
			let sql = "INSERT INTO detailvocabulary (jWord,vnWord,typeWord,idVocabulary) VALUE (?,?,?,?)";
			con.query(sql,[detailVocabulary.jWord,detailVocabulary.vnWord,detailVocabulary.typeWord,detailVocabulary.idVocabulary],(err,results,fields)=>{
 				if(err) throw err;
 				res.json(detailVocabulary);
 			});
		});
	};

	isExitsVocabulary(idVocabulary).then((results)=>{
		if(results){
			isExitsTypeWord(typeWord).then((results)=>{
				if(results){
					isExitsVocabularyWord(jWord,idVocabulary).then((results)=>{
						if(results){
							res.json({result : "Name detailVocabulary is Exits"});
						}
						else{
							addDetailVocabulary(detailVocabulary);
						}
					});
				}
				else{
					res.json({result : "TypeWordNotExits"});
				}
			});
		}
		else{
			res.json({result : "VocabularyNotExits"});
		}
	});
});
//update detailvocabulary with id
app.put('/api/detailvocabulary/:id', (req,res) => {
	let id = req.params.id ;
	let detailvocabulary = req.body;
	var sql = "UPDATE detailvocabulary SET jWord = ?,vnWord = ?,typeWord = ?,idVocabulary = ? WHERE id = ?";
	con.query(sql,[detailvocabulary.jWord,detailvocabulary.vnWord,detailvocabulary.typeWord,detailvocabulary.idVocabulary,id], function(err, results) {
    if (err) throw err;
    res.json(results);
  });
});
//get grammar
app.get('/api/grammar', (req,res) => {
	let id = req.params.id ;
	var sql = "SELECT id , name , content as url FROM grammar" ;
	con.query(sql, function(err, results) {
    if (err) throw err;
    res.json(results);
  });
});
// add grammar
app.post('/api/grammar',(req,res)=>{
 let grammar = req.body;
 let name = req.body.name;
 let isExitsGrammar = (name)=>{
 	return new Promise((resolve,reject)=>{
		let sql = "SELECT * FROM grammar WHERE name = ?";
		con.query(sql,[name],(err,results,fields)=>{
		 	if(err) throw err;
		 	if(results.length !== 0){
				resolve(true);
			}
			else{
				resolve(false);
			}
		 });
 	});
 };
 let addGrammar = (grammar)=>{
	return new Promise((resolve,reject)=>{
		let sql = "INSERT INTO grammar (name,content) VALUE (?,?)";
		con.query(sql,[grammar.name,grammar.url],(err,results,fields)=>{
		 	if(err) throw err;
		 	res.json(grammar);
		 });
 	});
 };
 isExitsGrammar(name).then((results)=>{
		if(results){
			res.json({result : "Name grammar is Exits"});
		}
		else{
			addGrammar(grammar);
		}
	});
});
app.listen(port,function(){
    console.log('Node server running @ http://localhost:' + port)
});

// update grammar with id
app.put('/api/grammar/:id', (req,res) => {
	let id = req.params.id ;
	let grammar = req.body;
	console.log(id,grammar);
	var sql = "UPDATE grammar SET name = ?,content = ? WHERE id = ?";
	con.query(sql,[grammar.name,grammar.url,id], function(err, results) {
    if (err) throw err;
    res.json(results);
  });
});