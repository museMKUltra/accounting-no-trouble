import React, { useContext } from 'react'
import BoardSection from './BoardSection.js'
import { useSections } from '../hooks/asana/useSections.js'
import {
	WORKSPACE_GID as workspaceGid,
	PROJECT_GID_LIST as projectIdList,
} from '../configs/constent.js'
import { ClientContext } from '../contexts/ClientContext.js'
import { GidContext } from '../contexts/GidContext.js'

function Issue() {
	const projectGid = projectIdList.ISSUE
	const { user } = useContext(ClientContext)
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
			}}>
			{user.isFetching || isSectionsFetching ? (
				<p>fetching...</p>
			) : (
				sectionList.map(section => (
					<BoardSection key={section.key} section={section} />
				))
			)}
		</GidContext.Provider>
		
	)
}

export default Issue
