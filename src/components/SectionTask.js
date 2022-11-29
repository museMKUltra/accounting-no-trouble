import React from 'react'
import CheckboxList from './CheckboxList'
import { useTasks } from '../hooks/asana/useTasks.js'

function SectionTask({
	workspaceGid,
	assigneeGid,
	sectionGid,
	checkedCheckboxes,
	checkCheckbox,
	uncheckCheckbox,
}) {
	const { isFetching, tasks } = useTasks({
		workspaceGid,
		assigneeGid,
		sectionGid,
	})
	const taskList = tasks.map(task => Object.assign(task, { key: task.gid }))

	return (
		<>
			{isFetching ? (
				<p>fetching...</p>
			) : (
				<CheckboxList
					checkboxList={taskList}
					checkedCheckboxes={checkedCheckboxes}
					checkCheckbox={checkCheckbox}
					uncheckCheckbox={uncheckCheckbox}
				/>
			)}
		</>
	)
}

export default SectionTask
