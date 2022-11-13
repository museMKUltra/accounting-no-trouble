module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
		jest: true,
	},
	extends: ['eslint:recommended', 'plugin:react/recommended'],
	overrides: [],
	parser: '@babel/eslint-parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		babelOptions: {
			presets: ['@babel/preset-react'],
		},
	},
	plugins: ['react'],
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'never'],
		'react/prop-types': 'off',
		'react/react-in-jsx-scope': 'off',
	},
}
