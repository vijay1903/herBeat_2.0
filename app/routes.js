
exports.routes = function(req, res){
res.render('routes', { title: 'ejs' });
};
// app/routes.js


module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('../public/views/index.html'); // load the index.html file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('../public/views/login.html', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/dashboard', // redirect to the secure dashboard section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('../public/views/signup.html', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/dashboard', // redirect to the secure dashboard section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// dashboard SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/dashboard', isLoggedIn, function(req, res) {
		res.render('../public/views/dashboard.html', {
			user : req.user // get the user out of session and pass to template
		});
	});
	// =====================================
	// Stat SECTION =========================
	// =====================================
	
	app.get('/statistics', isLoggedIn, function(req, res) {
		res.render('../public/views/statistics.html', {
			user : req.user // get the user out of session and pass to template
		});
	});

	app.get('/auth/facebook', passport.authenticate('facebook-login'));

	app.get('/auth/facebook/callback', 
		passport.authenticate('facebook-login', { 
			successRedirect: '/dashboard',
			failureRedirect: '/login' 
		}));

	app.route('/signup/facebook').get(passport.authenticate('facebook-signup'));
		
	app.route('/signup/facebook/callback')
		.get(passport.authenticate('facebook-signup', {
			sucessRedirect: '/dashboard',
			failureRedirect: '/login'
		}));

	app.route('/auth/twitter').get(passport.authenticate('twitter'));
		
	app.route('/auth/twitter/callback')
		.get(passport.authenticate('twitter', {
			sucessRedirect: '/dashboard',
			failureRedirect: '/login'
		}));

	app.get('/auth/google',
	passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
	

	app.get('/auth/google/callback', 
	passport.authenticate('google', { failureRedirect: '/login' }),
	function(req, res) {
		res.redirect('/dashboard');
	});


	app.get('/forgotpassword', function(req, res) {
		res.render('../public/views/forgotpassword.html'); // load the index.html file
	});


	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
