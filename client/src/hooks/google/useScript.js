import { useEffect, useState } from 'react'

export function useScript(src) {
	const [isLoaded, setIsLoaded] = useState(false)

	useEffect(() => {
		const script = document.createElement('script')

		script.src = src
		script.async = true
		script.defer = true
		script.onload = () => setIsLoaded(true)

		document.body.appendChild(script)

		return () => {
			document.body.removeChild(script)
		}
	}, [])

	return {
		isLoaded,
	}
}
