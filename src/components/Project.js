import React, { useState } from 'react'
import RadioList from './RadioList'
import Button from './Button'
import { useProjects } from '../hooks/asana/useProjects.js'

function Project({ workspaceGid, updateProjectGid }) {
	const { isFetching, projects } = useProjects({ workspaceGid })
	const radioList = projects.map(project =>
		Object.assign(project, { key: project.gid })
	)

	const [currentRadio, setCurrentRadio] = useState(null)
	const updateCurrentRadio = radioKey => {
		setCurrentRadio(radioKey)
	}

	const handleClick = () => {
		updateProjectGid(currentRadio)
	}

	return (
		<>
			<h1>Projects</h1>
			{isFetching ? (
				<p>fetching...</p>
			) : (
				<RadioList
					inputName={'projects'}
					currentRadio={currentRadio}
					radioList={radioList}
					updateCurrentRadio={updateCurrentRadio}
				/>
			)}
			<Button isDisabled={!currentRadio} handleClick={handleClick}>
				confirm
			</Button>
		</>
	)
}

export default Project
