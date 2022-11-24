import React, { useEffect, useState } from 'react'
import RadioList from './RadioList'
import { fetchMe } from '../asana'
import Button from './Button'

function Workspace({ updateWorkspaceGid }) {
	let [radioList, setRadioList] = useState([])
	let [meGid, setMeGid] = useState(null)
	async function handleWorkspaces() {
		const { gid, workspaces } = await fetchMe()
		setMeGid(gid)
		setRadioList(
			workspaces.map(workspace =>
				Object.assign(workspace, { key: workspace.gid })
			)
		)
	}
	useEffect(() => {
		handleWorkspaces()
	}, [])

	let [currentRadio, setCurrentRadio] = useState(null)
	const updateCurrentRadio = radioKey => {
		setCurrentRadio(radioKey)
	}

	const handleClick = () => {
		updateWorkspaceGid(meGid, currentRadio)
	}

	return (
		<>
			<h1>Workspaces</h1>
			<RadioList
				inputName={'workspaces'}
				currentRadio={currentRadio}
				radioList={radioList}
				updateCurrentRadio={updateCurrentRadio}
			/>
			<Button isDisabled={!currentRadio} handleClick={handleClick}>
				confirm
			</Button>
		</>
	)
}

export default Workspace
