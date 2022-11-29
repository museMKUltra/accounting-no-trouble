import React, { useReducer } from 'react'
import Button from './Button'
import SectionTask from './SectionTask'
import { useSections } from '../hooks/asana/useSections.js'

const reducer = (state, action) => {
	switch (action.type) {
		case 'check': {
			return state.concat([action.checkbox])
		}
		case 'uncheck': {
			return state.filter(checkbox => checkbox !== action.checkbox)
		}
		default:
			return state
	}
}

function Section({ workspaceGid, assigneeGid, projectGid, updateTaskGids }) {
	const { isFetching, sections } = useSections({ projectGid })
	const sectionList = sections.map(section =>
		Object.assign(section, { key: section.gid })
	)

	const [state, dispatch] = useReducer(reducer, [], () => [])
	const checkCheckbox = checkedCheckbox => {
		dispatch({ type: 'check', checkbox: checkedCheckbox })
	}
	const uncheckCheckbox = uncheckedCheckbox => {
		dispatch({ type: 'uncheck', checkbox: uncheckedCheckbox })
	}

	const handleClick = () => {
		updateTaskGids(state)
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
							checkedCheckboxes={state}
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
