import { useCallback, useContext, useEffect, useState } from 'react'
import { ClientContext } from '../../contexts/ClientContext.js'

export function useTasks({ workspaceGid, assigneeGid, sectionGid }) {
	const [tasks, setTasks] = useState([])
	const [isFetching, setIsFetching] = useState(false)
	const { client } = useContext(ClientContext)

	const fetchTasks = useCallback(
		async (workspace, assignee, section) => {
			try {
				setIsFetching(true)
				const { data: tasks = [] } = await client.tasks.searchTasksForWorkspace(
					workspace,
					{
						'assignee.any': assignee,
						'sections.any': section,
						is_subtask: false,
					}
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
		if (!workspaceGid || !assigneeGid || !sectionGid) return

		fetchTasks(workspaceGid, assigneeGid, sectionGid)
	}, [workspaceGid, assigneeGid, sectionGid])

	return { isFetching, tasks }
}
