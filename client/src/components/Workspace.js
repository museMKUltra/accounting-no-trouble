import React from 'react'
import RadioList from './RadioList.js'
import Button from './Button.js'
import { useUsersMe } from '../hooks/asana/useUsersMe.js'
import { useRadio } from '../reducers/useRadio.js'

function Workspace({ updateWorkspaceGid }) {
	const { isFetching, workspaces, meGid } = useUsersMe()
	const radioList = workspaces.map(workspace =>
		Object.assign(workspace, { key: workspace.gid })
	)

	const { checkedRadio, updateRadio } = useRadio()
	const handleClick = () => {
		updateWorkspaceGid(meGid, checkedRadio)
	}

	return (
		<>
			<h1>Workspaces</h1>
			{isFetching ? (
				<p>fetching...</p>
			) : (
				<RadioList
					inputName={'workspaces'}
					currentRadio={checkedRadio}
					radioList={radioList}
					updateCurrentRadio={updateRadio}
				/>
			)}
			<Button disabled={!checkedRadio} handleClick={handleClick}>
				confirm
			</Button>
		</>
	)
}

export default Workspace
