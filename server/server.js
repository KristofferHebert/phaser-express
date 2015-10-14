'use strict'

import express from 'express'
import bodyParser from 'body-parser'
import handlebars from 'express-handlebars'
import jsonFile from 'jsonfile'
import util from 'util'
import Tokens from 'csrf'

let app = express()
let tokens = new Tokens()
let secret = tokens.secretSync()
let token = tokens.create(secret)
let hbs = handlebars({
	defaultLayout: false,
	extname: '.hbs'
})

app.engine('.hbs', hbs);
app.set('view engine', '.hbs')
app.enable('view cache');

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json({
	limit: '100kb'
}))

app.get('/', function(req, res) {

	let options = {
		token: token
	}

	res.render('index', options)
})

app.get('/scores', function(req, res){
	let scores = jsonFile.readFileSync('./public/scores.json')
	res.json(scores)
})

app.post('/scores', function(req, res){
    res.sendStatus(500)
})

console.log('Listening on port 3000')
let server = app.listen(3000)

export default server
