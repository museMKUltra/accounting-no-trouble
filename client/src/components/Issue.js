import React, { useEffect } from 'react'
import Task from './Task'
import { GidContext } from '../contexts/GidContext.js'
import { useTasksWithPayload } from '../hooks/asana/useTasksWithPayload'
import { DatelineContext } from '../contexts/DatelineContext.js'
import { ProportionContext } from '../contexts/ProportionContext.js'
import { useDateline } from '../reducers/useDateline.js'
import { useProportion } from '../reducers/useProportion.js'

const issueSectionGid = '1201191083505009'

function Issue() {
	const {
		isFetching: isTasksFetching,
		taskGids,
		fetchTasks,
		createSubtask,
	} = useTasksWithPayload()

	useEffect(() => {
		async function fetchIssueTasks() {
			await fetchTasks(issueSectionGid)
		}
		fetchIssueTasks()
	}, [])

	const { dateline, proposeStartOn, proposeDueOn } = useDateline()
	const { accountingTasks, appendAccountingTask, deleteAccountingTask } = useProportion()
	const customFieldGids = [
		'1202680372473546',
		'1200384734831601',
		'1204245619861384',
	]
	console.log(customFieldGids)
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
							}}
						>
							<button
								className='button'
								onClick={getAllChooseTask}
							>
								取得所選取的Tasks
							</button>
							<Task/>
						</GidContext.Provider>
					</ProportionContext.Provider>
				</DatelineContext.Provider>
			)}
		</>
	)
}

export default Issue
