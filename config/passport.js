// config/passport.js

// load all the things we need
var express = require('express');
// var passport = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
var app = express();

// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);
// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM users WHERE id = ? ", [id], function(err, rows){
            if(err){
                console.log(err);
                return done(null, err);
            }
            done(null, rows[0]);
        });
    });


    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses email and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form
        console.log('From login form : ', email, password);
            connection.query("SELECT * FROM users WHERE email = ?",[email], function(err, rows){
                console.log('user searched....');
                if (err)
                    return done(err);
                if (!rows.length) {
                    console.log('loginMessage', 'No user found.');
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }
                // if the user is found but the password is wrong

                // password: bcrypt.hashSync(password, null, null)
                if (!bcrypt.compareSync(password, rows[0].password, false)){
                console.log('loginMessage', 'Oops! Wrong password.');
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                }
                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );


    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses email and password, we will override with email
            usernameField : 'signup_email',
            passwordField : 'password1',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, signup_email, password1, done) {
            var email = signup_email;
            var username = req.body.username;
            var full_name = req.body.full_name;
            var password = password1;
            console.log("Values from signup form : ", username, full_name, email, password);
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            connection.query("SELECT * FROM app_users WHERE username = ?",[username], function(err, row){
                if(err){
                    console.log("Error while serching app user : ", err);
                }
                if(!row.length){
                    // console.log("This username is not in the record.");
                    return done(null, false, req.flash('signupMessage','No such username is registered. Please enter username provided by us.'))
                } else {
                    connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, row){
                        if(err){
                            console.log("Error while serching app user : ", err);
                        }
                        if(row.length){
                            // console.log("This username is in the record.");
                            return done(null, false, req.flash('signupMessage','You have already registered. Please Login.'))
                        } else {
                            connection.query("SELECT * FROM users WHERE email = ?",[email], function(err, rows) {
                                console.log('user searched.....');
                                if (err){
                                    console.log("Error while seraching user in db : ",err);
                                    return done(err);
                                }
                                if (rows.length) {
                                    console.log('That email is already registered.');
                                    return done(null, false, req.flash('signupMessage', 'That email is already registered.'));
                                } else {
                                    // if there is no user with that email
                                    // create the user
                                    var newUserMysql = {
                                        username : username,
                                        full_name : full_name,
                                        email: email,
                                        password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                                    };
                                    console.log(newUserMysql);

                                    var insertQuery = "INSERT INTO users (username, full_name, email, password ) values (?,?,?,?)";

                                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.full_name, newUserMysql.email, newUserMysql.password],function(err, rows) {
                                        // console.log("rows = "+rows);
                                        if(err){
                                            console.log("error",err);
                                        }
                                        newUserMysql.id = rows.insertId;

                                        return done(null, newUserMysql);
                                    });
                                }
                            }); 
                        }
                    }
                )}
            });
        })
    );

    
}
