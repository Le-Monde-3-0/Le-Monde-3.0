export type Article = {
	AuthorName: string;
	Content: string;
	CreatedAt: Date;
	Draft: boolean;
	Id: number;
	Likes: number[];
	Subtitle: string;
	Title: string;
	Topic: string;
	UserId: number;
};
