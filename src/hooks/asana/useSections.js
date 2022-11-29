import { client } from './asana.js'
import { useEffect, useState } from 'react'

export function useSections({ projectGid }) {
	const [sections, setSections] = useState([])
	const [isFetching, setIsFetching] = useState(false)

	async function fetchSections(project) {
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
	}

	useEffect(() => {
		if (!projectGid) return

		fetchSections(projectGid)
	}, [projectGid])

	return { isFetching, sections }
}
