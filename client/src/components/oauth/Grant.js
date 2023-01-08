import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchOauthAuthorize } from '../../hooks/oauth/oauth.js'

function Grant() {
	const navigate = useNavigate()
	const [isGranting, setIsGranting] = useState(false)

	useEffect(() => {
		const accessToken = localStorage.getItem('access_token')

		if (accessToken) {
			navigate('/')
		}
	}, [])

	const login = async () => {
		try {
			setIsGranting(true)
			const url = await fetchOauthAuthorize()
			window.location.href = url
		} catch (error) {
			alert(error)
			setIsGranting(false)
		}
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
