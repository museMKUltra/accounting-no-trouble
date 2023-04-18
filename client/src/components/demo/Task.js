import React, { useContext } from 'react'
import { useDetailTasks } from '../../hooks/asana/useDetailTasks.js'
import { GidContext } from '../../contexts/GidContext.js'

function Task() {
	const { taskGids, customFieldGids } = useContext(GidContext)

	const { isFetching, detailTasks } = useDetailTasks({ taskGids })
	const taskList = detailTasks.map(task =>
		Object.assign(
			{},
			{
				key: task.gid,
				name: task.name,
				startOn: task.start_on,
				dueOn: task.due_on,
				customFields: task.custom_fields
					.filter(customField => customFieldGids.includes(customField.gid))
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
							<ul>
								<li>{`Due Date : ${task.startOn} ~ ${task.dueOn}`}</li>
								{task.customFields.map(customField => (
									<li key={customField.key}>
										{`${customField.name} : ${customField.displayValue}`}
									</li>
								))}
							</ul>
						</div>
					))}
				</>
			)}
		</>
	)
}

export default Task
