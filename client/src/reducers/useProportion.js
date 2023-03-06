import { useReducer } from 'react'

const ONE_DAY_TIME = 1000 * 60 * 60 * 24
const ACCOUNTING_DAYS = [1, 2, 3, 4, 5]

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

function getAccountingTask(task) {
	const { gid, startOn, dueOn } = task
	const dayCount = getDayCount({ startOn, dueOn })

	return {
		gid,
		dates: getDateStringList({ startOn, dayCount }).filter(date =>
			ACCOUNTING_DAYS.includes(new Date(date).getDay())
		),
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
			return updatedProportionTasks([...state, getAccountingTask(action.task)])
		case 'remove':
			return updatedProportionTasks(
				state.filter(task => task.gid !== action.taskGid)
			)
		default:
			return state
	}
}

export function useProportion() {
	const [state, dispatch] = useReducer(reducer, [], state => state)

	return {
		accountingTasks: state,
		appendAccountingTask: task => dispatch({ type: 'add', task }),
		deleteAccountingTask: taskGid => dispatch({ type: 'remove', taskGid }),
	}
}
