import { useEffect, useState } from 'react'
import { useTasks } from './useTasks.js'

export function useGetTasksForSection() {
	const [tasks, setTasks] = useState([])
	const [taskGids, setTaskGids] = useState([])
	const { isFetching, response, getTasksForSection } = useTasks()

	useEffect(() => {
		if (!response) return

		const { data: tasks = [] } = response
		const taskGids = tasks.map(task => task.gid)

		setTasks(tasks)
		setTaskGids(taskGids)
	}, [response])

	return {
		isFetching,
		tasks,
		taskGids,
		getTasksForSection,
	}
}
