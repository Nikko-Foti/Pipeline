var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    flash = require("connect-flash"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    Requisition = require("./models/requisition"),
    methodOverride = require("method-override"),
    Candidate = require("./models/candidate"),
    crypto = require("crypto"),
    asink = require("async"),
    nodemailer = require("nodemailer");
    
var indexRoutes = require("./routes/index"),
    reqRoutes = require("./routes/reqs"),
    candidateRoutes = require("./routes/candidates"),
    processRoutes = require("./routes/process"),
    archiveRoutes = require("./routes/archive"),
    todoRoutes = require("./routes/todo");
    
var url = process.env.DATABASEURL || "mongodb://localhost/pipeline"
    
mongoose.connect(url);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "that dude neek is the man",
    cookie: { maxAge: 60000000 },
    resave: false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Adding user information to each route
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});




app.use(indexRoutes);
app.use(candidateRoutes);
app.use(reqRoutes);
app.use(processRoutes);
app.use(archiveRoutes);
app.use(todoRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("We're online!!!")
});