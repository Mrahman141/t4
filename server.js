/************************************************************************* * 
 * Your app’s URL (from Cyclic) :   https://dizzy-bear-capris.cyclic.app/ * 
 **************************************************************************/


var express = require("express");
const exphbs = require('express-handlebars');
const { type } = require("os");
var app = express();
const multer = require("multer");
var path = require("path");
const fs = require('node:fs');


var test4_mod = require("./final");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.engine('.hbs', exphbs.engine({ extname: '.hbs',
}));

app.set('view engine', '.hbs');


app.use(express.static('public'));

var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/register", function(req, res){
    res.sendFile(path.join(__dirname, "/views/register.html"));
});

app.get("/signIn", function(req, res){
    res.sendFile(path.join(__dirname, "/views/signIn.html"));
});

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.post("/register", (req, res) => {

test4_mod.register(req.body).then((user)=>{
    let resText = "<p>"+user.email+" registered successfully.</p>";
    resText += "<h1><a href='/'>Go Home</a></h1>";
    res.send(resText);
}).catch((err)=>{
    let resText = "<p>"+err+"</p>";
    resText += "<h1><a href='/'>Go Home</a></h1><br>";
    resText += "<h1><a href='/register'>Register</a></h1>";
    res.send(resText);
})

});

app.post("/signIn", (req, res) => {

    test4_mod.signIn(req.body).then((user)=>{
        let resText = "<p>"+user.email+" Signed in successfully.</p>";
        resText += "<h1><a href='/'>Go Home</a></h1>";
        res.send(resText);
    }).catch((err)=>{
        let resText = "<p>"+err+"</p>";
        resText += "<h1><a href='/'>Go Home</a></h1><br>";
        resText += "<h1><a href='/signIn'>Register</a></h1>";
        res.send(resText);
    })
});

app.get('*', function(req, res){
    var text = 'Error:404 page not found. <br/> You are not supposed to be here. Please go back to home';
    text += "<a href='/'> Home </a>";
    res.send(text, 404);
});

test4_mod.startDB().then(()=>{
    app.listen(HTTP_PORT, onHttpStart);
}).catch((mesg)=>{
    console.log(mesg);
})