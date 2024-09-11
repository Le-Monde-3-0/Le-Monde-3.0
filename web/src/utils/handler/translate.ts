const translations = [
	{
		english: 'password is not strong enough',
		french: 'Veuillez renseigner un mot de passe plus complexe.',
	},
	{
		english: 'an account with this username already exists',
		french: "Nom d'utilisateur déjà existant.",
	},
	{
		english: 'an account with this email already exists',
		french: 'Email déjà existant.',
	},
	{
		english: 'No message provided from the backend',
		french: 'Pas de message renvoyé par le backend.',
	},
];

const translateToFrench = (englishError?: string) => {
	if (!englishError) return undefined;
	const frenchError = translations.find((e) => e.english === englishError)?.french;
	if (!frenchError) return `Backend message: ${englishError}`;
	return frenchError;
};

export default translateToFrench;
