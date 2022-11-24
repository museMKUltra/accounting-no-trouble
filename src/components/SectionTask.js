import React, { useEffect, useState } from 'react'
import CheckboxList from './CheckboxList'
import { fetchTasks } from '../asana'

function SectionTask({
	workspaceGid,
	assigneeGid,
	sectionGid,
	checkedCheckboxes,
	checkCheckbox,
	uncheckCheckbox,
}) {
	let [taskList, setTaskList] = useState([])

	async function handleTasks(workspaceGid, assigneeGid, sectionGid) {
		const { tasks } = await fetchTasks(workspaceGid, assigneeGid, sectionGid)
		console.log('tasks', tasks)
		setTaskList(tasks.map(task => Object.assign(task, { key: task.gid })))
	}
	useEffect(() => {
		if (!workspaceGid || !assigneeGid || !sectionGid) {
			return
		}
		handleTasks(workspaceGid, assigneeGid, sectionGid)
	}, [workspaceGid, assigneeGid, sectionGid])

	return (
		<CheckboxList
			checkboxList={taskList}
			checkedCheckboxes={checkedCheckboxes}
			checkCheckbox={checkCheckbox}
			uncheckCheckbox={uncheckCheckbox}
		/>
	)
}

export default SectionTask
