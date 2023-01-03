const express = require('express')
const path = require('path')
const axios = require('axios')
const bodyParser = require('body-parser')

const PRODUCTION = 'production'
const PORT = 3030

const app = express()

if (process.env.NODE_ENV === PRODUCTION) {
	app.use(express.static(path.join(__dirname, 'client/build')))
} else {
	require('dotenv').config()
	app.use(require('cors')())
}
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const port = process.env.PORT || PORT

app.get('/oauth_authorize', (req, res) => {
	const url = new URL('https://app.asana.com/-/oauth_authorize')
	const searchParams = {
		response_type: 'code',
		client_id: process.env.OAUTH_CLIENT_ID,
		redirect_uri: process.env.OAUTH_REDIRECT_URI,
		state: 'state',
	}

	url.search = new URLSearchParams(searchParams)
	res.send(url.toString())
})

app.post('/oauth_token', async (req, res) => {
	axios
		.post(
			'https://app.asana.com/-/oauth_token',
			{
				grant_type: req.body.grant_type,
				client_id: process.env.OAUTH_CLIENT_ID,
				client_secret: process.env.OAUTH_CLIENT_SECRET,
				redirect_uri: process.env.OAUTH_REDIRECT_URI,
				code: req.body.code,
				refresh_token: req.body.refresh_token,
			},
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		)
		.then(function (response) {
			console.log(response)
			res.send(response.data)
		})
		.catch(function (error) {
			res.send(error)
		})
})

app.post('/oauth_revoke', async (req, res) => {
	axios
		.post(
			'https://app.asana.com/-/oauth_revoke',
			{
				client_id: process.env.OAUTH_CLIENT_ID,
				client_secret: process.env.OAUTH_CLIENT_SECRET,
				token: req.body.token,
			},
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		)
		.then(function (response) {
			console.log(response)
			res.send(response.data)
		})
		.catch(function (error) {
			res.send(error)
		})
})

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname+'/client/build/index.html'))
})

app.listen(port, () => {
	console.log(`OAuth handler listening at http://localhost:${port}`)
})
