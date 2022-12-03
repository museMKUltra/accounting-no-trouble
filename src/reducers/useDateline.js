import { useReducer } from 'react'

export const defaultDateline = { startOn: null, dueOn: null }

export function getTimeStartOn(startOn) {
	const dateStartOn = new Date(startOn)
	dateStartOn.setUTCHours(0, 0, 0, 0)

	return dateStartOn.getTime()
}

export function getTimeDueOn(dueOn) {
	const dateDueOn = new Date(dueOn)
	dateDueOn.setUTCHours(23, 59, 59, 999)

	return dateDueOn.getTime()
}

function settleStartOn(state, startOn) {
	if (!state.startOn) {
		return startOn
	}
	return startOn < state.startOn ? startOn : state.startOn
}

function settleDueOn(state, dueOn) {
	if (!state.dueOn) {
		return dueOn
	}
	return dueOn > state.dueOn ? dueOn : state.dueOn
}

export function dealStartOnDateline(state, startOn) {
	if (!startOn) {
		return state
	}
	const timeStartOn = getTimeStartOn(startOn)

	return {
		...state,
		startOn: settleStartOn(state, timeStartOn),
	}
}

export function dealDueOnDateline(state, dueOn) {
	if (!dueOn) {
		return state
	}
	const timeDueOn = getTimeDueOn(dueOn)

	return {
		...state,
		dueOn: settleDueOn(state, timeDueOn),
	}
}

const reducer = (state, action) => {
	switch (action.type) {
		case 'start':
			return dealStartOnDateline(state, action.startOn)
		case 'due':
			return dealDueOnDateline(state, action.dueOn)
		default:
			return state
	}
}

export function useDateline() {
	const [state, dispatch] = useReducer(reducer, defaultDateline, state => state)

	return {
		dateline: state,
		proposeStartOn: startOn => dispatch({ type: 'start', startOn }),
		proposeDueOn: dueOn => dispatch({ type: 'due', dueOn }),
	}
}
