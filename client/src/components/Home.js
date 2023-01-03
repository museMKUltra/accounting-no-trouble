import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClientContext } from '../contexts/ClientContext.js'

function Home() {
	const navigate = useNavigate()
	const { user } = useContext(ClientContext)
	const [isRevoking, setIsRevoking] = useState(false)

	const logout = () => {
		localStorage.removeItem('access_token')
		localStorage.removeItem('refresh_token')

		navigate('/oauth/grant')
	}

	const revoke = () => {
		const refreshToken = localStorage.getItem('refresh_token')

		setIsRevoking(true)

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
			.finally(() => {
				setIsRevoking(false)
			})
	}

	return (
		<>
			<div>
				{isRevoking
					? 'revoking...'
					: user.isFetching
					? 'fetching...'
					: `hi, ${user.name}`}
			</div>
			<button disabled={isRevoking} type="button" onClick={logout}>
				logout
			</button>
			<button disabled={isRevoking} type="button" onClick={revoke}>
				revoke
			</button>
		</>
	)
}

export default Home
