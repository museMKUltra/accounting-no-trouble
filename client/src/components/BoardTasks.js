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
import { formatProportion } from '../reducers/useProportion.js'
import { DatelineContext } from '../contexts/DatelineContext.js'
import { ProportionContext } from '../contexts/ProportionContext.js'
import { ClientContext } from '../contexts/ClientContext.js'
import { CUSTOM_FIELD_GID } from '../configs/constent.js'

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
		const buttonList = detailTasks.map(task => ({
			taskGid: task.gid,
			isLoading: false,
		}))
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

			return {
				gid: task.gid,
				key: task.gid,
				name: task.name,
				startOn,
				dueOn,
				customField: getCustomField(task, CUSTOM_FIELD_GID),
			}
		})

		setButtonList(buttonList)
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

	const { client, fetchOauthToken } = useContext(ClientContext)
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
		const { gid: taskGid, name: taskName } = task
		const updateButtonLoading = isLoading => {
			setButtonList(buttonList =>
				buttonList.map(button => ({
					...button,
					isLoading: button.taskGid === taskGid ? isLoading : button.isLoading,
				}))
			)
		}

		const handleRefreshToken = async () => {
			await fetchOauthToken()
			submitSuggestiveProportion(task)
		}

		try {
			updateButtonLoading(true)
			const suggestiveProportion = getSuggestiveProportion(taskGid)
			const responseTask = await updateAsanaTaskCustomField({
				taskGid,
				customFieldGid: CUSTOM_FIELD_GID,
				customFieldValue: suggestiveProportion,
			})
			alert(`update "${taskName}" to "${suggestiveProportion}" successfully`)

			setTaskList(
				taskList.map(task => {
					if (task.gid === taskGid) {
						return Object.assign(task, {
							customField: getCustomField(responseTask, CUSTOM_FIELD_GID),
						})
					}
					return task
				})
			)
			updateButtonLoading(false)
		} catch (e) {
			if (e.status === 401) {
				handleRefreshToken()
			} else {
				console.error(e)
				updateButtonLoading(false)
			}
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

						const suggestiveProportion = getSuggestiveProportion(task.gid)
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
