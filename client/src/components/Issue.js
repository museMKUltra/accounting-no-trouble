import React, { useContext } from 'react'
import BoardSection from './BoardSection.js'
import { useSections } from '../hooks/asana/useSections.js'
import { useDateline } from '../reducers/useDateline.js'
import {
	WORKSPACE_GID as workspaceGid,
	PROJECT_GID_LIST as projectIdList,
} from '../configs/constent.js'
import { ClientContext } from '../contexts/ClientContext.js'
import { GidContext } from '../contexts/GidContext.js'
import { DatelineContext } from '../contexts/DatelineContext.js'
import { ProportionContext } from '../contexts/ProportionContext.js'
import {
	useProportion,
} from '../reducers/useProportion.js'

function Issue() {
	const projectGid = projectIdList.ISSUE
	const issueSectionGid = '1201191083505009'
	const { user } = useContext(ClientContext)
	const { isFetching: isSectionsFetching, sections } = useSections({
		projectGid,
	})
	const issueSection = sections.find(section =>
		section.gid === issueSectionGid
	)
	const { dateline, proposeStartOn, proposeDueOn } = useDateline()
	const {
		accountingTasks,
		appendAccountingTask,
		deleteAccountingTask,
	} = useProportion()

	return (
		<GidContext.Provider
			value={{
				workspaceGid,
				projectGid,
			}}>
			<DatelineContext.Provider
				value={{
					dateline,
					proposeStartOn,
					proposeDueOn,
				}}
			>
				<ProportionContext.Provider
					value={{
						accountingTasks,
						appendAccountingTask,
						deleteAccountingTask,
					}}
				>
					{user.isFetching || isSectionsFetching ? (
						<p>fetching...</p>
					) : (
						<BoardSection key={issueSection.key} section={issueSection}/>
					)}
				</ProportionContext.Provider>
			</DatelineContext.Provider>
		</GidContext.Provider>
		
	)
}

export default Issue
