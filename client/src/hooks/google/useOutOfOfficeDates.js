import { useCalendarEvents } from './useCalendarEvents.js'
import { useEffect, useState } from 'react'
import { getDateStringList, getDayCount } from '../../reducers/useProportion.js'

export function useOutOfOfficeDates() {
	const [outOfOfficeDates, setOutOfOfficeDates] = useState([])
	const {
		isReady,
		hasAuth,
		calendarEvents,
		handleSignIn,
		handleSignOut,
		updateOptions,
	} = useCalendarEvents({
		config: {
			clientId:
				'199718595657-6kmaama316jr9oqc4kvkouqbecmukpp3.apps.googleusercontent.com',
			apiKey: 'AIzaSyD-bCFUjp1iY-pzYIqX5t38rpQpv98na4U',
			scope: 'https://www.googleapis.com/auth/calendar.readonly',
			discoveryDocs: [
				'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
			],
		},
		options: {
			calendarId: 'primary',
			timeMin: '',
			timeMax: '',
			showDeleted: false,
			singleEvents: true,
			orderBy: 'startTime',
			q: 'Out of office',
		},
	})

	function isWholePoint(dateTime) {
		const date = new Date(dateTime)

		return (
			date.getHours() === 0 &&
			date.getMinutes() === 0 &&
			date.getSeconds() === 0
		)
	}

	useEffect(() => {
		const outOfOfficeDates = calendarEvents.reduce((dates, event) => {
			const startOn = event.start.dateTime
			const dueOn = event.end.dateTime

			if (!(isWholePoint(startOn) && isWholePoint(dueOn))) {
				return dates
			}

			const dayCount = getDayCount({ startOn, dueOn }) - 1 // due date won't be counted
			return dates.concat(getDateStringList({ startOn, dayCount }))
		}, [])

		setOutOfOfficeDates(outOfOfficeDates)
	}, [calendarEvents])

	function handleToggle() {
		if (hasAuth) {
			handleSignOut()
		} else {
			handleSignIn()
		}
	}

	function updateTimeLimit({ timeMin, timeMax }) {
		updateOptions({ timeMin, timeMax })
	}

	return {
		isReady,
		hasAuth,
		outOfOfficeDates,
		handleToggle,
		handleSignIn,
		handleSignOut,
		updateTimeLimit,
	}
}
