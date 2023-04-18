import React, { useContext } from 'react'
import RadioList from '../RadioList.js'
import Button from '../Button.js'
import { useProjects } from '../../hooks/asana/useProjects.js'
import ProjectCustomField from './ProjectCustomField.js'
import { useCheckbox } from '../../reducers/useCheckbox.js'
import { useRadio } from '../../reducers/useRadio.js'
import { GidContext } from '../../contexts/GidContext.js'

function Project({ updateProjectGid }) {
	const { workspaceGid } = useContext(GidContext)

	const { isFetching, projects } = useProjects({ workspaceGid })
	const radioList = projects.map(project =>
		Object.assign(project, { key: project.gid })
	)

	const { checkedCheckboxes, checkCheckbox, uncheckCheckbox, cleanCheckbox } =
		useCheckbox()
	const { checkedRadio, updateRadio } = useRadio()

	const updateCurrentRadio = radioKey => {
		updateRadio(radioKey)
		cleanCheckbox()
	}
	const handleClick = () => {
		updateProjectGid(checkedRadio, checkedCheckboxes)
	}

	return (
		<>
			<h1>Projects</h1>
			{isFetching ? (
				<p>fetching...</p>
			) : (
				<RadioList
					inputName={'projects'}
					currentRadio={checkedRadio}
					radioList={radioList}
					updateCurrentRadio={updateCurrentRadio}
				>
					<ProjectCustomField
						projectGid={checkedRadio}
						checkedCheckboxes={checkedCheckboxes}
						checkCheckbox={checkCheckbox}
						uncheckCheckbox={uncheckCheckbox}
					/>
				</RadioList>
			)}
			<Button disabled={!checkedRadio} handleClick={handleClick}>
				confirm
			</Button>
		</>
	)
}

export default Project
