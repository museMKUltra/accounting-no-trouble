import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function useQuery() {
	const { search } = useLocation()

	return React.useMemo(() => new URLSearchParams(search), [search])
}

function Callback() {
	const query = useQuery()
	const navigate = useNavigate()

	useEffect(() => {
		const code = query.get('code')

		if (!code) {
			return
		}

		const fetchOauthToken = async () => {
			fetch('/oauth_token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					code,
					grant_type: 'authorization_code',
				}),
			})
				.then(response => response.json())
				.then(({ access_token, refresh_token }) => {
					if (!access_token) {
						throw new Error('did not fetch the access token')
					}

					if (!refresh_token) {
						throw new Error('did not fetch the refresh token')
					}

					localStorage.setItem('access_token', access_token)
					localStorage.setItem('refresh_token', refresh_token)

					navigate('/')
				})
				.catch(e => {
					alert(e)
					navigate('/oauth/grant')
				})
		}

		fetchOauthToken()
	}, [])

	return <div>redirecting...</div>
}

export default Callback
