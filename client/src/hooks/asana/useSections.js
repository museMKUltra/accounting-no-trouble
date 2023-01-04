import { useContext, useEffect, useState } from 'react'
import { ClientContext } from '../../contexts/ClientContext.js'

export function useSections({ projectGid }) {
	const [sections, setSections] = useState([])
	const [isFetching, setIsFetching] = useState(false)
	const { client } = useContext(ClientContext)

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
		if (!projectGid || !client) return

		fetchSections(projectGid)
	}, [projectGid, client])

	return { isFetching, sections }
}
