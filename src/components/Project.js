import React, { useEffect, useState } from 'react'
import { fetchProjects } from '../asana'
import RadioList from './RadioList'
import Button from './Button'

function Project({ workspaceGid, updateProjectGid }) {
	let [radioList, setRadioList] = useState([])
	async function handleProjects(workspaceGid) {
		const { projects } = await fetchProjects(workspaceGid)
		setRadioList(
			projects.map(project => Object.assign(project, { key: project.gid }))
		)
	}
	useEffect(() => {
		if (!workspaceGid) {
			return
		}
		handleProjects(workspaceGid)
	}, [workspaceGid])

	let [currentRadio, setCurrentRadio] = useState(null)
	const updateCurrentRadio = radioKey => {
		setCurrentRadio(radioKey)
	}

	const handleClick = () => {
		updateProjectGid(currentRadio)
	}

	return (
		<>
			<h1>Projects</h1>
			<RadioList
				inputName={'projects'}
				currentRadio={currentRadio}
				radioList={radioList}
				updateCurrentRadio={updateCurrentRadio}
			/>
			<Button isDisabled={!currentRadio} handleClick={handleClick}>
				confirm
			</Button>
		</>
	)
}

export default Project
