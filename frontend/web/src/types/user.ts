import { Article } from './article';
import { Bookmark } from './bookmark';

export type User = {
	draftArticles: Article[];
	publishedArticles: Article[];
	overallDailyTotalViews: { date: string; daily: number; summed: number }[];
	overallDailyTotalLikes: { date: string; daily: number; summed: number }[];
	likedArticles: Article[];
	bookmarks: Bookmark[];
};
