import {useCallback, useContext, useState} from 'react'
import { ClientContext } from '../../contexts/ClientContext.js'

export function useTasksWithPayload() {
	const [tasks, setTasks] = useState([])
	const [taskGids, setTaskGids] = useState([])
	const [isFetching, setIsFetching] = useState(false)
	const { client } = useContext(ClientContext)

	const fetchTasks = useCallback(
		async (sectionGid) => {
			try {
				setIsFetching(true)
				const { data: tasks = [] } = await client.tasks.getTasksForSection(
					sectionGid
				)
				const taskGids = tasks.reduce((result, task) => {
					result.push(task.gid)
					return result
				}, [])
				setTasks(tasks)
				setTaskGids(taskGids)
			} catch (e) {
				console.error(e)
			} finally {
				setIsFetching(false)
			}
		},
		[client]
	)

	const createSubtask = useCallback(
		async (taskGid, custom_fields = {}) => {
			try {
				setIsFetching(true)
				const { data: result = {} } = await client.tasks.createSubtaskForTask(
					taskGid,
					custom_fields
				)
				console.log(result)
			} catch(e) {
				console.error(e)
			} finally {
				setIsFetching(false)
			}
		}, [client])

	return {
		isFetching,
		tasks,
		taskGids,
		fetchTasks,
		createSubtask,
	}
}
