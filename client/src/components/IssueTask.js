import React, { useContext } from 'react'
import { useDetailTasks } from '../hooks/asana/useDetailTasks.js'
import { GidContext } from '../contexts/GidContext.js'
import { useTasksWithPayload } from '../hooks/asana/useTasksWithPayload'

function IssueTask() {
	const { taskGids, customFieldGids } = useContext(GidContext)

	const { isFetching, detailTasks } = useDetailTasks({ taskGids })

	const { createSubtask } = useTasksWithPayload()

	const genSubTasks = task => {
		const customFieldPayload = {}
		let devices = []
		let specificFieldDetail = {}
		task.custom_fields.forEach(field => {
			if (customFieldGids.includes(field.gid)) {
				if (field.resource_subtype === 'enum') {
					Object.assign(customFieldPayload, {
						[`${field.gid}`]: field.enum_value.gid,
					})
				}
				if (field.gid === '1201233748610513') {
					specificFieldDetail = field
					devices = field.display_value.split(',')
				}
			}
		})

		devices.forEach(deviceName => {
			const subtaskName = `[${deviceName.trim()}] ${task.name}`
			const index = specificFieldDetail.multi_enum_values.findIndex(option => {
				return option.name.trim() == deviceName.trim()
			})
			Object.assign(customFieldPayload, {
				[`${specificFieldDetail.gid}`]: [
					specificFieldDetail.multi_enum_values[index].gid,
				],
			})
			createSubtask(task.gid, {
				name: subtaskName,
				custom_fields: customFieldPayload,
			})
		})
	}

	return (
		<>
			<h1>Tasks</h1>
			{isFetching ? (
				<p>fetching...</p>
			) : (
				<>
					{detailTasks.map(task => (
						<div key={task.gid}>
							<h2>{task.name}</h2>
							<button
								onClick={() => {
									genSubTasks(task)
								}}
							>
								產生標準subtask
							</button>
						</div>
					))}
				</>
			)}
		</>
	)
}

export default IssueTask
