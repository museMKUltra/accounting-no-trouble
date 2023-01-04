import { useContext, useEffect, useState } from 'react'
import { ClientContext } from '../../contexts/ClientContext.js'

export function useProjects({ workspaceGid }) {
	const [projects, setProjects] = useState([])
	const [isFetching, setIsFetching] = useState(false)
	const { client } = useContext(ClientContext)

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
		if (!workspaceGid || !client) return

		fetchProjects(workspaceGid)
	}, [workspaceGid, client])

	return { isFetching, projects }
}
