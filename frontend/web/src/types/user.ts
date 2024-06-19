import { Article } from './article';
import { Anthology } from './anthology';

export type User = {
	isOffline: boolean;
	articles: {
		written: Article[];
		liked: Article[];
	};
	anthologies: Anthology[];
	anthologiesArticles: {
		id: number;
		articles: Article[];
	}[];
};
