import React, { useState } from 'react'
import Button from './Button'
import SectionTask from './SectionTask'
import { useSections } from '../hooks/asana/useSections.js'

function Section({ workspaceGid, assigneeGid, projectGid, updateTaskGids }) {
	const { isFetching, sections } = useSections({ projectGid })
	const sectionList = sections.map(section =>
		Object.assign(section, { key: section.gid })
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

	const handleClick = () => {
		updateTaskGids(checkedCheckboxes)
	}

	return (
		<>
			<h1>Section</h1>
			{isFetching ? (
				<p>fetching...</p>
			) : (
				sectionList.map(section => (
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
				))
			)}
			<Button isDisabled={sectionList.length === 0} handleClick={handleClick}>
				confirm
			</Button>
		</>
	)
}

export default Section
