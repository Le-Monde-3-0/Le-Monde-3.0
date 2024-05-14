export type Article = {
	Id: number;
	UserId: number;
	AuthorName: string;
	Topic: string;
	Title: string;
	Subtitle: string;
	Content: string;
	CreatedAt: Date;
	Draft: boolean;
	Likes: number[];
	TotalViews: number;
	DailyViews: { date: string; daily: number; summed: number }[];
	DailyLikes: { date: string; daily: number; summed: number }[];
};
