import React, { useContext } from 'react'
import { useTasks } from '../hooks/asana/useTasks.js'
import BoardTasks from './BoardTasks.js'
import { GidContext } from '../contexts/GidContext.js'

function BoardSection({ sectionGid }) {
	const { workspaceGid, assigneeGid } = useContext(GidContext)

	const { isFetching, tasks } = useTasks({
		workspaceGid,
		assigneeGid,
		sectionGid,
	})
	const taskGids = tasks.map(task => task.gid)

	return (
		<>{isFetching ? <p>fetching...</p> : <BoardTasks taskGids={taskGids} />}</>
	)
}

export default BoardSection
