module.exports = {
	'**/*.ts': ['eslint --fix', 'prettier --write', 'npm run tsc'],
	'**/*.{json,yml,js,cjs,mjs}': ['prettier --write'],
};
