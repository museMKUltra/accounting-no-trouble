import { useCallback, useContext, useEffect, useState } from 'react'
import { ClientContext } from '../../contexts/ClientContext.js'

export function useSections({ projectGid }) {
	const [sections, setSections] = useState([])
	const [isFetching, setIsFetching] = useState(false)
	const { client } = useContext(ClientContext)

	const fetchSections = useCallback(
		async project => {
			try {
				setIsFetching(true)
				const { data: sections = [] } =
					await client.sections.getSectionsForProject(project, {})

				setSections(sections)
			} catch (e) {
				console.error(e)
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
