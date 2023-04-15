import React, {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import Button from '../Button.js'
import Checkbox from '../Checkbox.js'
import { useDetailTasks } from '../../hooks/asana/useDetailTasks.js'
import { useCheckbox } from '../../reducers/useCheckbox.js'
import {
	dealDueOnDateline,
	dealStartOnDateline,
	defaultDateline,
	getTimeDueOn,
	getTimeStartOn,
} from '../../reducers/useDateline.js'
import { formatProportion } from '../../reducers/useProportion.js'
import { DatelineContext } from '../../contexts/DatelineContext.js'
import { ProportionContext } from '../../contexts/ProportionContext.js'
import { ClientContext } from '../../contexts/ClientContext.js'
import { CUSTOM_FIELD } from '../../configs/constent.js'

const percentageFormatter = total => number =>
	`${Math.trunc((number / total) * 100)}%`

function BoardTasks({ tasks }) {
	const [buttonList, setButtonList] = useState([])

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
	const getCustomField = useCallback((task, customFieldGid) => {
		const { custom_fields: customFields = [] } = task
		const customField =
			customFields.find(customField => customField.gid === customFieldGid) || {}
		const { display_value: displayValue } = customField

		return {
			gid: customField.gid,
			key: customField.gid,
			name: customField.name,
			displayValue: displayValue && formatProportion(parseFloat(displayValue)),
		}
	}, [])
	useEffect(() => {
		const taskGidList = detailTasks.map(task => task.gid)
		const buttonList = taskGidList.map(taskGid => ({
			taskGid,
			isLoading: false,
		}))
		const taskList = detailTasks.reduce((taskList, task) => {
			const parentGid = task.parent?.gid || ''
			const isSubTask = taskGidList.includes(parentGid)

			if (isSubTask) {
				return taskList
			}

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

			taskList.push({
				gid: task.gid,
				key: task.gid,
				name: task.name,
				startOn,
				dueOn,
				customField: getCustomField(task, CUSTOM_FIELD.ESTIMATION.GID),
				parentGid: task.parent?.gid || '',
			})
			return taskList
		}, [])

		setButtonList(buttonList)
		setTaskList(taskList)
	}, [detailTasks])

	const [suggestiveProportionMap, setSuggestiveProportionMap] = useState({})
	const { checkedCheckboxes, checkCheckbox, uncheckCheckbox } = useCheckbox()
	const { accountingTasks, appendAccountingTask, deleteAccountingTask } =
		useContext(ProportionContext)
	useEffect(() => {
		setSuggestiveProportionMap(
			accountingTasks.reduce((proportionMap, task) => {
				proportionMap[task.gid] = task.proportion
				return proportionMap
			}, {})
		)
	}, [accountingTasks])

	const handleCheckboxCheck = taskGid => {
		const task = taskList.find(task => task.gid === taskGid)
		appendAccountingTask(task)
		checkCheckbox(taskGid)
	}

	const handleCheckboxUncheck = taskGid => {
		deleteAccountingTask(taskGid)
		uncheckCheckbox(taskGid)
	}

	const suspendedTasks = useRef([])
	const { client, accessTokenRefresher } = useContext(ClientContext)
	const updateAsanaTaskCustomField = useCallback(
		async ({ taskGid, customFieldGid, customFieldValue }) => {
			const response = await client.tasks.updateTask(taskGid, {
				custom_fields: {
					[customFieldGid]: customFieldValue,
				},
			})
			return response
		},
		[client]
	)

	const submitSuggestiveProportion = async task => {
		const { gid: taskGid, name: taskName, suggestiveProportion } = task
		const updateButtonLoading = isLoading => {
			setButtonList(buttonList =>
				buttonList.map(button => ({
					...button,
					isLoading: button.taskGid === taskGid ? isLoading : button.isLoading,
				}))
			)
		}
		const handleRefreshAccessToken = accessTokenRefresher(
			async refresh => {
				if (suspendedTasks.current.length > 0) {
					suspendedTasks.current.push(task)
					return
				}
				suspendedTasks.current.push(task)
				await refresh()
				setTimeout(() => {
					suspendedTasks.current.forEach(submitSuggestiveProportion)
					suspendedTasks.current = []
				})
			},
			error => {
				console.error(error)
				updateButtonLoading(false)
			}
		)

		try {
			updateButtonLoading(true)
			const responseTask = await updateAsanaTaskCustomField({
				taskGid,
				customFieldGid: CUSTOM_FIELD.ESTIMATION.GID,
				customFieldValue: suggestiveProportionMap[taskGid],
			})
			alert(`update "${taskName}" to "${suggestiveProportion}" successfully`)

			setTaskList(
				taskList.map(task => {
					if (task.gid === taskGid) {
						return Object.assign(task, {
							customField: getCustomField(
								responseTask,
								CUSTOM_FIELD.ESTIMATION.GID
							),
						})
					}
					return task
				})
			)
			updateButtonLoading(false)
		} catch (error) {
			handleRefreshAccessToken(error)
		}
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

						const suggestiveProportion = suggestiveProportionMap[task.gid]
						const isSuggestiveDisabled =
							task.customField.displayValue === suggestiveProportion
						const isButtonLoading =
							buttonList.find(button => button.taskGid === task.gid)
								.isLoading || false

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
													disabled={isSuggestiveDisabled || isButtonLoading}
													style={{ width: '90%' }}
													handleClick={() => submitSuggestiveProportion(task)}
												>
													{isButtonLoading ? 'wait' : suggestiveProportion}
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
