import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Grant() {
	const navigate = useNavigate()
	const [isGranting, setIsGranting] = useState(false)

	useEffect(() => {
		const accessToken = localStorage.getItem('access_token')

		if (accessToken) {
			navigate('/')
		}
	}, [])

	const login = () => {
		setIsGranting(true)
		fetch('/oauth_authorize')
			.then(response => response.text())
			.then(url => {
				window.location.href = url
			})
			.catch(e => {
				alert(e)
				setIsGranting(false)
			})
	}

	return (
		<>
			<div>{isGranting ? 'granting...' : 'Authenticate with Asana'}</div>
			<button disabled={isGranting} type="button" onClick={login}>
				login
			</button>
		</>
	)
}

export default Grant
