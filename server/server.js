'use strict'

import express from 'express'
import bodyParser from 'body-parser'
import handlebars from 'express-handlebars'
import Tokens from 'csrf'

let app = express()
let tokens = new Tokens()
let secret = tokens.secretSync()
let token = tokens.create(secret)
let hbs = handlebars({defaultLayout: false, extname: '.hbs'})

app.use(express.static(__dirname + '/public'))
app.engine('.hbs', hbs);
app.set('view engine', '.hbs')
app.enable('view cache');



app.use(bodyParser.json({
    limit: '100kb'
}))



app.get('/', function (req, res) {

    let options = {
            token: token
        }

    res.render('index', options)
})


console.log('Listening on port 3000')
app.listen(3000)

export default app
