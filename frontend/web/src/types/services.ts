export type EmptyType = Record<string, never>;
export type LoginType = { token: string };
export type MeType = {
	Id: number;
	Email: string;
	Username: string;
	IsPrivate: true;
};
