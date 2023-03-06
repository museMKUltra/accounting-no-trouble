import { useScript } from './useScript.js'
import { useEffect, useState } from 'react'

const GSI_SCRIPT_SRC = 'https://accounts.google.com/gsi/client'

export function useGsi({ clientId, scope, callback }) {
	const [gsiClient, setGsiClient] = useState(null)
	const [gsiOauth, setGsiOauth] = useState(null)
	const { isLoaded: isGsiLoaded } = useScript(GSI_SCRIPT_SRC)

	useEffect(() => {
		if (!isGsiLoaded) {
			return
		}

		function initializeGsiClient() {
			setGsiClient(
				// eslint-disable-next-line no-undef
				google.accounts.oauth2.initTokenClient({
					client_id: clientId,
					scope,
					callback,
				})
			)
			// eslint-disable-next-line no-undef
			setGsiOauth(google.accounts.oauth2)
		}

		initializeGsiClient()
	}, [isGsiLoaded])

	return {
		gsiClient,
		gsiOauth,
	}
}
