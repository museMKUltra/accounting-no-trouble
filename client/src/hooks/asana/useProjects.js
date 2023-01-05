import { useCallback, useContext, useEffect, useState } from 'react'
import { ClientContext } from '../../contexts/ClientContext.js'

export function useProjects({ workspaceGid }) {
	const [projects, setProjects] = useState([])
	const [isFetching, setIsFetching] = useState(false)
	const { client } = useContext(ClientContext)

	const fetchProjects = useCallback(
		async workspace => {
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
		},
		[client]
	)

	useEffect(() => {
		if (!workspaceGid) return

		fetchProjects(workspaceGid)
	}, [workspaceGid])

	return { isFetching, projects }
}
