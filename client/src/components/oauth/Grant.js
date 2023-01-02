import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Grant() {
	const navigate = useNavigate()

	useEffect(() => {
		const accessToken = localStorage.getItem('access_token')

		if (accessToken) {
			navigate('/')
		}
	}, [])

	return (
		<div>
			<a href="/oauth_authorize">
				Authenticate with Asana
			</a>
		</div>
	)
}

export default Grant
