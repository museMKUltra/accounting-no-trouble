import { client } from '../asana.js'
import { useEffect, useState } from 'react'

export function useProjects({ workspaceGid }) {
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
		if (!workspaceGid) return

		fetchProjects(workspaceGid)
	}, [workspaceGid])

	return { isFetching, projects }
}
