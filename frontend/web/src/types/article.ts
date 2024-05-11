export type Article = {
	AuthorName: string;
	Content: string;
	CreatedAt: Date;
	Draft: boolean;
	Id: number;
	Likes: number[];
	TotalViews: number;
	DailyViews: { date: string; daily: number; summed: number }[];
	DailyLikes: { date: string; daily: number; summed: number }[];
	Subtitle: string;
	Title: string;
	Topic: string;
	UserId: number;
};
