import { Topic } from './topic';

export type Article = {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	draft: boolean;
	title: string;
	subtitle: string;
	content: string;
	authorId: number;
	viewCounter: number;
	likeCounter: number;
	// TODO: clean this -> topicId or topic for all endpoints ?
	topicId?: number;
	topic?: Topic;
};

// export type ArticleMetaData = {
// 	id: number;
// 	createdAt: Date;
// 	updatedAt: Date;
// 	draft: boolean;
// 	title: string;
// 	authorId: number;
// 	viewCounter: number;
// 	likeCounter: number;
// 	topicId: number;
// };

// export type ArticleInfraData = {
// 	id: number;
// 	subtitle: string;
// 	content: string;
// };
