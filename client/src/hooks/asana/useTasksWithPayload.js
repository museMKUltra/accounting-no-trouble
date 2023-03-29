import {useCallback, useContext, useState} from 'react'
import { ClientContext } from '../../contexts/ClientContext.js'

export function useTasksWithPayload() {
	const [tasks, setTasks] = useState([])
	const [isFetching, setIsFetching] = useState(false)
	const { client } = useContext(ClientContext)

	const fetchTasks = useCallback(
		async (workspace, payload) => {
			try {
				setIsFetching(true)
				const { data: tasks = [] } = await client.tasks.searchTasksForWorkspace(
					workspace,
					payload
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

	return {
		isFetching,
		tasks,
		fetchTasks,
	}
}
