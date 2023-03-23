import { useCallback, useContext, useEffect, useState } from 'react'
import { ClientContext } from '../../contexts/ClientContext.js'

export function useTasks({ workspaceGid, projectGid, sectionGid, assigneeGid }) {
	const [tasks, setTasks] = useState([])
	const [isFetching, setIsFetching] = useState(false)
	const { client } = useContext(ClientContext)

	const fetchTasks = useCallback(
		async (workspace, projectGid, assignee, section) => {
			try {
				setIsFetching(true)
				let condition = {}
				if(!assignee) {
					condition = {
						'projects.any': projectGid,
						'sections.any': section,
					}
				} else {
					condition = {
						'assignee.any': assignee,
						'sections.any': section,
					}
				}

				const { data: tasks = [] } = await client.tasks.searchTasksForWorkspace(
					workspace,
					condition
				)

				setTasks(tasks)
			} catch (e) {
				console.error(e)
			} finally {
				setIsFetching(false)
			}
		},
		[client]
	)

	useEffect(() => {
		if (!workspaceGid || !sectionGid) return

		fetchTasks(workspaceGid, projectGid, assigneeGid, sectionGid)
	}, [workspaceGid, projectGid, assigneeGid, sectionGid])

	return { isFetching, tasks }
}
