import React, { useContext } from 'react'
import BoardSection from './BoardSection.js'
import { useSections } from '../hooks/asana/useSections.js'
import { useDateline } from '../reducers/useDateline.js'
import { useProportion } from '../reducers/useProportion.js'
import { GidContext } from '../contexts/GidContext.js'
import { DatelineContext } from '../contexts/DatelineContext.js'
import { ProportionContext } from '../contexts/ProportionContext.js'
import { NavLink } from 'react-router-dom'
import {
	WORKSPACE_GID as workspaceGid,
	PROJECT_GID as projectGid,
	CUSTOM_FIELD_GID as customFieldGid,
} from '../configs/constent.js'
import { ClientContext } from '../contexts/ClientContext.js'

function Board() {
	const { user } = useContext(ClientContext)
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
				customFieldGids: [customFieldGid],
				assigneeGid: user.gid,
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
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
						}}
					>
						<h1>Board</h1>
						<nav>
							<NavLink
								to="/"
								style={({ isActive }) => ({
									color: isActive ? 'grey' : 'inherit',
								})}
							>
								Home
							</NavLink>
						</nav>
					</div>
					{user.isFetching || isSectionsFetching ? (
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
