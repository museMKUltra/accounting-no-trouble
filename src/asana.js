import asana from 'asana'

const WORKSPACE_NAME = 'kkday.com'
const PROJECT_NAME = 'Web'
const SECTION_NAME = 'In Development'
const TASK_NAME = 'Follow up on "[mweb][Calendar] New Component"'
const CUSTOM_FIELD_NAME = '估時(天)'

const client = asana.Client.create().useAccessToken(
	process.env.REACT_APP_ASANA_PAT
)

export const fetch = async () => {
	// get assignee gid & workspace gid
	const { gid: assignee = '', workspaces = [] } = await client.users.me()
	const { gid: workspace = '' } = workspaces.find(
		workspace => workspace.name === WORKSPACE_NAME
	)

	// get project gid
	const { data: projects = [] } = await client.projects.getProjects({
		workspace,
	})
	const { gid: project = '' } = projects.find(
		project => project.name === PROJECT_NAME
	)

	// get section gid
	const { data: sections = [] } = await client.sections.getSectionsForProject(
		project,
		{}
	)
	const { gid: section = '' } = sections.find(
		section => section.name === SECTION_NAME
	)

	// search tasks by assignee gid & section gid
	const { data: searchTasks = [] } = await client.tasks.searchTasksForWorkspace(
		workspace,
		{
			'assignee.any': assignee,
			'sections.any': section,
		}
	)

	// get custom field
	const { data: customFieldSettings = [] } =
		await client.customFieldSettings.getCustomFieldSettingsForProject(
			project,
			{}
		)
	const { gid: customField = '' } = customFieldSettings.find(
		customFieldSetting =>
			customFieldSetting.custom_field.name === CUSTOM_FIELD_NAME
	).custom_field
	console.log('customField', customField)

	// get task gid
	const promises = searchTasks.map(task => client.tasks.getTask(task.gid, {}))
	const tasks = await Promise.all(promises)
	const { gid: task } = tasks.find(task => task.name === TASK_NAME)
	console.log('task', task)

	// update task
	// const result = await client.tasks.updateTask(task, {
	// 	custom_fields: {
	// 		[customField]: 30,
	// 	},
	// })
	// console.log('result', result)
}
