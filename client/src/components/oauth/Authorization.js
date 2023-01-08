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
		isFetching: false,
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

	const fetchMe = useCallback(async () => {
		try {
			setUser({
				...user,
				isFetching: true,
			})

			const { gid = '', name = '', email = '' } = await client.users.me()
			setUser({ gid, name, email, isFetching: false })
		} catch (error) {
			if (error.status === 401) {
				refreshAccessToken()
				return
			}

			alert(error)
			resetClient()
		}
	}, [client])

	useEffect(() => {
		if (!accessToken) {
			navigate('/oauth/grant')
			return
		}

		fetchMe()
	}, [accessToken])

	return (
		<ClientContext.Provider
			value={{ client, user, refreshAccessToken, resetClient }}
		>
			{children}
		</ClientContext.Provider>
	)
}

export default Authorization
