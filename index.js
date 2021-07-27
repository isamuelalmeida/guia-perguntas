const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const connection  = require('./database/database');
const Pergunta  = require('./database/Pergunta');
const Resposta  = require('./database/Resposta');

// Database
connection.authenticate().then(() => {
	console.log("Conexão com o BD realizada com sucesso.");
}).catch((msgErro) => {
	console.log(msgErro);
});

// JS Embutido no HTML
app.set('view engine', 'ejs');
// Utilizar Arquivos Estáticos
app.use(express.static('public'));
// Receber dados como GET e POST de forma estrutura do HTML
app.use(bodyParser.urlencoded({extended: false}));
// OPCTIONAL: Receber dados enviados da Internet por JSON
app.use(bodyParser.json());

// Rotas
app.get("/", (req, res) => {
	Pergunta.findAll({raw: true, order:[
			['id','DESC']
		]}).then(perguntas => {
		res.render('index', {
			perguntas: perguntas
		});
	});	
});

app.get('/perguntar', (req, res) => {
	res.render('perguntar');
});

app.post('/salvarpergunta', (req, res) => {
	var titulo = req.body.titulo;
	var descricao = req.body.descricao;

	//res.send("Formulario recebido<br> Título: "+ titulo +" Descrição: "+ descricao);

	Pergunta.create({
		titulo: titulo,
		descricao: descricao
	}).then(() => {
		res.redirect('/');
	});
	
});

app.get('/pergunta/:id', (req, res) => {
	var id = req.params.id;
	Pergunta.findOne({
		where: {id: id}
	}).then(pergunta => {
		if(pergunta != undefined) {

			Resposta.findAll({
				where: {perguntaId: pergunta.id},
				order: [ ['id','DESC'] ]
			}).then(respostas => {
				res.render('pergunta', {
					pergunta: pergunta,
					respostas: respostas
				});
			});
			
		} else {
			res.redirect('/');
		}
	});
});

app.post('/responder', (req, res) => {
	var corpo = req.body.corpo;
	var perguntaId = req.body.pergunta;

	Resposta.create({
		corpo: corpo,
		perguntaId: perguntaId
	}).then(() => {
		res.redirect('/pergunta/'+perguntaId);
	});
	
});

// Rodar o servidor de Aplicação
app.listen(8080, () => {
	console.log("App rodando...");
});