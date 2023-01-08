import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import asana from 'asana'
import { ClientContext } from '../../contexts/ClientContext.js'
import { fetchOauthTokenByRefreshToken } from '../../hooks/oauth/oauth.js'

function Authorization({ children }) {
	const navigate = useNavigate()
	const [client] = useState(asana.Client.create())
	const [accessToken, setAccessToken] = useState(
		localStorage.getItem('access_token')
	)
	const [refreshToken, setRefreshToken] = useState(
		localStorage.getItem('refresh_token')
	)
	const [user, setUser] = useState({
		gid: '',
		name: '',
		email: '',
		isFetching: false,
		isFetched: false,
	})

	const logout = () => {
		localStorage.removeItem('access_token')
		localStorage.removeItem('refresh_token')
		setAccessToken(null)
		setRefreshToken(null)

		navigate('/oauth/grant')
	}

	const refreshAccessToken = async () => {
		try {
			const { accessToken } = await fetchOauthTokenByRefreshToken(refreshToken)
			if (!accessToken) {
				throw new Error('fetching access token by refresh token is failed')
			}

			client.useAccessToken(accessToken)
			localStorage.setItem('access_token', accessToken)
			setAccessToken(accessToken)
		} catch (error) {
			alert(error)
			logout()
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
			logout()
		}
	}, [client])

	useEffect(() => {
		if (!client) return

		if (!accessToken) {
			logout()
			return
		}

		client.useAccessToken(accessToken)
		setAccessToken(accessToken)
	}, [])

	useEffect(() => {
		if (!accessToken) return

		fetchMe()
	}, [accessToken])

	return (
		<ClientContext.Provider
			value={{ client, user, refreshAccessToken, logout }}
		>
			{children}
		</ClientContext.Provider>
	)
}

export default Authorization
