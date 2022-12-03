import React, { useCallback, useContext, useEffect, useMemo } from 'react'
import { useDetailTasks } from '../hooks/asana/useDetailTasks.js'
import { GidContext } from '../contexts/GidContext.js'
import { useCheckbox } from '../reducers/useCheckbox.js'
import { DatelineContext } from '../contexts/DatelineContext.js'
import Checkbox from './Checkbox.js'
import {
	defaultDateline,
	getTimeDueOn,
	getTimeStartOn,
	dealDueOnDateline,
	dealStartOnDateline,
} from '../reducers/useDateline.js'

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
	const { proposeStartOn, proposeDueOn, dateline } = useContext(DatelineContext)
	const taskDateline = useCallback(({ start_on: startOn, due_on: dueOn }) => {
		if (startOn && !dueOn) {
			return { startOn, dueOn: startOn }
		}
		if (!startOn && dueOn) {
			return { startOn: dueOn, dueOn }
		}
		return { startOn, dueOn }
	}, [])

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
										uncheckCheckbox={uncheckCheckbox}
										checkCheckbox={checkCheckbox}
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
