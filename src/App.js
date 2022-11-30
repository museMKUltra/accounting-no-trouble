import './App.css'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Workspace from './components/Workspace'
import Project from './components/Project'
import Section from './components/Section'
import Task from './components/Task.js'
import Home from './Home'
import { GidContext } from './contexts/GidContext.js'

function App() {
	const navigate = useNavigate()

	const [assigneeGid, setAssigneeGid] = useState('')
	const [workspaceGid, setWorkspaceGid] = useState('')
	const updateWorkspaceGid = (assigneeGid, workspaceGid) => {
		setAssigneeGid(assigneeGid)
		setWorkspaceGid(workspaceGid)
		navigate('/project')
	}

	const [projectGid, setProjectGid] = useState('')
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
			<GidContext.Provider
				value={{
					assigneeGid,
					workspaceGid,
					projectGid,
					customFieldGids,
					taskGids,
				}}
			>
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
					<Route path="/task" element={<Task />} />
					<Route path="/" element={<Home />} />
					{projectGid}
				</Routes>
			</GidContext.Provider>
		</div>
	)
}

export default App
