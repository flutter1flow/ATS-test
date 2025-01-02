export const getGregorianDate = (): string =>
	new Date().toLocaleDateString('ar-EG', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

export const getHijriDate = (): string =>
	new Date().toLocaleDateString('ar-EG-u-ca-islamic', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

export const getDate = (): string => {
	return new Date().toISOString().split('T')[0];
};
