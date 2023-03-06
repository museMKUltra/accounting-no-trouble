import React from 'react'
import { useOutOfOfficeDates } from '../hooks/google/useOutOfOfficeDates.js'

function Calendar() {
	const { isReady, hasAuth, outOfOfficeDates, handleToggle, handleSignIn } =
		useOutOfOfficeDates({
			timeMin: new Date().toISOString(),
			timeMax: new Date(2023, 2, 31, 23, 59, 59).toISOString(),
		})

	return (
		<>
			{JSON.stringify(outOfOfficeDates)}
			<button disabled={!isReady} onClick={handleToggle}>
				{hasAuth ? 'sign out' : 'sign in'}
			</button>
			{hasAuth && (
				<button disabled={!isReady} onClick={handleSignIn}>
					refresh
				</button>
			)}
		</>
	)
}

export default Calendar
