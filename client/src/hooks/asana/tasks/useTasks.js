import { useCallback, useContext, useState } from 'react'
import { ClientContext } from '../../../contexts/ClientContext.js'
import { tasksForSectionGetter, subtaskForTaskCreator } from '../apis.js'

export function useTasks() {
	const [response, setResponse] = useState(null)
	const [isFetching, setIsFetching] = useState(false)
	const { client, accessTokenRefresher } = useContext(ClientContext)

	class Fetcher {
		constructor(callback) {
			this.callback = callback
			this.handleRefreshAccessToken = accessTokenRefresher(
				async refresh => {
					await refresh()
					setTimeout(() => {
						this.fetch()
					})
				},
				error => {
					console.error(error)
				}
			)
		}

		async fetch() {
			try {
				setIsFetching(true)

				const response = await this.callback()

				setResponse(response)
			} catch (e) {
				await this.handleRefreshAccessToken(e)
			} finally {
				setIsFetching(false)
			}
		}
	}

	const getTasksForSection = useCallback(
		async (sectionGid, payload = {}) => {
			const getTasksForSection = tasksForSectionGetter(client)
			const fetcher = new Fetcher(
				getTasksForSection.bind(null, sectionGid, payload)
			)

			await fetcher.fetch()
		},
		[client]
	)

	const createSubtaskForTask = useCallback(
		async (taskGid, payload = {}) => {
			const createSubtaskForTask = subtaskForTaskCreator(client)
			const fetcher = new Fetcher(
				createSubtaskForTask.bind(null, taskGid, payload)
			)

			await fetcher.fetch()
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
