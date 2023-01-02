import React, { useState } from 'react'
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import { GidContext } from '../contexts/GidContext.js'
import Workspace from './Workspace.js'
import Project from './Project.js'
import Section from './Section.js'
import Task from './Task.js'

function Demo({ path }) {
	const navigate = useNavigate()

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
		<GidContext.Provider
			value={{
				assigneeGid,
				workspaceGid,
				projectGid,
				customFieldGids,
				taskGids,
			}}
		>
			<nav style={{ display: 'flex', justifyContent: 'space-between' }}>
				<ul style={{ display: 'grid', gap: '4px', margin: 0, padding: 0 }}>
					<li style={{ listStyleType: 'none', paddingRight: '8px' }}>
						<NavLink
							to={`${path}/workspace`}
							style={({ isActive }) => ({
								color: isActive ? 'grey' : 'inherit',
							})}
						>
							Step 1. Workspace
						</NavLink>
					</li>
					<li style={{ listStyleType: 'none', paddingRight: '8px' }}>
						<NavLink
							to={`${path}/project`}
							style={({ isActive }) => ({
								color: isActive ? 'grey' : 'inherit',
							})}
						>
							Step 2. Project
						</NavLink>
					</li>
					<li style={{ listStyleType: 'none', paddingRight: '8px' }}>
						<NavLink
							to={`${path}/section`}
							style={({ isActive }) => ({
								color: isActive ? 'grey' : 'inherit',
							})}
						>
							Step 3. Section
						</NavLink>
					</li>
					<li style={{ listStyleType: 'none', paddingRight: '8px' }}>
						<NavLink
							to={`${path}/task`}
							style={({ isActive }) => ({
								color: isActive ? 'grey' : 'inherit',
							})}
						>
							Step 4. Task
						</NavLink>
					</li>
					<li style={{ listStyleType: 'none', paddingRight: '8px' }}></li>
				</ul>
				<NavLink
					to="/board"
					style={({ isActive }) => ({
						color: isActive ? 'grey' : 'inherit',
					})}
				>
					Board
				</NavLink>
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
	)
}

export default Demo
