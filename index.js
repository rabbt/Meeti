const express = require('express');
const path = require('path');
const  bodyParser = require('body-parser');
const router = require('./routes');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session')
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');

//configuracion y modelos BD
const db = require('./config/db');
require('./models/Usuarios');
db.sync().then(() => console.log('DB Conectada')).catch((error) => console.log(error));

//Variables de Desarrollo
require('dotenv').config({path:'variables.env'});

//aplicacion principal
const app = express();

//Body parser, leer formularios
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}));

//express validator
app.use(expressValidator())

//Habilitar EJS como template engine
app.use(expressLayouts)
app.set('view engine' , 'ejs')

//ubicacion vistas
app.set('views', path.join(__dirname, './views'));

//archivos staticos
app.use(express.static('public'));

//habilitar cookie parser
app.use(cookieParser());

//crear la sesion 
app.use(session({
    secret: process.env.SECRETO,
    key:process.env.KEY,
    resave: false,
    saveUninitialized: false,
 }))

 //Agrega flash messages
 app.use(flash());

//middleware {usuario logueado, flash messages, fecha actual}
app.use((req,res,next) => {
    res.locals.mensajes = req.flash();
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    next()
});

//routing
app.use('/',router());


//agrega el puerto
app.listen(process.env.PORT, () => {
    console.log('El servidor esta funcionando');
});