// Params
export type AuthSignUp = { email: string; username: string; password: string };
export type AuthSignIn = { identifier: string; password: string };
export type AuthUpdatePassword = { oldPassword: string; newPassword: string };
export type AuthUpdateEmail = { newEmail: string };
export type AuthUpdateUsername = { newUsername: string };

export type ArticlesCreate = {
	title: string;
	subtitle?: string;
	content: string;
	topic: number;
	draft: boolean;
};
export type ArticlesDelete = { id: number };
export type ArticlesLike = { id: number; isLiked: boolean };
export type ArticlesSearchOne = { id: number };
export type ArticlesSearchMany = {
	author?: string;
	draft?: boolean;
	topic?: number;
	isLiked?: boolean;
	anthologyId?: number;
	query?: string;
};
export type ArticlesUpdate = {
	id: number;
	newTitle?: string;
	newSubtitle?: string;
	newContent?: string;
	newTopic?: number;
	newDraft?: boolean;
};

export type AnthologiesArticles = { id: number };
export type AnthologiesCreate = {
	name: string;
	description: string;
	isPublic: boolean;
	articles?: number[];
};
export type AnthologiesDelete = { id: number };
export type AnthologiesSearchOne = { id: number };
export type AnthologiesSearchMany = { author?: string; query?: string };
export type AnthologiesUpdate = {
	id: number;
	addArticles?: number[];
	removeArticles?: number[];
	newName?: string;
	newDescription?: string;
	newIsPublic?: boolean;
};

export type TopicsSearchOne = { id: number };

// Responses
export type EmptyResponse = Record<string, never>;
// TODO: not clean, same as Auth type
export type SignResponse = {
	user: {
		id: number;
		createdAt: Date;
		email: string;
		username: string;
	};
};
// TODO: not clean, same as Auth type
export type MeResponse = {
	id: number;
	createdAt: Date;
	email: string;
	username: string;
};
