export type OfflineCreateAnthology = {
	name: string;
	description: string;
	articles?: string[];
};

export type OfflineUpdateAnthology = {
	id: string;
	newName: string;
	newDescription: string;
};

export type OfflineAnthologyArticle = {
	cid: string;
	id: string;
};
