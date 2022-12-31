const express = require('express')
const cors = require('cors')
const axios = require('axios')
const app = express()
const port = 3030

app.use(cors())

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.get('/oauth_token', async (req, res) => {
	axios
		.post(
			'https://app.asana.com/-/oauth_token',
			{
				grant_type: req.query.grant_type,
				client_id: '1203572903884176',
				client_secret: 'a9f03092d64963d6d3a9333e5c5690ec',
				redirect_uri: 'http://localhost:3000/oauth/callback',
				code: req.query.code,
				refresh_token: req.query.refresh_token,
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
