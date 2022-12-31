import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import asana from 'asana'

function Home() {
	const navigate = useNavigate()
	const [gid, setGid] = useState('')
	const [workspaces, setWorkspaces] = useState([])

	useEffect(() => {
		const accessToken = localStorage.getItem('access_token')
		const refreshToken = localStorage.getItem('refresh_token')

		if (!accessToken) {
			navigate('/oauth/grant')
		}

		const fetchMe = async () => {
			try {
				const client = asana.Client.create().useAccessToken(accessToken)
				const { gid = '', workspaces = [] } = await client.users.me()
				setGid(gid)
				setWorkspaces(workspaces)
			} catch (e) {
				alert(e)
				localStorage.removeItem('access_token')
				if (refreshToken) {
					navigate('/oauth/refresh')
				} else {
					navigate('oauth/grant')
				}
			}
		}
		fetchMe()
	}, [])

	const logout = () => {
		localStorage.removeItem('access_token')
		localStorage.removeItem('refresh_token')

		navigate('/oauth/grant')
	}

	const revoke = () => {
		const refreshToken = localStorage.getItem('refresh_token')

		fetch(`http://localhost:3030/oauth_revoke?token=${refreshToken}`)
			.then(logout)
			.catch(e => {
				alert(e)
			})
	}

	return (
		<div>
			<div>gid: {gid}</div>
			{workspaces.map(workspace => (
				<div key={workspace.gid}> workspace: {workspace.gid}</div>
			))}
			<button type="button" onClick={logout}>
				logout
			</button>
			<button type="button" onClick={revoke}>
				revoke
			</button>
		</div>
	)
}

export default Home
