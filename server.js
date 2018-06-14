var express = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');

var mysql = require('mysql');
var port = process.env.PORT || 8080;

var routes = require('./routes/routes');

var morgan = require('morgan'); 
var bodyParser = require('body-parser'); 
var methodOverride = require('method-override'); 



var app = express(); 

var passport = require('passport');
var flash = require('connect-flash');
// var FacebookStrategy = require('passport-facebook');

// app.set('view engine', 'ejs');
// app.engine('html', require('ejs').renderFile);

require('./config/passport')(passport); // pass passport for configuration


//connect to mysql
var conn = mysql.createConnection({
    host: 'localhost',
	port: 3306,
    user: 'root',
    password: 'root',
    database: 'herbeat'
});

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
	secret: 'vijayvishwakarmahasdonethis',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./routes/routes.js')(app, conn);

app.listen(port);
console.log('Server at port : '+ port);


