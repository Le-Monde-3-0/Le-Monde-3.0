export type Article = {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	draft: boolean;
	title: string;
	subtitle: string;
	content: string;
	authorId: number;
	totalViews: number;
	totalLikes: number;
	topicId: number;
};

// export type ArticleMetaData = {
// 	id: number;
// 	createdAt: Date;
// 	updatedAt: Date;
// 	draft: boolean;
// 	title: string;
// 	authorId: number;
// 	totalViews: number;
// 	totalLikes: number;
// 	topicId: number;
// };

// export type ArticleInfraData = {
// 	id: number;
// 	subtitle: string;
// 	content: string;
// };
