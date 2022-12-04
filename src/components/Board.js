import React from 'react'
import { useUsersMe } from '../hooks/asana/useUsersMe.js'
import BoardSection from './BoardSection.js'
import { useSections } from '../hooks/asana/useSections.js'
import { useDateline } from '../reducers/useDateline.js'
import { useProportion } from '../reducers/useProportion.js'
import { GidContext } from '../contexts/GidContext.js'
import { DatelineContext } from '../contexts/DatelineContext.js'
import { ProportionContext } from '../contexts/ProportionContext.js'

const workspaceGid = process.env.REACT_APP_WORKSPACE_GID
const projectGid = process.env.REACT_APP_PROJECT_GID
const customFieldGids = [process.env.REACT_APP_CUSTOM_FIELD_GID]

function Board() {
	const { isFetching: isUsersMeFetching, meGid: assigneeGid } = useUsersMe()
	const { isFetching: isSectionsFetching, sections } = useSections({
		projectGid,
	})
	const sectionList = sections.map(section =>
		Object.assign(section, { key: section.gid })
	)

	const { dateline, proposeStartOn, proposeDueOn } = useDateline()

	const { accountingTasks, appendAccountingTask, deleteAccountingTask } =
		useProportion()

	return (
		<GidContext.Provider
			value={{
				workspaceGid,
				projectGid,
				customFieldGids,
				assigneeGid,
			}}
		>
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
					<h1>Board</h1>
					{isUsersMeFetching || isSectionsFetching ? (
						<p>fetching...</p>
					) : (
						sectionList.map(section => (
							<BoardSection key={section.key} section={section} />
						))
					)}
				</ProportionContext.Provider>
			</DatelineContext.Provider>
		</GidContext.Provider>
	)
}

export default Board
