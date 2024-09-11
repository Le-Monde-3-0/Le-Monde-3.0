const frenchDate = (date: Date) => {
	const mois = [
		'Janvier',
		'Février',
		'Mars',
		'Avril',
		'Mai',
		'Juin',
		'Juillet',
		'Août',
		'Septembre',
		'Octobre',
		'Novembre',
		'Décembre',
	];

	const year = date.getFullYear();
	const dayNumber = date.getDate();
	const month = mois[date.getMonth()];
	const weekday = date.toLocaleDateString('fr-FR', { weekday: 'long' });

	const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
	return `${capitalize(weekday)}, le ${dayNumber} ${month} ${year}`;
};

export default frenchDate;
