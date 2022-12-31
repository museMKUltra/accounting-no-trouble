import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Grant() {
	const searchParams = {
		response_type: 'code',
		client_id: '1203572903884176',
		redirect_uri: 'http://localhost:3000/oauth/callback',
		state: 'state',
	}
	const url = new URL('https://app.asana.com/-/oauth_authorize')
	url.search = new URLSearchParams(searchParams)

	const navigate = useNavigate()

	useEffect(() => {
		const accessToken = localStorage.getItem('access_token')

		if (accessToken) {
			navigate('/')
		}
	}, [])

	return (
		<div>
			<a href={url}>Authenticate with Asana</a>
		</div>
	)
}

export default Grant
