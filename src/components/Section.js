import React, { useEffect, useState } from 'react'
import Button from './Button'
import { fetchSections } from '../hooks/asana.js'
import SectionTask from './SectionTask'

function Section({ workspaceGid, assigneeGid, projectGid, updateTaskGids }) {
	let [sectionList, setSectionList] = useState([])

	async function handleSections(projectGid) {
		const { sections } = await fetchSections(projectGid)
		setSectionList(
			sections.map(section => Object.assign(section, { key: section.gid }))
		)
	}
	useEffect(() => {
		if (!projectGid) {
			return
		}
		handleSections(projectGid)
	}, [projectGid])

	let [checkedCheckboxes, setCheckedCheckboxes] = useState([])
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

	const handleClick = () => {
		updateTaskGids(checkedCheckboxes)
	}

	return (
		<>
			<h1>Section</h1>
			{sectionList.map(section => (
				<div key={section.key}>
					<h2>{section.name}</h2>
					<SectionTask
						workspaceGid={workspaceGid}
						assigneeGid={assigneeGid}
						sectionGid={section.gid}
						checkedCheckboxes={checkedCheckboxes}
						checkCheckbox={checkCheckbox}
						uncheckCheckbox={uncheckCheckbox}
					/>
				</div>
			))}
			<Button isDisabled={sectionList.length === 0} handleClick={handleClick}>
				confirm
			</Button>
		</>
	)
}

export default Section
