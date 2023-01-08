import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchOauthTokenByCode } from '../../hooks/oauth/oauth.js'

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
			alert('code does not exist')
			return
		}

		const fetchOauthToken = async () => {
			try {
				const { accessToken, refreshToken } = await fetchOauthTokenByCode(code)

				if (!accessToken) {
					throw new Error('fetching access token by code is failed')
				}
				if (!refreshToken) {
					throw new Error('fetching refresh token by code is failed')
				}

				localStorage.setItem('access_token', accessToken)
				localStorage.setItem('refresh_token', refreshToken)

				navigate('/')
			} catch (error) {
				alert(error)
				navigate('/oauth/grant')
			}
		}

		fetchOauthToken()
	}, [])

	return <div>redirecting...</div>
}

export default Callback
