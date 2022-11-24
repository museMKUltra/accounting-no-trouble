import './App.css'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Workspace from './components/Workspace'
import Project from './components/Project'
import Section from './components/Section'
import Task from './components/Task.js'
import Home from './Home'

function App() {
	const navigate = useNavigate()

	const [assigneeGid, setAssigneeGid] = useState(null)
	const [workspaceGid, setWorkspaceGid] = useState(null)
	const updateWorkspaceGid = (assigneeGid, workspaceGid) => {
		setAssigneeGid(assigneeGid)
		setWorkspaceGid(workspaceGid)
		navigate('/project')
	}

	const [projectGid, setProjectGid] = useState(null)
	const [customFieldGids, setCustomFieldGids] = useState([])
	const updateProjectGid = (projectGid, customFieldGids) => {
		setProjectGid(projectGid)
		setCustomFieldGids(customFieldGids)
		navigate('/section')
	}

	const [taskGids, setTaskGids] = useState([])
	const updateTaskGids = gids => {
		setTaskGids(gids)
		navigate('/task')
	}

	return (
		<div className="App">
			<nav>
				<ul style={{ display: 'flex' }}>
					<li style={{ listStyleType: 'none', paddingRight: '8px' }}>
						<Link to="/workspace">Workspace</Link>
					</li>
					<li style={{ listStyleType: 'none', paddingRight: '8px' }}>
						<Link to="/project">Project</Link>
					</li>
					<li style={{ listStyleType: 'none', paddingRight: '8px' }}>
						<Link to="/section">Section</Link>
					</li>
					<li style={{ listStyleType: 'none', paddingRight: '8px' }}>
						<Link to="/task">Task</Link>
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
					element={
						<Project
							workspaceGid={workspaceGid}
							updateProjectGid={updateProjectGid}
						/>
					}
				/>
				<Route
					path="/section"
					element={
						<Section
							workspaceGid={workspaceGid}
							assigneeGid={assigneeGid}
							projectGid={projectGid}
							updateTaskGids={updateTaskGids}
						/>
					}
				/>
				<Route
					path="/task"
					element={
						<Task taskGids={taskGids} customFieldGids={customFieldGids} />
					}
				/>
				<Route path="/" element={<Home />} />
				{projectGid}
			</Routes>
		</div>
	)
}

export default App
