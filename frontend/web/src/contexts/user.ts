import { createContext, useContext } from 'react';

import { Article } from 'types/article';
import { Bookmark } from 'types/bookmark';
import { RequestResponse } from 'utils/handleRequest';

type UserContextType = {
	//
	// Data stored
	//
	user: {
		offline: boolean; // false: fetch data via backend; true: fetch data via IPFS
		draftArticles: Article[];
		publishedArticles: Article[];
		likedArticles: Article[];
		bookmarks: Bookmark[];
	};

	//
	// Methods to manipulate data stored
	//
	clearUser: () => void;
	toggleOfflineState: () => void;
	setPublishedArticlesData: (publishedArticles: Article[]) => void;
	setDraftArticlesData: (draftArticles: Article[]) => void;
	setLikedArticlesData: (likedArticles: Article[]) => void;
	addPublishedArticleData: (article: Article) => void;
	addArticleData: (article: Article) => void;
	switchArticleDraftStateData: (articleId: number) => void;
	deleteArticleData: (articleId: number) => void;
	likeArticleData: (article: Article) => void;
	unlikeArticleData: (articleId: number) => void;
	setBookmarksData: (bookmarks: Bookmark[]) => void;
	addBookmarkData: (bookmark: Bookmark) => void;
	updateBookmarkData: ({
		bookmarkId,
		title,
		description,
	}: {
		bookmarkId: number;
		title: string;
		description: string;
	}) => void;
	deleteBookmarkData: (bookmarkId: number) => void;
	addArticleToBookmarkData: (bookmarkId: number, articleId: number) => void;

	//
	// Methods to interact with the services
	//
	getPublishedArticles: () => Promise<RequestResponse<Article[]>>;
	getDraftArticles: () => Promise<RequestResponse<Article[]>>;
	getLikedArticles: () => Promise<RequestResponse<Article[]>>;
	getArticle: (articleId: number) => Promise<RequestResponse<Article>>;
	getBookmark: (bookmarkId: number) => Promise<RequestResponse<Bookmark>>;
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
	getBookmarks: () => Promise<RequestResponse<Bookmark[]>>;
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
