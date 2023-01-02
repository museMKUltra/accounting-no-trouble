import { useReducer } from 'react'

const reducer = (state, action) => {
	switch (action.type) {
		case 'update': {
			return action.radio
		}
		case 'uncheck': {
			return ''
		}
		case 'clean': {
			return []
		}
		default:
			return state
	}
}

export function useRadio() {
	const [state, dispatch] = useReducer(reducer, '', () => '')

	return {
		checkedRadio: state,
		updateRadio: radio => {
			dispatch({ type: 'update', radio })
		},
	}
}
