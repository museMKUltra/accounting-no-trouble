import React, {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'
import Button from './Button.js'
import Checkbox from './Checkbox.js'
import { useDetailTasks } from '../hooks/asana/useDetailTasks.js'
import { useCheckbox } from '../reducers/useCheckbox.js'
import {
	dealDueOnDateline,
	dealStartOnDateline,
	defaultDateline,
	getTimeDueOn,
	getTimeStartOn,
} from '../reducers/useDateline.js'
import { DatelineContext } from '../contexts/DatelineContext.js'
import { ProportionContext } from '../contexts/ProportionContext.js'

const CUSTOM_FIELD_GID = process.env.REACT_APP_CUSTOM_FIELD_GID
const percentageFormatter = total => number =>
	`${Math.trunc((number / total) * 100)}%`

function BoardTasks({ tasks }) {
	const [taskList, setTaskList] = useState([])
	const { dateline, proposeStartOn, proposeDueOn } = useContext(DatelineContext)
	useEffect(() => {
		const { startOn, dueOn } = taskList.reduce(
			(dateline, { startOn, dueOn }) =>
				dealDueOnDateline(dealStartOnDateline(dateline, startOn), dueOn),
			defaultDateline
		)

		proposeStartOn(startOn)
		proposeDueOn(dueOn)
	}, [taskList])

	const taskGids = useMemo(() => tasks.map(task => task.gid), [tasks])
	const { isFetching, detailTasks } = useDetailTasks({ taskGids })
	useEffect(() => {
		const taskList = detailTasks.map(task => {
			const { startOn, dueOn } = (() => {
				const { start_on: startOn, due_on: dueOn } = task
				if (startOn && !dueOn) {
					return { startOn, dueOn: startOn }
				}
				if (!startOn && dueOn) {
					return { startOn: dueOn, dueOn }
				}
				return { startOn, dueOn }
			})()
			const customField = (() => {
				const { custom_fields: customFields = [] } = task
				const customField =
					customFields.find(
						customField => customField.gid === CUSTOM_FIELD_GID
					) || {}

				return {
					gid: customField.gid,
					key: customField.gid,
					name: customField.name,
					displayValue: customField.display_value,
				}
			})()

			return {
				gid: task.gid,
				key: task.gid,
				name: task.name,
				startOn,
				dueOn,
				customField,
			}
		})

		setTaskList(taskList)
	}, [detailTasks])

	const { checkedCheckboxes, checkCheckbox, uncheckCheckbox } = useCheckbox()
	const { accountingTasks, appendAccountingTask, deleteAccountingTask } =
		useContext(ProportionContext)
	const getSuggestiveProportion = useCallback(
		taskId => accountingTasks.find(task => task.gid === taskId)?.proportion,
		[accountingTasks]
	)

	const handleCheckboxCheck = taskGid => {
		const task = taskList.find(task => task.gid === taskGid)
		appendAccountingTask(task)
		checkCheckbox(taskGid)
	}

	const handleCheckboxUncheck = taskGid => {
		deleteAccountingTask(taskGid)
		uncheckCheckbox(taskGid)
	}

	return (
		<>
			{isFetching ? (
				<p>fetching...</p>
			) : (
				<div style={{ display: 'grid', gap: '12px' }}>
					{taskList.map(task => {
						const checked = checkedCheckboxes.includes(task.key)
						const disabled = !(task.startOn && task.dueOn)
						const displayDueDate = `${task.startOn} ~ ${task.dueOn}`

						const { paddingLeft, paddingRight } = (() => {
							const isAllTimeReady =
								task.startOn && task.dueOn && dateline.startOn && dateline.dueOn

							if (!isAllTimeReady) {
								return {
									paddingLeft: 0,
									paddingRight: 0,
								}
							}

							const gapTotal = dateline.dueOn - dateline.startOn
							const gapStartOn = getTimeStartOn(task.startOn) - dateline.startOn
							const gapDueOn = dateline.dueOn - getTimeDueOn(task.dueOn)
							const formatPercentage = percentageFormatter(gapTotal)

							return {
								paddingLeft: formatPercentage(gapStartOn),
								paddingRight: formatPercentage(gapDueOn),
							}
						})()

						const suggestiveProportion = getSuggestiveProportion(task.gid)
						const isSuggestiveDisabled =
							task.customField.displayValue === suggestiveProportion

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
											<div>{displayDueDate}</div>
											<div
												style={{
													paddingLeft,
													paddingRight,
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
											{task.customField.displayValue}
										</div>
										<div
											style={{
												width: '10%',
												display: 'flex',
												justifyContent: 'center',
											}}
										>
											{checked && (
												<Button
													disabled={isSuggestiveDisabled}
													style={{ width: '90%' }}
												>
													{suggestiveProportion}
												</Button>
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
