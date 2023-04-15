import React, { useContext } from 'react'
import BoardSection from './BoardSection.js'
import OooTrigger from './OooTrigger.js'
import { useSections } from '../hooks/asana/useSections.js'
import { useDateline } from '../reducers/useDateline.js'
import {
	getDisabledWeekdays,
	useProportion,
} from '../reducers/useProportion.js'
import { GidContext } from '../contexts/GidContext.js'
import { DatelineContext } from '../contexts/DatelineContext.js'
import { ProportionContext } from '../contexts/ProportionContext.js'
import { NavLink } from 'react-router-dom'
import { WORKSPACE, PROJECT, CUSTOM_FIELD } from '../configs/constent.js'
import { ClientContext } from '../contexts/ClientContext.js'

function Board() {
	const projectGid = PROJECT.WEB.GID
	const { user } = useContext(ClientContext)
	const { isFetching: isSectionsFetching, sections } = useSections({
		projectGid,
	})
	const sectionList = sections.map(section =>
		Object.assign(section, { key: section.gid })
	)

	const { dateline, proposeStartOn, proposeDueOn } = useDateline()

	const {
		accountingTasks,
		disabledDates,
		setDisabledDates,
		appendAccountingTask,
		deleteAccountingTask,
	} = useProportion()

	return (
		<GidContext.Provider
			value={{
				workspaceGid: WORKSPACE.KKDAY.GID,
				projectGid,
				customFieldGids: [CUSTOM_FIELD.ESTIMATION.GID],
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
						<div>
							<nav style={{ textAlign: 'right' }}>
								<NavLink
									to="/"
									style={({ isActive }) => ({
										color: isActive ? 'grey' : 'inherit',
									})}
								>
									Home
								</NavLink>
							</nav>
							<div style={{ maxWidth: '400px' }}>
								<p>{`disabled days: ${getDisabledWeekdays().join(', ')}`}</p>
								<p>{`disabled dates: ${
									disabledDates.length ? disabledDates.join(', ') : '--'
								}`}</p>
							</div>
							<OooTrigger
								setDisabledDates={setDisabledDates}
								startOn={dateline.startOn}
								dueOn={dateline.dueOn}
							/>
						</div>
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
