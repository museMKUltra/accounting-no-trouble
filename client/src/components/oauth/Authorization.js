import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import asana from 'asana'
import { ClientContext } from '../../contexts/ClientContext.js'

function Authorization({ children }) {
	const navigate = useNavigate()
	const [client, setClient] = useState(null)
	const [user, setUser] = useState({})

	useEffect(() => {
		const accessToken = localStorage.getItem('access_token')
		const refreshToken = localStorage.getItem('refresh_token')

		if (!accessToken) {
			navigate('/oauth/grant')
		}

		const fetchMe = async () => {
			try {
				const client = asana.Client.create().useAccessToken(accessToken)
				const { gid = '', email = '', name = '' } = await client.users.me()

				setUser({ gid, email, name })
				setClient(client)
			} catch (e) {
				alert(e)
				localStorage.removeItem('access_token')
				if (refreshToken) {
					navigate('/oauth/refresh')
				} else {
					navigate('/oauth/grant')
				}
			}
		}

		fetchMe()
	}, [])

	return (
		<ClientContext.Provider value={{ client, user }}>
			{children}
		</ClientContext.Provider>
	)
}

export default Authorization
