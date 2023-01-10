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

	const logout = () => {
		resetClient()
		setTimeout(() => {
			navigate('/oauth/grant')
		})
	}

	const refreshAccessToken = async () => {
		try {
			const { accessToken } = await fetchOauthTokenByRefreshToken(refreshToken)
			if (!accessToken) {
				throw new Error('fetching access token by refresh token is failed')
			}

			updateClient({ accessToken })
		} catch (error) {
			alert(error)
			logout()
		}
	}

	const accessTokenRefresher = (resolve, reject) => async error => {
		switch (error.status) {
			case 401:
				resolve?.(refreshAccessToken)
				break
			default:
				reject?.(error)
				break
		}
	}

	const fetchMe = useCallback(async () => {
		const handleRefreshAccessToken = accessTokenRefresher(
			async refresh => {
				await refresh()
				setTimeout(fetchMe)
			},
			error => {
				alert(error)
				logout()
			}
		)

		try {
			const { gid = '', name = '', email = '' } = await client.users.me()
			setUser({ gid, name, email, isFetched: true })
		} catch (error) {
			await handleRefreshAccessToken(error)
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
			value={{
				client,
				refreshToken,
				user,
				accessTokenRefresher,
				logout,
			}}
		>
			{user.isFetched ? children : 'fetching...'}
		</ClientContext.Provider>
	)
}

export default Authorization
