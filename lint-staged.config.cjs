module.exports = {
	'**/*.ts': ['eslint --fix', 'prettier --write'],
	'**/*.{json,yml,js,cjs,mjs}': ['prettier --write'],
};
