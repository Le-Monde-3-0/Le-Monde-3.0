import { Article } from './article';
import { Bookmark } from './bookmark';
import { Stats } from './stats';

export type User = {
	draftArticles: Article[];
	publishedArticles: Article[];
	stats: Stats;
	// overallDailyTotalViews: { date: string; daily: number; summed: number }[];
	// overallDailyTotalLikes: { date: string; daily: number; summed: number }[];
	likedArticles: Article[];
	bookmarks: Bookmark[];
};
