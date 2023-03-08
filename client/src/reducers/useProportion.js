import { useEffect, useReducer, useState } from 'react'

const ONE_DAY_TIME = 1000 * 60 * 60 * 24
const ACCOUNTING_DAYS = [1, 2, 3, 4, 5]
const WEEKDAY_MAP = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
]

export function getDisabledWeekdays() {
	return Array.from(Array(7).keys(), index => index)
		.filter(index => !ACCOUNTING_DAYS.includes(index))
		.map(day => WEEKDAY_MAP[day])
}

export function formatProportion(proportion) {
	return proportion.toFixed(2)
}

export function getDayCount({ startOn, dueOn }) {
	const timeStartOn = new Date(startOn).getTime()
	const timeDueOn = new Date(dueOn).getTime()

	return Math.round((timeDueOn - timeStartOn) / ONE_DAY_TIME) + 1
}

export function getDateStringList({ startOn, dayCount }) {
	return Array.from(Array(dayCount).keys(), index => {
		const date = new Date(startOn)
		date.setDate(date.getDate() + index)

		return date.toLocaleDateString()
	})
}

function getFilteredDates(dates, disabledDates) {
	return dates
		.filter(date => ACCOUNTING_DAYS.includes(new Date(date).getDay()))
		.filter(date => !disabledDates.includes(date))
}

function getAccountingTask(task, disabledDates) {
	const { gid, startOn, dueOn } = task
	const dayCount = getDayCount({ startOn, dueOn })
	const dateStringList = getDateStringList({ startOn, dayCount })

	return {
		gid,
		dates: getFilteredDates(dateStringList, disabledDates),
	}
}

function updateAccountingTask(task, disabledDates) {
	const { gid, dates } = task

	return {
		gid,
		dates: getFilteredDates(dates, disabledDates),
	}
}

function updatedProportionTasks(accountingTasks) {
	const accountingTaskCount = date => {
		return accountingTasks.reduce(
			(total, task) => (task.dates.includes(date) ? total + 1 : total),
			0
		)
	}

	return accountingTasks.map(task => {
		const totalProportion = task.dates.reduce((total, date) => {
			const proportion = 1 / accountingTaskCount(date)

			return total + proportion
		}, 0)
		return {
			...task,
			proportion: formatProportion(totalProportion),
		}
	})
}

const reducer = (state, action) => {
	switch (action.type) {
		case 'add':
			return updatedProportionTasks([
				...state,
				getAccountingTask(action.task, action.disabledDates),
			])
		case 'remove':
			return updatedProportionTasks(
				state.filter(task => task.gid !== action.taskGid)
			)
		case 'update':
			return updatedProportionTasks(
				state.map(task => updateAccountingTask(task, action.disabledDates))
			)
		default:
			return state
	}
}

export function useProportion() {
	const [state, dispatch] = useReducer(reducer, [], state => state)
	const [disabledDates, setDisabledDates] = useState([])

	useEffect(() => {
		dispatch({ type: 'update', disabledDates })
	}, [disabledDates])

	return {
		disabledDates,
		setDisabledDates,
		accountingTasks: state,
		appendAccountingTask: task =>
			dispatch({ type: 'add', task, disabledDates }),
		deleteAccountingTask: taskGid => dispatch({ type: 'remove', taskGid }),
	}
}
