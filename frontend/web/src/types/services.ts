export type EmptyType = Record<string, never>;
export type SignType = {
	user: {
		id: number;
		createdAt: Date;
		email: string;
		username: string;
	};
};
