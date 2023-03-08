import React, { useEffect } from 'react'
import { useOutOfOfficeDates } from '../hooks/google/useOutOfOfficeDates.js'

function OooTrigger({ setDisabledDates, startOn, dueOn }) {
	const {
		isReady,
		hasAuth,
		outOfOfficeDates,
		handleToggle,
		handleSignIn,
		updateTimeLimit,
	} = useOutOfOfficeDates()

	useEffect(() => {
		setDisabledDates(outOfOfficeDates)
	}, [outOfOfficeDates])

	useEffect(() => {
		updateTimeLimit({
			timeMin: startOn ? new Date(startOn).toISOString() : '',
			timeMax: dueOn ? new Date(dueOn).toISOString() : '',
		})
	}, [startOn, dueOn])

	return (
		<>
			<button disabled={!isReady} onClick={handleToggle}>
				{hasAuth ? 'unlink OOO' : 'link OOO'}
			</button>
			{hasAuth && (
				<button disabled={!isReady} onClick={handleSignIn}>
					refresh
				</button>
			)}
		</>
	)
}

export default OooTrigger
