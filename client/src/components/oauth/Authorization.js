import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import asana from 'asana'
import { ClientContext } from '../../contexts/ClientContext.js'

function Authorization({ children }) {
	const navigate = useNavigate()
	const [client, setClient] = useState(null)
	const [user, setUser] = useState({})
	const isUserSet = useRef(false)

	const fetchOauthToken = async () => {
		await fetch('/oauth_token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				refresh_token: localStorage.getItem('refresh_token'),
				grant_type: 'refresh_token',
			}),
		})
			.then(response => response.json())
			.then(({ access_token }) => {
				if (!access_token) {
					throw new Error('did not fetch the access token')
				}
				localStorage.setItem('access_token', access_token)
				const client = asana.Client.create().useAccessToken(access_token)
				setClient(client)
			})
			.catch(e => {
				alert(e)
			})
	}

	const fetchMe = useCallback(async () => {
		try {
			setUser({ isFetching: true })
			const { gid = '', email = '', name = '' } = await client.users.me()

			setUser({ gid, email, name, isFetching: false })
		} catch (e) {
			alert(e)
			if (localStorage.getItem('refresh_token')) {
				navigate('/oauth/refresh')
			} else {
				navigate('/oauth/grant')
			}
		}
	}, [client])

	useEffect(() => {
		const accessToken = localStorage.getItem('access_token')

		if (!accessToken) {
			navigate('/oauth/grant')
			return
		}

		const client = asana.Client.create().useAccessToken(accessToken)
		setClient(client)
	}, [])

	useEffect(() => {
		if (!client || isUserSet.current) return

		fetchMe()
		isUserSet.current = true
	}, [client])

	return (
		<ClientContext.Provider value={{ client, user, fetchOauthToken }}>
			{client && children}
		</ClientContext.Provider>
	)
}

export default Authorization
