import { useEffect, useState } from 'react'
import { useTasks } from './useTasks.js'

export function useCreateSubtaskForTask() {
	const [result, setResult] = useState({})
	const { isFetching, response, createSubtaskForTask } = useTasks()

	useEffect(() => {
		if (!response) return

		const { data: result = {} } = response

		setResult(result)
	}, [response])

	return {
		isFetching,
		result,
		createSubtaskForTask,
	}
}
