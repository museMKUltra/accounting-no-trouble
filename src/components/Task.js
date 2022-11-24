import React from 'react'
import { useDetailTasks } from '../hooks/asana/useDetailTasks.js'

function Task({ taskGids }) {
	const { isFetching, detailTasks } = useDetailTasks({ taskGids })
	const taskList = detailTasks.map(task =>
		Object.assign(task, { key: task.gid })
	)

	return (
		<>
			<h1>Task</h1>
			{isFetching ? (
				<p>fetching...</p>
			) : (
				<ul>
					{taskList.map(task => (
						<li key={task.key}>{task.name}</li>
					))}
				</ul>
			)}
		</>
	)
}

export default Task
