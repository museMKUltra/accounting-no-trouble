import React from 'react'
import { useUsersMe } from '../hooks/asana/useUsersMe.js'
import BoardSection from './BoardSection.js'
import { GidContext } from '../contexts/GidContext.js'
import { useSections } from '../hooks/asana/useSections.js'

const workspaceGid = process.env.REACT_APP_WORKSPACE_GID
const projectGid = process.env.REACT_APP_PROJECT_GID
const customFieldGids = [process.env.REACT_APP_CUSTOM_FIELD_GID]

function Board2() {
	const { isFetching: isUsersMeFetching, meGid: assigneeGid } = useUsersMe()
	const { isFetching: isSectionsFetching, sections } = useSections({
		projectGid,
	})
	const sectionList = sections.map(section =>
		Object.assign(section, { key: section.gid })
	)

	return (
		<GidContext.Provider
			value={{
				workspaceGid,
				projectGid,
				customFieldGids,
				assigneeGid,
			}}
		>
			<h1>Board</h1>
			{isUsersMeFetching || isSectionsFetching ? (
				<p>fetching...</p>
			) : (
				sectionList.map(section => (
					<div key={section.key}>
						<h2>{section.name}</h2>
						<BoardSection sectionGid={section.gid} />
					</div>
				))
			)}
		</GidContext.Provider>
	)
}

export default Board2
