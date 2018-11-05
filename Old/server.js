var express = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var MySQLStore = require('express-mysql-session')(session);

var mysql = require('mysql');
var port = process.env.PORT || 8889;

// var routes = require('./routes/routes');

var morgan = require('morgan'); 
var bodyParser = require('body-parser'); 
var methodOverride = require('method-override'); 
var moment = require('moment');
moment().format();

var app = express(); 
require('dotenv').config();
var passport = require('passport');
var flash = require('connect-flash');

// socket.io
var server = require('http').Server(app);
// var socket = require('socket.io');
// var io = socket(server);

// io.on('connection', function (sock) {
//     console.log("Socket added to patient socket.io.", sock.id);
//     sock.on('sent message', function (data) {
//         var sender = data.user;
//       console.log('Received a message from : ',data.user, ' - ', data.message);
//       sock.broadcast.emit('received message', { data2: sender, msg2: data.message});
//     });
//     // sock.on('read message', function (data){
//     //   var sender = data.user;
//     //   console.log('Message read by : ',data.user);
//     //   sock.broadcast.emit('refresh message', { data2: sender});
//     // })
// });



// Service worker requirements

// app.set('view engine', 'ejs');
// app.engine('html', require('ejs').renderFile);

require('./config/passport')(passport); // pass passport for configuration


var options = {
    host: process.env.DB_HOST,
	port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};
var session_options = {
    host: process.env.DB_HOST,
	port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    schema: {
        tableName: 'sessions_table',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires_column',
            data: 'data_column'
        }
    }
};



//connect to mysql
var conn = mysql.createConnection(options);
var sessionStore = new MySQLStore(session_options);

app.use(session({
  secret: process.env.SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { 
      secure: false, 
      maxAge: 7200000 // 2 hours
    }
}));

conn.connect(function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log('Connected to MySQL');
    }
});

app.use(express.static(__dirname+'/public'));
app.use(morgan('dev')); 
app.use(bodyParser.urlencoded({'extended':'true'})); 
app.use(bodyParser.json()); 
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');

// required for passport
app.use(session({
	secret: process.env.SECRET,
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./routes/routes.js')(app, conn);

server.listen(process.env.PORT || 8889);

// console.log('Node and socket.io server at port : '+ process.env.PORT || 8889);


