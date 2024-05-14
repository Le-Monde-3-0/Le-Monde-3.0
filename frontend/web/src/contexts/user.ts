import { createContext, useContext } from 'react';

import { Article } from 'types/article';
import { Bookmark } from 'types/bookmark';
import { User } from 'types/user';
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

	//
	// Methods to interact with the services
	//
	getArticles: () => Promise<RequestResponse<Article[]>>;
	getLikedArticles: () => Promise<RequestResponse<Article[]>>;
	getArticle: (articleId: number) => Promise<RequestResponse<Article>>;
	getBookmarks: () => Promise<RequestResponse<Bookmark[]>>;
	getBookmark: (bookmarkId: number) => Promise<RequestResponse<Bookmark>>;
	getBookmarkArticles: (bookmarkId: number) => Promise<RequestResponse<Article[]>>;
	addArticle: ({
		title,
		topic,
		content,
		draft,
	}: {
		title: string;
		topic: string;
		content: string;
		draft: boolean;
	}) => Promise<RequestResponse<Article>>;
	switchArticleDraftState: (articleId: number) => Promise<RequestResponse<Article>>;
	deleteArticle: (articleId: number) => Promise<RequestResponse<{ delete: string }>>;
	likeArticle: (articleId: number) => Promise<RequestResponse<Article>>;
	unlikeArticle: (articleId: number) => Promise<RequestResponse<Article>>;
	addBookmark: ({ title, description }: { title: string; description: string }) => Promise<RequestResponse<Bookmark>>;
	updateBookmark: ({
		bookmarkId,
		title,
		description,
	}: {
		bookmarkId: number;
		title: string;
		description: string;
	}) => Promise<RequestResponse<Bookmark>>;
	deleteBookmark: (bookmarkId: number) => Promise<RequestResponse<{ delete: string }>>;
	addArticleToBookmark: (bookmarkId: number, articleId: number) => Promise<RequestResponse<Article>>;
	removeArticleFromBookmark: (bookmarkId: number, articleId: number) => Promise<RequestResponse<Article>>;
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
