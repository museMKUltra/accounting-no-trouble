import { useCallback, useContext, useEffect, useState } from 'react'
import { ClientContext } from '../../contexts/ClientContext.js'

export function useSections({ projectGid }) {
	const [sections, setSections] = useState([])
	const [isFetching, setIsFetching] = useState(false)
	const { client, accessTokenRefresher } = useContext(ClientContext)
	const fetchSections = useCallback(
		async project => {
			const handleRefreshAccessToken = accessTokenRefresher(
				async refresh => {
					await refresh()
					setTimeout(() => {
						fetchSections(project)
					})
				},
				error => {
					console.error(error)
				}
			)

			try {
				setIsFetching(true)
				const { data: sections = [] } =
					await client.sections.getSectionsForProject(project, {})
					setSections(sections)
			} catch (e) {
				await handleRefreshAccessToken(e)
			} finally {
				setIsFetching(false)
			}
		},
		[client]
	)
	useEffect(() => {
		if (!projectGid) return

		fetchSections(projectGid)
	}, [projectGid])

	return { isFetching, sections }
}
