import React, { useEffect } from 'react'
import BoardTasks from './BoardTasks'
import { useTasksWithPayload } from '../hooks/asana/useTasksWithPayload'
import { DatelineContext } from '../contexts/DatelineContext.js'
import { ProportionContext } from '../contexts/ProportionContext.js'
import { useDateline } from '../reducers/useDateline.js'
import { useProportion } from '../reducers/useProportion.js'

const issueSectionGid = '1201191083505009'

function Issue() {
	const {
		isFetching: isTasksFetching,
		tasks,
		fetchTasks,
	} = useTasksWithPayload()

	useEffect(() => {
		async function fetchIssueTasks() {
			await fetchTasks(issueSectionGid)
		}

		fetchIssueTasks()
	}, [])

	const { dateline, proposeStartOn, proposeDueOn } = useDateline()
	const { accountingTasks, appendAccountingTask, deleteAccountingTask } = useProportion()

	const getAllChooseTask = () => {
		console.log(accountingTasks)
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
						<button
							className='button'
							onClick={getAllChooseTask}
						>
							取得所選取的Tasks
						</button>
						<BoardTasks tasks={tasks} viewType='enableAll'/>
					</ProportionContext.Provider>
				</DatelineContext.Provider>
			)}
		</>
	)
}

export default Issue
