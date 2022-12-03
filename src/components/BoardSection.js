import React, { useContext } from 'react'
import { useTasks } from '../hooks/asana/useTasks.js'
import BoardTasks from './BoardTasks.js'
import { GidContext } from '../contexts/GidContext.js'

function BoardSection({ section }) {
	const { workspaceGid, assigneeGid } = useContext(GidContext)

	const { isFetching, tasks } = useTasks({
		workspaceGid,
		assigneeGid,
		sectionGid: section.gid,
	})
	const hasTasks = tasks.length > 0

	return (
		<>
			{isFetching ? (
				<p>fetching...</p>
			) : (
				hasTasks && (
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							border: '1px solid grey',
							padding: '12px 16px',
						}}
					>
						<p style={{ width: '140px' }}>{section.name}</p>
						<div style={{ flex: '1' }}>
							<BoardTasks tasks={tasks} />
						</div>
					</div>
				)
			)}
		</>
	)
}

export default BoardSection
