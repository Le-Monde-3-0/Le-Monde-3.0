export const generateDailyStats = (totalStats: number): { date: string; daily: number; summed: number }[] => {
	let remainingDaily = totalStats;
	const dailyStats = [];
	let summed = 0;
	let daily = 0;

	while (remainingDaily > 0) {
		if (remainingDaily > 5) daily = Math.floor(Math.random() * remainingDaily);
		else daily = remainingDaily;
		summed += daily;

		dailyStats.push({
			date: '',
			daily: daily,
			summed,
		});
		remainingDaily -= daily;
	}

	for (let i = 0; i < dailyStats.length; i++) {
		const date = new Date(Date.now() - (dailyStats.length - i) * 24 * 60 * 60 * 1000);
		dailyStats[i].date = date.getDate().toString() + '/' + (date.getMonth() + 1).toString();
	}

	return dailyStats;
};
