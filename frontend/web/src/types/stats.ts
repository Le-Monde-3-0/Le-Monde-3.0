export type Stats = {
	likes: {
		total: number;
		daily: { date: string; daily: number; summed: number }[]; // daily is the stat for the given date, summed is the sum of all the daily values since the older date until the given date
	};
	views: {
		total: number;
		daily: { date: string; daily: number; summed: number }[]; // daily is the stat for the given date, summed is the sum of all the daily values since the older date until the given date
	};
};
