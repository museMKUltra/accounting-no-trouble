import asana from 'asana'

// const WORKSPACE_NAME = 'kkday.com'
// const PROJECT_NAME = 'Web'
// const SECTION_NAME = 'In Development'
const SECTION_NAMES = ['TODO', 'In Development', 'In Code Review']
const TASK_NAME = 'web-contributing-guidelines - npm link'
const CUSTOM_FIELD_NAME = '估時(天)'

export const client = asana.Client.create().useAccessToken(
	process.env.REACT_APP_ASANA_PAT
)

export async function fetchMe() {
	const { gid = '', workspaces = [] } = await client.users.me()

	return { gid, workspaces }
}

export async function fetchProjects(workspaceGid) {
	const { data: projects = [] } = await client.projects.getProjects({
		workspace: workspaceGid,
	})

	return { projects }
}

export async function fetchSections(projectGid) {
	const { data: sections = [] } = await client.sections.getSectionsForProject(
		projectGid,
		{}
	)

	return { sections }
}

export async function fetchTasks(workspaceGid, assigneeGid, sectionGid) {
	const { data: tasks = [] } = await client.tasks.searchTasksForWorkspace(
		workspaceGid,
		{
			'assignee.any': assigneeGid,
			'sections.any': sectionGid,
		}
	)

	return { tasks }
}

export async function updateAsanaTaskCustomField({
	taskGid,
	customFieldGid,
	customFieldValue,
}) {
	const response = await client.tasks.updateTask(taskGid, {
		custom_fields: {
			[customFieldGid]: customFieldValue,
		},
	})
	// const response = {
	// 	custom_fields: [
	// 		{
	// 			gid: '1201939511159645',
	// 			resource_type: 'custom_field',
	// 			resource_subtype: 'number',
	// 			type: 'number',
	// 			name: '估時(天)',
	// 			enabled: true,
	// 			precision: 2,
	// 			number_value: 8,
	// 			display_value: '8',
	// 			created_by: {
	// 				gid: '504260977666421',
	// 				resource_type: 'user',
	// 				name: 'Danny Lin',
	// 			},
	// 		},
	// 	],
	// }
	return response
}

export const fetch = async () => {
	const { assigneeGid, workspaceGid } = await fetchMe()
	const projectGid = await fetchProjects(workspaceGid)

	const { sections, section } = await fetchSections(projectGid)

	const searchTasks = await fetchTasks(workspaceGid, assigneeGid, section)

	const filteredSections = sections.filter(section =>
		SECTION_NAMES.includes(section.name)
	)
	console.log('sections', filteredSections)

	// get custom field
	const { data: customFieldSettings = [] } =
		await client.customFieldSettings.getCustomFieldSettingsForProject(
			projectGid,
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
