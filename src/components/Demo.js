import React, { useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { GidContext } from '../contexts/GidContext.js'
import Workspace from './Workspace'
import Project from './Project'
import Section from './Section'
import Task from './Task.js'

function Demo({ path }) {
	const navigate = useNavigate()

	const locationStateLocation = useLocation()
	console.log('locationStateLocation', locationStateLocation)
	const [assigneeGid, setAssigneeGid] = useState('')
	const [workspaceGid, setWorkspaceGid] = useState('')
	const updateWorkspaceGid = (assigneeGid, workspaceGid) => {
		setAssigneeGid(assigneeGid)
		setWorkspaceGid(workspaceGid)
		navigate(`${path}/project`)
	}

	const [projectGid, setProjectGid] = useState('')
	const [customFieldGids, setCustomFieldGids] = useState([])
	const updateProjectGid = (projectGid, customFieldGids) => {
		setProjectGid(projectGid)
		setCustomFieldGids(customFieldGids)
		navigate(`${path}/section`)
	}

	const [taskGids, setTaskGids] = useState([])
	const updateTaskGids = gids => {
		setTaskGids(gids)
		navigate(`${path}/task`)
	}

	return (
		<div>
			<GidContext.Provider
				value={{
					assigneeGid,
					workspaceGid,
					projectGid,
					customFieldGids,
					taskGids,
				}}
			>
				<nav>
					<ul style={{ display: 'flex' }}>
						<li style={{ listStyleType: 'none', paddingRight: '8px' }}>
							<Link to={`${path}/workspace`}>Workspace</Link>
						</li>
						<li style={{ listStyleType: 'none', paddingRight: '8px' }}>
							<Link to={`${path}/project`}>Project</Link>
						</li>
						<li style={{ listStyleType: 'none', paddingRight: '8px' }}>
							<Link to={`${path}/section`}>Section</Link>
						</li>
						<li style={{ listStyleType: 'none', paddingRight: '8px' }}>
							<Link to={`${path}/task`}>Task</Link>
						</li>
						<li style={{ listStyleType: 'none', paddingRight: '8px' }}>
							<Link to="/board">Board</Link>
						</li>
					</ul>
				</nav>
				<Routes>
					<Route
						path="/workspace"
						element={<Workspace updateWorkspaceGid={updateWorkspaceGid} />}
					/>
					<Route
						path="/project"
						element={<Project updateProjectGid={updateProjectGid} />}
					/>
					<Route
						path="/section"
						element={<Section updateTaskGids={updateTaskGids} />}
					/>
					<Route path="/task" element={<Task />} />)
				</Routes>
			</GidContext.Provider>
		</div>
	)
}

export default Demo
