import React, { useEffect } from 'react'
import IssueTask from './IssueTask.js'
import { GidContext } from '../../contexts/GidContext.js'
import { useTasksWithPayload } from '../../hooks/asana/useTasksWithPayload.js'
import { DatelineContext } from '../../contexts/DatelineContext.js'
import { ProportionContext } from '../../contexts/ProportionContext.js'
import { useDateline } from '../../reducers/useDateline.js'
import { useProportion } from '../../reducers/useProportion.js'
import { PROJECT, SECTION } from '../../configs/constent.js'
import { getCustomFieldGids } from '../../helpers/gids.js'

const customFieldGids = getCustomFieldGids(PROJECT.ISSUE.GID)

function Issue() {
	const {
		isFetching: isTasksFetching,
		taskGids,
		fetchTasks,
		createSubtask,
	} = useTasksWithPayload()

	useEffect(() => {
		async function fetchIssueTasks() {
			await fetchTasks(SECTION.BACKLOG.GID)
		}
		fetchIssueTasks()
	}, [])
	const { dateline, proposeStartOn, proposeDueOn } = useDateline()
	const { accountingTasks, appendAccountingTask, deleteAccountingTask } =
		useProportion()
	const getAllChooseTask = () => {
		accountingTasks.forEach(task => {
			createSubtask(task.gid)
		})
	}

	return (
		<>
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
						<GidContext.Provider
							value={{
								taskGids,
								customFieldGids,
							}}
						>
							<button className="button" onClick={getAllChooseTask}>
								取得所選取的Tasks
							</button>
							<IssueTask />
						</GidContext.Provider>
					</ProportionContext.Provider>
				</DatelineContext.Provider>
			)}
		</>
	)
}

export default Issue
