const express = require('express'); //Server software
const bodyParser = require('body-parser'); //parser middleware
const session = require('express-session'); //session middleware
const passport = require('passport'); //authentication
const connectEnsureLogin = require('connect-ensure-login'); //authorization
const User = require('./user'); //User model
const app = express();

// Configuring the view engine
app.set('view-engine', 'ejs');

//configuring express-session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 *60 * 1000} //1 hour
}));
//configuring more middlewares
app.use(bodyParser.urlencoded({ extended: false}));
app.use(passport.initialize());
app.use(passport.session());
// configuring authentication strategy
passport.use(User.createStrategy());

// To use with sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.get('/', (req, res) => {
    res.render('index.ejs');
})

app.get('/login', (req, res) => {
    res.render('login.ejs');
})

app.post('/login', passport.authenticate('local', {
    failureRedirect: '/login'
}), (req, res) => {
    console.log(req.user);
    res.redirect('/dashboard')
})

// routes for register
app.get('/register', (req, res) => {
    res.render('register.ejs');
})

app.post('/register', (req, res) => {
    var username = req.body.username
    var pass = req.body.password
    /*
    The method below saves the password in the database as plain text
    // const user = new User({ username: username, password: pass})
    // user.save();
    */
   //This method saves the password as a hash
    User.register({ username: username, active: false}, pass)
    
    res.redirect('/secret');
})

//dashboard route for logged in users
app.get('/dashboard', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    res.send('Hello there, '+req.user.username+' Your session Id is: '+req.sessionID+
    ' your session will expire in: '+req.session.cookie.maxAge+' milliseconds'+
    '<a href="/secret">secret</a>');
});

app.get('/secret', (req, res) => {
    res.render('secret.ejs')
})

app.listen(5000, (req, res) => {
    console.log('Server is listening on port 5000...');
})
