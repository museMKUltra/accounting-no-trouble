import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchOauthTokenByCode } from '../../hooks/oauth/oauth.js'
import { useClient } from '../../reducers/useClient.js'

function useQuery() {
	const { search } = useLocation()

	return React.useMemo(() => new URLSearchParams(search), [search])
}

function Callback() {
	const query = useQuery()
	const navigate = useNavigate()
	const { accessToken, updateClient } = useClient()

	useEffect(() => {
		const fetchOauthToken = async () => {
			try {
				const code = query.get('code')
				if (!code) {
					throw new Error('query code does not exist')
				}

				const { accessToken, refreshToken } = await fetchOauthTokenByCode(code)
				if (!accessToken) {
					throw new Error('fetching access token by code is failed')
				}
				if (!refreshToken) {
					throw new Error('fetching refresh token by code is failed')
				}

				updateClient({ accessToken, refreshToken })
			} catch (error) {
				alert(error)
				navigate('/oauth/grant')
			}
		}

		fetchOauthToken()
	}, [])

	useEffect(() => {
		if (accessToken) {
			navigate('/')
		}
	}, [accessToken])

	return <div>redirecting...</div>
}

export default Callback
