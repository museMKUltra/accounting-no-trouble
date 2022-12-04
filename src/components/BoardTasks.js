import React, { useCallback, useContext, useEffect, useMemo } from 'react'
import { useDetailTasks } from '../hooks/asana/useDetailTasks.js'
import { GidContext } from '../contexts/GidContext.js'
import { useCheckbox } from '../reducers/useCheckbox.js'
import { DatelineContext } from '../contexts/DatelineContext.js'
import Checkbox from './Checkbox.js'
import {
	dealDueOnDateline,
	dealStartOnDateline,
	defaultDateline,
	getTimeDueOn,
	getTimeStartOn,
} from '../reducers/useDateline.js'

const ONE_DAY_TIME = 1000 * 60 * 60 * 24
const ACCOUNTING_DAYS = [1, 2, 3, 5]
const percentageFormatter = total => number =>
	`${Math.trunc((number / total) * 100)}%`

function BoardTasks({ tasks }) {
	const { customFieldGids } = useContext(GidContext)
	const taskGids = useMemo(() => tasks.map(task => task.gid), [tasks])
	const { isFetching, detailTasks } = useDetailTasks({ taskGids })
	const { checkedCheckboxes, checkCheckbox, uncheckCheckbox } = useCheckbox()
	const disabledCheckboxes = useMemo(
		() =>
			detailTasks
				.filter(task => !task.start_on && !task.due_on)
				.map(task => task.gid),
		[detailTasks]
	)
	const {
		dateline,
		proposeStartOn,
		proposeDueOn,
		appendAccountingTask,
		deleteAccountingTask,
	} = useContext(DatelineContext)
	const taskDateline = useCallback(({ start_on: startOn, due_on: dueOn }) => {
		if (startOn && !dueOn) {
			return { startOn, dueOn: startOn }
		}
		if (!startOn && dueOn) {
			return { startOn: dueOn, dueOn }
		}
		return { startOn, dueOn }
	}, [])

	const getTaskDueDates = taskGid => {
		const task = detailTasks.find(task => task.gid === taskGid) || {}

		return taskDateline(task)
	}

	const handleCheckboxCheck = taskGid => {
		const { startOn, dueOn } = getTaskDueDates(taskGid)
		const timeStartOn = new Date(startOn).getTime()
		const timeDueOn = new Date(dueOn).getTime()
		const dayCount = Math.round((timeDueOn - timeStartOn) / ONE_DAY_TIME)

		appendAccountingTask({
			gid: taskGid,
			dates: Array.from(Array(dayCount).keys(), index => {
				const date = new Date(startOn)
				date.setDate(date.getDate() + index)
				return date.toISOString().slice(0, 10)
			}).filter(date => ACCOUNTING_DAYS.includes(new Date(date).getDay())),
		})
		checkCheckbox(taskGid)
	}

	const handleCheckboxUncheck = taskGid => {
		deleteAccountingTask(taskGid)
		uncheckCheckbox(taskGid)
	}

	useEffect(() => {
		const { startOn, dueOn } = detailTasks.reduce((dateline, task) => {
			const { startOn, dueOn } = taskDateline(task)

			return dealDueOnDateline(dealStartOnDateline(dateline, startOn), dueOn)
		}, defaultDateline)

		proposeStartOn(startOn)
		proposeDueOn(dueOn)
	}, [detailTasks])

	const taskList = detailTasks.map(task => {
		const { startOn, dueOn } = taskDateline(task)
		const isAllTimeReady =
			startOn && dueOn && dateline.startOn && dateline.dueOn

		const datelineSpace = () => {
			if (!isAllTimeReady) {
				return {
					paddingLeft: 0,
					paddingRight: 0,
				}
			}

			const gapTotal = dateline.dueOn - dateline.startOn
			const gapStartOn = getTimeStartOn(startOn) - dateline.startOn
			const gapDueOn = dateline.dueOn - getTimeDueOn(dueOn)
			const formatPercentage = percentageFormatter(gapTotal)

			return {
				paddingLeft: formatPercentage(gapStartOn),
				paddingRight: formatPercentage(gapDueOn),
			}
		}

		const { paddingLeft, paddingRight } = datelineSpace()

		return Object.assign(
			{},
			{
				key: task.gid,
				name: task.name,
				startOn: task.start_on,
				dueOn: task.due_on,
				paddingLeft,
				paddingRight,
				customFields: task.custom_fields
					.filter(customField => customFieldGids.includes(customField.gid))
					.map(customField => ({
						key: customField.gid,
						name: customField.name,
						displayValue: customField.display_value,
					})),
			}
		)
	})

	return (
		<>
			{isFetching ? (
				<p>fetching...</p>
			) : (
				<div style={{ display: 'grid', gap: '12px' }}>
					{taskList.map(task => {
						const checked = checkedCheckboxes.includes(task.key)
						const disabled = disabledCheckboxes.includes(task.key)

						return (
							<div
								key={task.key}
								style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
							>
								<div style={{ width: '30%' }}>
									<Checkbox
										checked={checked}
										disabled={disabled}
										checkbox={task}
										checkCheckbox={handleCheckboxCheck}
										uncheckCheckbox={handleCheckboxUncheck}
									/>
								</div>
								{disabled || (
									<>
										<div
											style={{
												flex: '1',
												display: 'grid',
												gap: '4px',
												opacity: checked ? 1 : 0.2,
											}}
										>
											<div>
												<span>{task.startOn}</span>
												&nbsp;~&nbsp;
												<span>{task.dueOn}</span>
											</div>
											<div
												style={{
													paddingLeft: task.paddingLeft,
													paddingRight: task.paddingRight,
													background: 'lightgray',
													borderRadius: '4px',
												}}
											>
												<div
													style={{
														height: '8px',
														background: 'gray',
														borderRadius: '4px',
													}}
												/>
											</div>
										</div>
										<div
											style={{
												width: '10%',
												display: 'flex',
												justifyContent: 'center',
											}}
										>
											{task.customFields[0].displayValue}
										</div>
										<div
											style={{
												width: '10%',
												display: 'flex',
												justifyContent: 'center',
											}}
										>
											{checked && (
												<button
													disabled={
														task.customFields[0].displayValue === '16.00'
													}
													style={{
														width: '90%',
														cursor:
															task.customFields[0].displayValue === '16.00'
																? 'default'
																: 'pointer',
													}}
												>
													16.00
												</button>
											)}
										</div>
									</>
								)}
							</div>
						)
					})}
				</div>
			)}
		</>
	)
}

export default BoardTasks
