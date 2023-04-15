import { useCallback, useContext, useState } from 'react'
import { ClientContext } from '../../../contexts/ClientContext.js'
import { tasksForSectionGetter, subtaskForTaskCreator } from '../apis.js'

export function useTasks() {
	const [response, setResponse] = useState(null)
	const [isFetching, setIsFetching] = useState(false)
	const { client } = useContext(ClientContext)

	class Fetcher {
		constructor(callback) {
			this.callback = callback
		}

		async fetch() {
			try {
				setIsFetching(true)

				const response = await this.callback(...arguments)

				setResponse(response)
			} catch (e) {
				console.error(e)
			} finally {
				setIsFetching(false)
			}
		}
	}

	const getTasksForSection = useCallback(
		async (sectionGid, payload = {}) => {
			const getTasksForSection = tasksForSectionGetter(client)
			const fetcher = new Fetcher(getTasksForSection)

			await fetcher.fetch(sectionGid, payload)
		},
		[client]
	)

	const createSubtaskForTask = useCallback(
		async (taskGid, payload = {}) => {
			const createSubtaskForTask = subtaskForTaskCreator(client)
			const fetcher = new Fetcher(createSubtaskForTask)

			await fetcher.fetch(taskGid, payload)
		},
		[client]
	)

	return {
		isFetching,
		response,
		getTasksForSection,
		createSubtaskForTask,
	}
}
