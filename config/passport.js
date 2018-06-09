// config/passport.js

// load all the things we need
var express = require('express');
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var configAuth = require('./auth');
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
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses email and password, we will override with email
            emailField : 'signup_email',
            passwordField : 'password1',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password1, done) {
            var email = req.body.signup_email;
            var name = req.body.name;
            console.log("Values from form : ", username, name, email, password1);
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            connection.query("SELECT * FROM app_users WHERE username = ?",[username], function(err, row){
                if(err){
                    console.log("Error while serching app user : ", err);
                }
                if(!row.length){
                    console.log("This username is not registered.");
                    return done(null, false, req.flash('signupMessage','No such username is registered. Please enter username provided by us.'))
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
                            name : name,
                            email: email,
                            provider: 'local',
                            password: bcrypt.hashSync(password1, null, null)  // use the generateHash function in our user model
                        };

                        var insertQuery = "INSERT INTO users (username, name, email, password, provider ) values (?,?,?,?,?)";

                        connection.query(insertQuery,[newUserMysql.username, newUserMysql.name, newUserMysql.email, newUserMysql.password, newUserMysql.provider],function(err, rows) {
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
            });
           
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses email and password, we will override with email
            emailField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form
        // console.log('From login form : ', email, password);
            connection.query("SELECT * FROM users WHERE email = ?",[email], function(err, rows){
                console.log('user searched....');
                if (err)
                    return done(err);
                if (!rows.length) {
                    console.log('loginMessage', 'No user found.');
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                console.log('loginMessage', 'Oops! Wrong password.');
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );

    
    var fbOpts = {
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        profileFields: ['emails','id', 'name', 'gender', 'displayName'],
        passReqToCallback : true
    };

    passport.use('facebook', new FacebookStrategy(fbOpts,
        function(req, accessToken, refreshToken, profile, done) {
            console.log('FB accessToken : ', accessToken, ' FB refreshToken: ', refreshToken, ' FB profile : ', profile);
        
            connection.query("SELECT * FROM users WHERE facebook_id = ?", profile.id, function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, rows[0]);
                    
                } else {
                    // if there is no facebook user id with that id
                    // create the facebook user
                    var newUserMysql = {
                        facebook_id: profile.id,
                        name: profile.displayName,
                        facebook_token: accessToken,
                        email: profile.emails[0].value,
                        provider: profile.provider,
                        password: bcrypt.hashSync(profile.emails[0].value, null, null)  // use the generateHash function in our user model
                    };
                    console.log("newUser Facebook details : ");
                    console.log(newUserMysql);
                    var insertQuery = "INSERT INTO users (facebook_id, name, email, password, facebook_token, provider) values (?,?,?,?,?,?)";
                    // connection.query(insertQuery,[newUserMysql.facebook_id, newUserMysql.name, newUserMysql.email, newUserMysql.password, newUserMysql.facebook_token, newUserMysql.provider]);
                    connection.query(insertQuery,[newUserMysql.facebook_id, newUserMysql.name, newUserMysql.email, newUserMysql.password, newUserMysql.facebook_token, newUserMysql.provider],
                        function(err, rows) {
                        // console.log("rows = "+rows);
                        if(err){
                            console.log("error",err);
                        }
                        newUserMysql.id = rows.insertId;
                        return done(null, newUserMysql);
                    });
                }
            });
          })
        // })
      );

   
    passport.use('twitter', new TwitterStrategy({
        consumerKey: configAuth.twitterAuth.consumerKey,
        consumerSecret: configAuth.twitterAuth.consumerSecret,
        callbackURL: configAuth.twitterAuth.callbackURL
      },
      function(token, tokenSecret, profile, done) {
          
            console.log(' Tw token : ',token, ' Tw tokenSecret : ', tokenSecret, ' Tw profile : ', profile);
        
            connection.query("SELECT * FROM users WHERE twitter_id = ?", profile.id, function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, rows[0]);
                    
                } else {
                    // if there is no titter user id with that id
                    // create the twitter user
                    var newUserMysql = {
                        twitter_id: profile.id,
                        name: profile.displayName,
                        twitter_token: token,
                        provider: profile.provider,
                        // email: profile.emails[0].value,
                        password: bcrypt.hashSync(profile.id, null, null)  // use the generateHash function in our user model
                    };
                    console.log("newUser Twitter details : ");
                    console.log(newUserMysql);
                    var insertQuery = "INSERT INTO users (twitter_id, name, password, twitter_token, provider) values (?,?,?,?,?)";
                    // connection.query(insertQuery,[newUserMysql.twitter_id, newUserMysql.name, newUserMysql.password, newUserMysql.twitter_token, newUserMysql.provider]);
                    connection.query(insertQuery,[newUserMysql.twitter_id, newUserMysql.name, newUserMysql.password, newUserMysql.twitter_token, newUserMysql.provider],
                        function(err, rows) {
                        console.log("rows = "+rows);
                        if(err){
                            console.log("error",err);
                        }
                        newUserMysql.id = rows.insertId;
                        return done(null, newUserMysql);
                    });
                }
            });
      }
    ));

   

    passport.use('google', new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL       
      },
      function(accessToken, refreshToken, profile, done) {
            console.log('G+ accessToken : ', accessToken, ' G+ refreshToken : ', refreshToken," G+ profile : ", profile);

            connection.query("SELECT * FROM users WHERE google_id = ?", profile.id, function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, rows[0]);
                    
                } else {
                    // if there is no google user id with that id
                    // create the google user
                    var newUserMysql = {
                        google_id: profile.id,
                        name: profile.displayName,
                        google_token: accessToken,
                        email: profile.emails[0].value,
                        provider: profile.provider,
                        password: bcrypt.hashSync(profile.id, null, null)  // use the generateHash function in our user model
                    };
                    console.log("newUser Google details : ");
                    console.log(newUserMysql);
                    var insertQuery = "INSERT INTO users (google_id, name, email, password, google_token, provider) values (?,?,?,?,?,?)";
                    // connection.query(insertQuery,[newUserMysql.google_id, newUserMysql.name newUserMysql.password, newUserMysql.google_token, newUserMysql.provider]);
                    connection.query(insertQuery,[newUserMysql.google_id, newUserMysql.name, newUserMysql.email, newUserMysql.password, newUserMysql.google_token, newUserMysql.provider],
                        function(err, rows) {
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
    ));
}
