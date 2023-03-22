import './Home.css'
import React, { useContext, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ClientContext } from '../contexts/ClientContext.js'
import { fetchOauthRevoke } from '../hooks/oauth/oauth.js'

function Home() {
	const { refreshToken, user, logout } = useContext(ClientContext)
	const [isRevoking, setIsRevoking] = useState(false)

	const revoke = async () => {
		try {
			setIsRevoking(true)
			await fetchOauthRevoke(refreshToken)
			logout()
		} catch (error) {
			alert(error)
		} finally {
			setIsRevoking(false)
		}
	}

	return (
		<div>
			<div className='block_member'>
				<div>{isRevoking ? 'revoking...' : `hi, ${user.name}`}</div>
				<button disabled={isRevoking} type="button" onClick={logout}>
					logout
				</button>
				<button disabled={isRevoking} type="button" onClick={revoke}>
					revoke
				</button>
			</div>
			<hr/>
			<div className='block_nav'>
				<NavLink
					to="/board"
					style={({ isActive }) => ({
						color: isActive ? 'grey' : 'white',
					})}
					className='button'
				>
					ＷEB
				</NavLink>
				<NavLink
					to="/issue"
					style={({ isActive }) => ({
						color: isActive ? 'grey' : 'white',
					})}
					className='button'
				>
					工單區
				</NavLink>
			</div>
			
		</div>
	)
}

export default Home
