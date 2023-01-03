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

	const click = () => {
		fetch('/oauth_authorize')
			.then(response => response.text())
			.then(url => {
				window.location.href = url
			})
			.catch(e => {
				alert(e)
			})
	}

	return (
		<button type="button" onClick={click}>
			Authenticate with Asana
		</button>
	)
}

export default Grant
