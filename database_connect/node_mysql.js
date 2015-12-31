var fs = require('fs');

var ejs = require('ejs');
var mysql = require('mysql');
var body_parser = require('body-parser');

var Connect = require('connect');
var Router = require('router');

var connection = mysql.createConnection({
   
    user : 'root',
    password : 'password',
    database : 'sopt'
});

var connect = new Connect();
var router = new Router();

connect.use(body_parser.urlencoded({ 'extended' : true }));

router.get('/', function (request, response) {

    fs.readFile('list.ejs', 'utf8', function (error, data) {
        
        if (!error) {
            
            connection.query('select * from candidate;', function (error, query) {
                
                response.writeHead(200, { 'Content-Type' : 'text/html; charset=utf-8;' });
                response.end(ejs.render(data, { 'query' : query }));
            });
        }
        else {
         
            response.writeHead(503, { 'Content-Type' : 'text/html;' });
            response.end();
        }
    });
});


router.get('/insert', function (request, response) {

    fs.readFile('insert.html', 'utf8', function (error, data) {
        
        if (!error) {
            
            response.writeHead(200, { 'Content-Type' : 'text/html' });
            response.end(data);
        }
        else {
         
            response.writeHead(503, { 'Content-Type' : 'text/html;' });
            response.end();
        }
    });
});

router.post('/insert', function (request, response) {

    connection.query('insert into candidate (name, part, introduce) values (?, ?, ?);',
                  [ request.body.name, request.body.part, request.body.introduce ]);
    
    response.writeHead(302, { 'Location' : '/' });
    response.end();
});


router.get('/update/:id', function (request, response) {

   fs.readFile('update.ejs', 'utf8', function (error, data) {
       
       connection.query('select * from candidate where id = ?;', [ request.params.id ], 
                        
                        function (error, query) {
           
                            if (!error && query.length > 0) {
                            
                                response.writeHead(200, { 'Content-Type' : 'text/html' });
                                response.end(ejs.render(data, { 'item' : query[0] }));
                            }
                            else {
                            
                                response.writeHead(404, { 'Content-Type' : 'text/html' });
                                response.end();
                            }
                        });
   });
});

router.post('/update/:id', function (request, response) {
    
    connection.query('update candidate set name=?, part=?, introduce=? where id=?;',
                     [ request.body.name, request.body.part, request.body.introduce, request.params.id ]);
    
    response.writeHead(302, { 'Location' : '/' });
    response.end();
});


router.get('/delete/:id', function (request, response) {

    connection.query('delete from candidate where id=?;', [ request.params.id ]);
    
    response.writeHead(302, { 'Location' : '/' });
    response.end();
});


connect.use(router);
connect.listen(8080, function () {

    console.log("Server running on port 8080 :)");
});