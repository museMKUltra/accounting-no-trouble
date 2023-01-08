import React, { useContext, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ClientContext } from '../contexts/ClientContext.js'
import { fetchOauthRevoke } from '../hooks/oauth/oauth.js'

function Home() {
	const { user, resetClient } = useContext(ClientContext)
	const [isRevoking, setIsRevoking] = useState(false)
	const isDisabled = isRevoking || user.isFetching

	const revoke = async () => {
		try {
			setIsRevoking(true)
			await fetchOauthRevoke(refreshToken)
			resetClient()
		} catch (error) {
			alert(error)
		} finally {
			setIsRevoking(false)
		}
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
				<button disabled={isDisabled} type="button" onClick={resetClient}>
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
