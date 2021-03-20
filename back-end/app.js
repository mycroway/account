const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const User = require('./models/User')
const bcrypt = require('bcryptjs')

// API config
app.use(bodyParser.urlencoded({
	extended: false
}))
app.use(bodyParser.json())


// Routers
app.get('/', async (req, res) => {
	res.json({error: false})
})

var port = 3000
app.listen(port, () => {
	console.log(`running in port ${port}`)
})