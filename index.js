const express = require('express')
const cors = require('cors')
const axios = require('axios')
const bodyParser = require('body-parser')
const app = express()
const port = 3030

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

app.get('/oauth_authorize', (req, res) => {
	const url = new URL('https://app.asana.com/-/oauth_authorize')
	const searchParams = {
		response_type: 'code',
		client_id: '1203572903884176',
		redirect_uri: 'http://localhost:3000/oauth/callback',
		state: 'state',
	}

	url.search = new URLSearchParams(searchParams)
	res.redirect(url)
})

app.post('/oauth_token', async (req, res) => {
	axios
		.post(
			'https://app.asana.com/-/oauth_token',
			{
				grant_type: req.body.grant_type,
				client_id: '1203572903884176',
				client_secret: 'a9f03092d64963d6d3a9333e5c5690ec',
				redirect_uri: 'http://localhost:3000/oauth/callback',
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
				client_id: '1203572903884176',
				client_secret: 'a9f03092d64963d6d3a9333e5c5690ec',
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

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
