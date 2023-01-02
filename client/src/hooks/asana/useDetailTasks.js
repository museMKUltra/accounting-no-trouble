import { client } from './asana.js'
import { useEffect, useState } from 'react'

export function useDetailTasks({ taskGids }) {
	const [detailTasks, setDetailTasks] = useState([])
	const [isFetching, setIsFetching] = useState(false)

	async function fetchDetailTasks(tasks) {
		try {
			setIsFetching(true)
			const promises = tasks.map(task => client.tasks.getTask(task, {}))
			const detailTasks = await Promise.all(promises)

			setDetailTasks(detailTasks)
		} catch (e) {
			console.error(e)
		} finally {
			setIsFetching(false)
		}
	}

	useEffect(() => {
		if (taskGids.length === 0) return

		fetchDetailTasks(taskGids)
	}, [taskGids])

	return { isFetching, detailTasks }
}
