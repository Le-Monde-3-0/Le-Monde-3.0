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

export type OfflineArticle = {
	cid: string;
	createdAt: Date;
	updatedAt: Date;
	title: string;
	subtitle: string;
	content?: string;
	preview?: string;
	authorId: number;
	// TODO: clean this -> topicId or topic for all endpoints ?
	topicId?: number;
	topic?: Topic;
};
