import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClientContext } from '../../contexts/ClientContext.js'
import { fetchOauthTokenByRefreshToken } from '../../hooks/oauth/oauth.js'
import { useClient } from '../../reducers/useClient.js'

function Authorization({ children }) {
	const navigate = useNavigate()
	const [user, setUser] = useState({
		gid: '',
		name: '',
		email: '',
		isFetched: false,
	})
	const { client, accessToken, refreshToken, updateClient, resetClient } =
		useClient()

	const refreshAccessToken = async () => {
		try {
			const { accessToken } = await fetchOauthTokenByRefreshToken(refreshToken)
			if (!accessToken) {
				throw new Error('fetching access token by refresh token is failed')
			}

			updateClient({ accessToken })
		} catch (error) {
			alert(error)
			resetClient()
		}
	}

	const accessTokenRefresher = (resolve, reject) => async error => {
		switch (error.status) {
			case 401:
				await refreshAccessToken()
				setTimeout(() => {
					resolve?.()
				}, 0)
				break
			default:
				reject?.(error)
				break
		}
	}

	const fetchMe = useCallback(async () => {
		const refreshAccessToken = accessTokenRefresher(
			() => {
				fetchMe()
			},
			error => {
				alert(error)
				resetClient()
				setTimeout(() => {
					navigate('/oauth/grant')
				})
			}
		)

		try {
			const { gid = '', name = '', email = '' } = await client.users.me()
			setUser({ gid, name, email, isFetched: true })
		} catch (error) {
			await refreshAccessToken(error)
		}
	}, [client])

	useEffect(() => {
		if (!accessToken) {
			navigate('/oauth/grant')
			return
		}

		fetchMe()
	}, [])

	return (
		<ClientContext.Provider
			value={{ client, refreshToken, user, refreshAccessToken, resetClient }}
		>
			{user.isFetched ? children : 'fetching...'}
		</ClientContext.Provider>
	)
}

export default Authorization
