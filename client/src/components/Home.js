import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClientContext } from '../contexts/ClientContext.js'

function Home() {
	const navigate = useNavigate()
	const { user } = useContext(ClientContext)

	const logout = () => {
		localStorage.removeItem('access_token')
		localStorage.removeItem('refresh_token')

		navigate('/oauth/grant')
	}

	const revoke = () => {
		const refreshToken = localStorage.getItem('refresh_token')

		fetch('/oauth_revoke', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				token: refreshToken,
			}),
		})
			.then(logout)
			.catch(e => {
				alert(e)
			})
	}

	return (
		<>
			<div>{user.gid}</div>
			<div>{user.name}</div>
			<div>{user.email}</div>
			<button type="button" onClick={logout}>
				logout
			</button>
			<button type="button" onClick={revoke}>
				revoke
			</button>
		</>
	)
}

export default Home
