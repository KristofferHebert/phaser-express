'use strict'

import express from 'express'
import bodyParser from 'body-parser'
import handlebars from 'express-handlebars'
import jsonFile from 'jsonfile'
import util from 'util'
import Tokens from 'csrf'

// Configuration
const app = express()
const tokens = new Tokens()
const secret = tokens.secretSync()
const token = tokens.create(secret)
const hbs = handlebars({
	defaultLayout: false,
	extname: '.hbs'
})

const ROOT = process.env.PWD
const DB = './public/scores.json'

app.engine('.hbs', hbs)
app.set('view engine', '.hbs')
app.enable('view cache')
app.use(express.static(ROOT + '/public'))
app.use(bodyParser.json({
	limit: '100kb'
}))

// Routes
app.get('/', function(req, res) {

	let options = {
		token: token
	}

	res.render('index', options)
})

// Middleware
function checkToken(req, res, next) {
	let reqToken = req.body.csrf
	console.log('has token', reqToken)
	if (!tokens.verify(secret, reqToken)) {
		console.log('invalid token')
		return res.status(500)
			.send({
				error: "Invalid Token"
			})
	}
	console.log('valid token')
	next()
}

function getScores(req, res) {
	let scores = jsonFile.readFileSync(DB)
	return res.json(scores)
}

function writeScores(req, res) {

	if (req.body.names && req.body.scores) {

		let newScores = {
			names: req.body.names,
			scores: req.body.scores
		}

		console.log('saving to db', newScores)
		jsonFile.writeFileSync(DB, newScores)

		let scores = jsonFile.readFileSync(DB)
		res.json(scores)
	} else {
		res.status(500)
			.send({
				error: "Invalid Request"
			})
	}


}

app.get('/scores', getScores)

app.post('/scores', checkToken, writeScores)

console.log('Listening on port 3006')
let server = app.listen(3006)

export default server
