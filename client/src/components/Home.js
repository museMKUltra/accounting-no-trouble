import React, { useContext, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ClientContext } from '../contexts/ClientContext.js'

function Home() {
	const { user, logout } = useContext(ClientContext)
	const [isRevoking, setIsRevoking] = useState(false)
	const isDisabled = isRevoking || user.isFetching

	const revoke = () => {
		const refreshToken = localStorage.getItem('refresh_token')

		setIsRevoking(true)

		fetch('/oauth_revoke', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				token: refreshToken,
			}),
		})
			.then(logout)
			.catch(e => {
				alert(e)
			})
			.finally(() => {
				setIsRevoking(false)
			})
	}

	return (
		<div style={{ display: 'flex', justifyContent: 'space-between' }}>
			<div>
				<div>
					{isRevoking
						? 'revoking...'
						: user.isFetching
						? 'fetching...'
						: `hi, ${user.name}`}
				</div>
				<button disabled={isDisabled} type="button" onClick={logout}>
					logout
				</button>
				<button disabled={isDisabled} type="button" onClick={revoke}>
					revoke
				</button>
			</div>
			<NavLink
				to="/board"
				style={({ isActive }) => ({
					color: isActive ? 'grey' : 'inherit',
				})}
			>
				Board
			</NavLink>
		</div>
	)
}

export default Home
