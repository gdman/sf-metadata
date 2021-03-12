module.exports = {
	transform: {
		'^.+\\.ts?$': 'ts-jest'
	},
	testEnvironment: 'node',
	testRegex: '/test/.*\\.(test|spec)?\\.(ts|tsx|js)$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	globalSetup: './test/global/cleanup.ts',
	globalTeardown: './test/global/cleanup.ts',
};