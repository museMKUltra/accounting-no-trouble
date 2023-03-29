import React, { useContext } from 'react'
import { useTasks } from '../hooks/asana/useTasks.js'
import BoardTasks from './BoardTasks.js'
import { GidContext } from '../contexts/GidContext.js'

function BoardSection({ section }) {
	const { workspaceGid, projectGid, assigneeGid } = useContext(GidContext)
	const { isFetching, tasks } = useTasks({
		workspaceGid,
		projectGid,
		assigneeGid,
		sectionGid: section.gid,
	})
	const hasTasks = tasks.length > 0
	const viewType = 'enableAll'
	return (
		<>
			{isFetching ? (
				<p>fetching...</p>
			) : (
				hasTasks && (
					<>
						<div
							style={{
								display: 'flex',
								gap: '12px',
								alignItems: 'center',
								border: '1px solid grey',
								padding: '16px',
								margin: '16px 0',
							}}
						>
							<h2
								style={{
									fontSize: '16px',
									padding: 0,
									width: '20%',
								}}
							>
								{section.name}
							</h2>
							<div style={{ flex: '1' }}>
								<BoardTasks tasks={tasks} viewType={viewType}/>
							</div>
						</div>
					</>
				)
			)}
		</>
	)
}

export default BoardSection
