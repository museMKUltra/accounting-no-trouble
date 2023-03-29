import React, { useEffect } from 'react'
import BoardTasks from './BoardTasks'
import {
	WORKSPACE_GID as workspaceGid,
	PROJECT_GID_LIST as projectIdList,
} from '../configs/constent.js'
import { useTasksWithPayload } from '../hooks/asana/useTasksWithPayload'
import { DatelineContext } from '../contexts/DatelineContext.js'
import { ProportionContext } from '../contexts/ProportionContext.js'
import { useDateline } from '../reducers/useDateline.js'
import { useProportion } from '../reducers/useProportion.js'

const issueProjectGid = projectIdList.ISSUE
const issueSectionGid = '1201191083505009'

function Issue() {
	const {
		isFetching: isTasksFetching,
		tasks,
		fetchTasks,
	} = useTasksWithPayload()

	useEffect(() => {
		async function fetchIssueTasks() {
			await fetchTasks(workspaceGid, {
				'projects.any': issueProjectGid,
				'sections.any': issueSectionGid,
			})
		}

		fetchIssueTasks()
	}, [])

	const { dateline, proposeStartOn, proposeDueOn } = useDateline()
	const { accountingTasks, appendAccountingTask, deleteAccountingTask } = useProportion()

	return <>
		{isTasksFetching ? (
			<p>fetching...</p>
		) : (
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
					<BoardTasks tasks={tasks} />
				</ProportionContext.Provider>
			</DatelineContext.Provider>
		)}
</>
}

export default Issue
