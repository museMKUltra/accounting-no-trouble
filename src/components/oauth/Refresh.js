import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Refresh() {
	const navigate = useNavigate()

	useEffect(() => {
		const refreshToken = localStorage.getItem('refresh_token')

		if (!refreshToken) {
			navigate('/oauth/grant')
			return
		}

		const fetchOauthToken = async () => {
			fetch('http://localhost:3030/oauth_token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					refresh_token: refreshToken,
					grant_type: 'refresh_token',
				}),
			})
				.then(response => response.json())
				.then(({ access_token }) => {
					if (!access_token) {
						throw new Error('did not fetch the access token')
					}

					localStorage.setItem('access_token', access_token)
					navigate('/')
				})
				.catch(e => {
					alert(e)
					localStorage.removeItem('fresh_token')
					navigate('/oauth/grant')
				})
		}

		fetchOauthToken()
	}, [])

	return <div>refreshing...</div>
}

export default Refresh
