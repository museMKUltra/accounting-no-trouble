const path = require('path')
const axios = require('axios')

const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const dotenv = require('dotenv')
dotenv.config()

const root = require('path').join(__dirname, 'client', 'build')

if (process.env.NODE_ENV === 'development') {
  const cors = require('cors')
  app.use(cors())
} else {
  app.use(express.static(root))
}

app.get('/oauth/authorize', (req, res) => {
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

app.post('/oauth/token', async (req, res) => {
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

app.post('/oauth/revoke', async (req, res) => {
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

app.get('/healthz', (req, res) => {
  res.send('OK')
})

app.get('*', (req, res) => {
  res.sendFile('index.html', { root })
})

const port = process.env.PORT || 80
app.listen(port, () => {
  console.log(`OAuth handler listening at http://localhost:${port}`)
})
