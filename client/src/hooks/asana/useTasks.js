import { client } from './asana.js'
import { useEffect, useState } from 'react'

export function useTasks({ workspaceGid, assigneeGid, sectionGid }) {
	const [tasks, setTasks] = useState([])
	const [isFetching, setIsFetching] = useState(false)

	async function fetchTasks(workspace, assignee, section) {
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
	}

	useEffect(() => {
		if (!workspaceGid || !assigneeGid || !sectionGid) return

		fetchTasks(workspaceGid, assigneeGid, sectionGid)
	}, [workspaceGid, assigneeGid, sectionGid])

	return { isFetching, tasks }
}
