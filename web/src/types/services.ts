export type ParamsAuthSignUp = { email: string; username: string; password: string };
export type ParamsAuthSignIn = { identifier: string; password: string };

export type ParamsUserUpdatePassword = { oldPassword: string; newPassword: string };

export type ParamsArticlesCreate = {
	title: string;
	subtitle?: string;
	content: string;
	topic: number;
	draft: boolean;
};
export type ParamsArticlesLike = { id: number; isLiked: boolean };
export type ParamsArticlesSearch = {
	author?: string;
	draft?: boolean;
	topic?: number;
	isLiked?: boolean;
	anthologyId?: number;
	query?: string;
};
export type ParamsArticlesUpdate = {
	id: number;
	newTitle?: string;
	newSubtitle?: string;
	newContent?: string;
	newTopic?: number;
	newDraft?: boolean;
};

export type ParamsAnthologiesCreate = {
	name: string;
	description: string;
	isPublic: boolean;
	articles?: number[];
};
export type ParamsAnthologiesSearch = { author?: string; query?: string };
export type ParamsAnthologiesUpdate = {
	id: number;
	addArticles?: number[];
	removeArticles?: number[];
	newName?: string;
	newDescription?: string;
	newIsPublic?: boolean;
};

export type ResponseEmpty = Record<string, never>;
