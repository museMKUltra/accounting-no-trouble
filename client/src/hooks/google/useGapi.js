import { useScript } from './useScript.js'
import { useEffect, useState } from 'react'

const GAPI_SCRIPT_SRC = 'https://apis.google.com/js/api.js'

export function useGapi({ apiKey, discoveryDocs }) {
	const [gapiClient, setGapiClient] = useState(null)
	const { isLoaded: isGapiLoaded } = useScript(GAPI_SCRIPT_SRC)

	useEffect(() => {
		if (!isGapiLoaded) {
			return
		}

		async function initializeGapiClient() {
			// eslint-disable-next-line no-undef
			await gapi.client.init({
				apiKey,
				discoveryDocs,
			})

			// eslint-disable-next-line no-undef
			setGapiClient(gapi.client)
		}

		// eslint-disable-next-line no-undef
		gapi.load('client', initializeGapiClient)
	}, [isGapiLoaded])

	return {
		gapiClient,
	}
}
