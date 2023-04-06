import React, { useContext } from 'react'
import { useDetailTasks } from '../hooks/asana/useDetailTasks.js'
import { GidContext } from '../contexts/GidContext.js'
// import { useTasksWithPayload } from '../hooks/asana/useTasksWithPayload'

function Task() {
	const { taskGids, customFieldGids } = useContext(GidContext)

	const { isFetching, detailTasks } = useDetailTasks({ taskGids })

	// const {
	// 	createSubtask,
	// } = useTasksWithPayload()

	const taskList = detailTasks.map(task =>
		Object.assign(
			{},
			{
				key: task.gid,
				name: task.name,
				startOn: task.start_on,
				dueOn: task.due_on,
				customFields: task.custom_fields
					.filter(customField => {
						if(customFieldGids) {
							customFieldGids.includes(customField.gid)
						}
					})
					.map(customField =>
						Object.assign(
							{},
							{
								key: customField.gid,
								name: customField.name,
								displayValue: customField.display_value,
							}
						)
					),
			}
		)
	)

	const genSubTasks = (task) => {
		console.log(task)
		// createSubtask(task.gid)
	}

	return (
		<>
			<h1>Tasks</h1>
			{isFetching ? (
				<p>fetching...</p>
			) : (
				<>
					{taskList.map(task => (
						<div key={task.key}>
							<h2>{task.name}</h2>
							{ customFieldGids ? (
								<ul>
									<li key='due'>{`Due Date : ${task.startOn} ~ ${task.dueOn}`}</li>
									{task.customFields.map(customField => (
										<li key={customField.key}>
											{`${customField.name} : ${customField.displayValue}`}
										</li>
									))}
								</ul>
							) : (
								<button
									onClick={()=> {genSubTasks(task)}}
								>
									產生標準subtask
								</button>
							)}
						</div>
					))}
				</>
			)}
		</>
	)
}

export default Task
