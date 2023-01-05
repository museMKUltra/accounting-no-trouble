import { useCallback, useContext, useEffect, useState } from 'react'
import { ClientContext } from '../../contexts/ClientContext.js'

export function useDetailTasks({ taskGids }) {
	const [detailTasks, setDetailTasks] = useState([])
	const [isFetching, setIsFetching] = useState(false)
	const { client } = useContext(ClientContext)

	const fetchDetailTasks = useCallback(
		async tasks => {
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
		},
		[client]
	)

	useEffect(() => {
		if (taskGids.length === 0) return

		fetchDetailTasks(taskGids)
	}, [taskGids])

	return { isFetching, detailTasks }
}
