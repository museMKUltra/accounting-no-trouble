import React, { useContext } from 'react'
import Button from './Button'
import SectionTask from './SectionTask'
import { useSections } from '../hooks/asana/useSections.js'
import { useCheckbox } from '../reducers/useCheckbox.js'
import { GidContext } from '../contexts/GidContext.js'

function Section({ updateTaskGids }) {
	const { workspaceGid, assigneeGid, projectGid } = useContext(GidContext)

	const { isFetching, sections } = useSections({ projectGid })
	const sectionList = sections.map(section =>
		Object.assign(section, { key: section.gid })
	)

	const { checkedCheckboxes, checkCheckbox, uncheckCheckbox } = useCheckbox()

	const handleClick = () => updateTaskGids(checkedCheckboxes)

	return (
		<>
			<h1>Sections</h1>
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
			<Button disabled={sectionList.length === 0} handleClick={handleClick}>
				confirm
			</Button>
		</>
	)
}

export default Section
