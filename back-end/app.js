const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// API config
app.use(bodyParser.urlencoded({
	extended: false
}))
app.use(bodyParser.json())

// Routers
app.get('/', async (req, res) => {
	res.json({error: false})
})

app.listen(3000, () => {
	console.log('running in port 3000')
})