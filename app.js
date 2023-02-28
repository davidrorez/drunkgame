// 1 - Invocamos a Express
const express = require('express');
const app = express();
//2 - Para poder capturar los datos del formulario (sin urlencoded nos devuelve "undefined")
app.use(express.urlencoded({ extended: false }));
app.use(express.json());//además le decimos a express que vamos a usar json

//3- Invocamos a dotenv
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' });

//4 -seteamos el directorio de assets
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

//5 - Establecemos el motor de plantillas
app.set('view engine', 'ejs');

//6 -Invocamos a bcrypt
const bcrypt = require('bcryptjs');

//7- variables de session
const session = require('express-session');
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));


// 8 - Invocamos a la conexion de la DB
const connection = require('./database/db');
const { name, openDelimiter } = require('ejs');
const { cssHooks } = require('jquery');

//variables 
let nameTest = [];
app.locals.nameTest = nameTest;
let flag;
let newN = [];


//9 - establecemos las rutas
app.get('/', (req, res) => {

	nameTest.length = 0; //resetear los jugadores
	newN.length = 0;
	let alert = {
		alert: true,
		alertTitle: "¡Atención!",
		alertMessage: "El consumo excesivo de alcohol es nocivo para la salud.",
		alertIcon: 'info',
		showConfirmButton: true,
		confirmButtonColor: "#343a40",
		iconColor: "#4e54c8",
		ruta: '/',
	};
	res.render('index', alert);
});

app.post('/players', (req, res) => {

	//crear validaciones de los nombres
	//validacion error
	if (nameTest.length < 6) {
		nameTest.push(req.body.playerName);
	} else {
		flag = true;
	}

	res.render('players');
});

app.get('/players', (req, res) => {

	res.render('players', { nameTest, flag });
});

app.get('/info', (req, res) => {

	res.render('info');
});

app.get('/contact', (req, res) => {

	res.render('contact');
});


app.get('/game', (req, res) => {

	let challenges = ['Todos los jugadores de pelo color negro toman un shot',
		'Besate con el jugador que está a tu derecha o toma 2 shots',
		'Si tu mejor amigo/a también está jugando ambos toman',
		'El jugador que está a tu izquierda toma un shot']
	let numRn2 = Math.floor(Math.random() * challenges.length);

	if (newN.length == 0) {
		newN = nameTest.slice();
	}
	if (nameTest.length == 0) {
		res.render('error');
	} else {
		res.render('game', {
			name: 'Reto para ' + newN.shift(),
			challenge: challenges,
			random: numRn2,
	
		});
	}
	
});

app.get('*', (req, res) => {
	res.render('error');
})


//función para limpiar la caché luego del logout
app.use(function (req, res, next) {
		res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	next();
});


app.listen(3000, (req, res) => {
	console.log('SERVER RUNNING IN http://localhost:3000');
});
