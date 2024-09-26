import { OfflineArticle } from './article';
import { OfflineAnthology } from './anthology';

export type User = {
	isOffline: boolean;
};

export type OnlineUser = {
	id: number;
	createdAt: Date;
	username: string;
	email: string;
};

export type OfflineUser = {
	config: {
		gateway: string;
		step: number;
	};
	articles: {
		liked: OfflineArticle[];
	};
	anthologies: OfflineAnthology[];
};
