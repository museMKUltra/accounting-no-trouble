import { client } from '../asana.js'
import { useEffect, useState } from 'react'

export function useProjects({ workspaceGid: workspace }) {
	const [projects, setProjects] = useState([])
	const [isFetching, setIsFetching] = useState(false)

	async function fetchProjects(workspace) {
		try {
			setIsFetching(true)
			const { data: projects = [] } = await client.projects.getProjects({
				workspace,
			})

			setProjects(projects)
		} catch (e) {
			console.error(e)
		} finally {
			setIsFetching(false)
		}
	}

	useEffect(() => {
		if (!workspace) return

		fetchProjects(workspace)
	}, [workspace])

	return { isFetching, projects }
}
