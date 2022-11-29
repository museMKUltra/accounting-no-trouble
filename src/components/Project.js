import React, { useState } from 'react'
import RadioList from './RadioList'
import Button from './Button'
import { useProjects } from '../hooks/asana/useProjects.js'
import ProjectCustomField from './ProjectCustomField.js'

function Project({ workspaceGid, updateProjectGid }) {
	const { isFetching, projects } = useProjects({ workspaceGid })
	const radioList = projects.map(project =>
		Object.assign(project, { key: project.gid })
	)

	const [checkedCheckboxes, setCheckedCheckboxes] = useState([])
	const checkCheckbox = checkedCheckbox => {
		setCheckedCheckboxes([...checkedCheckboxes, checkedCheckbox])
	}
	const uncheckCheckbox = uncheckedCheckbox => {
		setCheckedCheckboxes(
			checkedCheckboxes.filter(
				checkedCheckbox => checkedCheckbox !== uncheckedCheckbox
			)
		)
	}

	const [currentRadio, setCurrentRadio] = useState(null)
	const updateCurrentRadio = radioKey => {
		setCurrentRadio(radioKey)
		setCheckedCheckboxes([])
	}

	const handleClick = () => {
		updateProjectGid(currentRadio, checkedCheckboxes)
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
				>
					<ProjectCustomField
						projectGid={currentRadio}
						checkedCheckboxes={checkedCheckboxes}
						checkCheckbox={checkCheckbox}
						uncheckCheckbox={uncheckCheckbox}
					/>
				</RadioList>
			)}
			<Button isDisabled={!currentRadio} handleClick={handleClick}>
				confirm
			</Button>
		</>
	)
}

export default Project
