import React, { useEffect, useState } from 'react'
import RadioList from './RadioList'
import Button from './Button'
import { useUsersMe } from '../hooks/asana/useUsersMe.js'

function Workspace({ updateWorkspaceGid }) {
	const { isFetching, workspaces, meGid } = useUsersMe()

	const [radioList, setRadioList] = useState([])
	useEffect(() => {
		setRadioList(
			workspaces.map(workspace =>
				Object.assign(workspace, { key: workspace.gid })
			)
		)
	}, [workspaces])

	const [currentRadio, setCurrentRadio] = useState(null)
	const updateCurrentRadio = radioKey => {
		setCurrentRadio(radioKey)
	}

	const handleClick = () => {
		updateWorkspaceGid(meGid, currentRadio)
	}

	return (
		<>
			<h1>Workspaces</h1>
			{isFetching ? (
				<p>fetching...</p>
			) : (
				<RadioList
					inputName={'workspaces'}
					currentRadio={currentRadio}
					radioList={radioList}
					updateCurrentRadio={updateCurrentRadio}
				/>
			)}
			<Button isDisabled={!currentRadio} handleClick={handleClick}>
				confirm
			</Button>
		</>
	)
}

export default Workspace
