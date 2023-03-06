import { useEffect, useRef, useState } from 'react'
import { useGapi } from './useGapi.js'
import { useGsi } from './useGsi.js'

export function useCalendarEvents({ options, config }) {
	const gapiClientRef = useRef(null)
	const gsiClientRef = useRef(null)
	const gsiOauthRef = useRef(null)

	const [isReady, setIsReady] = useState(false)
	const [hasAuth, setHasAuth] = useState(false)
	const [calendarEvents, setCalendarEvents] = useState([])

	const { gapiClient } = useGapi({
		apiKey: config.apiKey,
		discoveryDocs: config.discoveryDocs,
	})

	useEffect(() => {
		if (!gapiClient) {
			return
		}

		gapiClientRef.current = gapiClient
		if (gsiClientRef.current) {
			setIsReady(true)
		}
	}, [gapiClient])

	const { gsiClient, gsiOauth } = useGsi({
		clientId: config.clientId,
		scope: config.scope,
		callback: async response => {
			if (response.error !== undefined) {
				setCalendarEvents([])
				setHasAuth(false)

				throw response
			}

			const calendarEvents = await fetchCalendarEvents()

			setCalendarEvents(calendarEvents)
			setHasAuth(true)
		},
	})

	useEffect(() => {
		if (!gsiClient) {
			return
		}

		gsiClientRef.current = gsiClient
		if (gapiClientRef.current) {
			setIsReady(true)
		}
	}, [gsiClient])

	useEffect(() => {
		if (!gsiOauth) {
			return
		}

		gsiOauthRef.current = gsiOauth
	}, [gsiOauth])

	async function fetchCalendarEvents() {
		try {
			// eslint-disable-next-line no-undef
			const response = await gapiClientRef.current?.calendar.events.list(
				options
			)

			return response?.result?.items || []
		} catch (error) {
			console.error(error)

			return []
		}
	}

	function handleSignIn() {
		// eslint-disable-next-line no-undef
		if (gapiClientRef.current?.getToken() === null) {
			// Prompt the user to select a Google Account and ask for consent to share their data
			// when establishing a new session.
			gsiClientRef.current?.requestAccessToken({ prompt: 'consent' })
		} else {
			// Skip display of account chooser and consent dialog for an existing session.
			gsiClientRef.current?.requestAccessToken({ prompt: '' })
		}
	}

	function handleSignOut() {
		// eslint-disable-next-line no-undef
		const token = gapiClientRef.current?.getToken()

		if (token === null) {
			return
		}

		gsiOauthRef.current?.revoke(token.access_token)
		gapiClientRef.current?.setToken('')

		setCalendarEvents([])
		setHasAuth(false)
	}

	return {
		isReady,
		hasAuth,
		calendarEvents,
		handleSignIn,
		handleSignOut,
	}
}
