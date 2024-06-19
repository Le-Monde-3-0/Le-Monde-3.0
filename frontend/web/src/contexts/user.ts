import { createContext, useContext } from 'react';

import { User } from 'types/user';
import { Topic } from 'types/topic';
import { Article } from 'types/article';
import { Anthology } from 'types/anthology';
import { EmptyType } from 'types/services';
import { RequestResponse } from 'utils/handleRequest';

type UserContextType = {
	//
	// Data stored
	//
	user: User;

	//
	// Methods to manipulate data stored
	//
	clearUser: () => void;
	uploadUser: (user: User) => void;
	toggleIsOfflineState: () => void;

	//
	// Methods to interact with the services
	//

	// Articles
	createArticle: ({
		title,
		subtitle,
		content,
		topic,
		draft,
	}: {
		title: string;
		subtitle?: string;
		content: string;
		topic: number;
		draft: boolean;
	}) => Promise<RequestResponse<Article>>;
	deleteArticle: (id: number) => Promise<RequestResponse<EmptyType>>;
	likeArticle: ({ id, isLiked }: { id: number; isLiked: boolean }) => Promise<RequestResponse<EmptyType>>;
	loadWrittenArticles: () => Promise<RequestResponse<Article[]>>;
	loadLikedArticles: () => Promise<RequestResponse<Article[]>>;
	searchArticles: ({
		author,
		draft,
		topic,
		isLiked,
		anthologyId,
		query,
	}: {
		author?: string;
		draft?: boolean;
		topic?: number;
		isLiked?: boolean;
		anthologyId?: number;
		query?: string;
	}) => Promise<RequestResponse<Article[]>>;
	searchArticle: (id: number) => Promise<RequestResponse<Article>>;
	updateArticle: ({
		id,
		newTitle,
		newSubtitle,
		newContent,
		newTopic,
		newDraft,
	}: {
		id: number;
		newTitle?: string;
		newSubtitle?: string;
		newContent?: string;
		newTopic?: number;
		newDraft?: boolean;
	}) => Promise<RequestResponse<Article>>;

	// Anthologies
	loadAnthologyArticles: (id: number) => Promise<RequestResponse<Article[]>>;
	createAnthology: ({
		name,
		description,
		isPublic,
		articles,
	}: {
		name: string;
		description: string;
		isPublic: boolean;
		articles?: number[];
	}) => Promise<RequestResponse<Anthology>>;
	deleteAnthology: (id: number) => Promise<RequestResponse<EmptyType>>;
	loadAnthologies: () => Promise<RequestResponse<Anthology[]>>;
	searchAnthologies: ({ author, query }: { author?: string; query?: string }) => Promise<RequestResponse<Anthology[]>>;
	searchAnthology: (id: number) => Promise<RequestResponse<Anthology>>;
	updateAnthology: ({
		id,
		addArticles,
		removeArticles,
		newName,
		newDescription,
		newIsPublic,
	}: {
		id: number;
		addArticles?: number[];
		removeArticles?: number[];
		newName?: string;
		newDescription?: string;
		newIsPublic?: boolean;
	}) => Promise<RequestResponse<Anthology>>;

	// Topics
	searchAllTopics: () => Promise<RequestResponse<Topic[]>>;
	searchTopic: (id: number) => Promise<RequestResponse<Topic>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const useUserContext = (): UserContextType => {
	const context = useContext(UserContext);
	if (!context) throw new Error('Context used outside of provider.');
	return context;
};

export type { UserContextType };
export { useUserContext };
export default UserContext;
