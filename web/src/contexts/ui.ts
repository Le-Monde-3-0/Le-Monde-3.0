import { createContext, useContext } from 'react';

import { UIHandling } from 'types/handler';
import { Topic } from 'types/topic';
import { Article, OfflineArticle } from 'types/article';
import { Anthology, OfflineAnthology } from 'types/anthology';
import {
	ParamsAnthologiesCreate,
	ParamsAnthologiesSearch,
	ParamsArticlesCreate,
	ParamsArticlesLike,
	ParamsArticlesSearch,
	// ParamsArticlesUpdate,
	ParamsAuthSignIn,
	ParamsAuthSignUp,
	ParamsUserUpdatePassword,
} from 'types/services';

type UIContextType = {
	handleToast: ({ res, settings, messages }: UIHandling) => void;
	online: {
		auth: {
			sign: {
				up: (params: ParamsAuthSignUp, callback: () => void) => Promise<void>;
				in: (params: ParamsAuthSignIn, callback: () => void) => Promise<void>;
				out: (callback: () => void) => Promise<void>;
				again: (callback: () => void) => Promise<void>;
			};
		};
		user: {
			me: () => Promise<void>;
			update: {
				password: (params: ParamsUserUpdatePassword) => Promise<void>;
				email: (newEmail: string) => Promise<void>;
				username: (newUsername: string) => Promise<void>;
			};
		};
		articles: {
			create: (params: ParamsArticlesCreate, callback: (id: number) => void) => Promise<void>;
			search: {
				allPublications: (params: ParamsArticlesSearch, callback: (articles: Article[]) => void) => Promise<void>;
				myArticles: (params: ParamsArticlesSearch, callback: (articles: Article[]) => void) => Promise<void>;
				likedPublications: (params: ParamsArticlesSearch, callback: (articles: Article[]) => void) => Promise<void>;
				oneDraft: (id: number, callback: (article: Article) => void) => Promise<void>;
				onePublication: (id: number, callback: (article: Article) => void) => Promise<void>;
			};
			like: (params: ParamsArticlesLike, callback: (isLiked: boolean) => void) => Promise<void>;
			delete: (id: number, callback: () => void) => Promise<void>;
		};
		anthologies: {
			create: (params: ParamsAnthologiesCreate, callback: () => void) => Promise<void>;
			search: {
				many: (params: ParamsAnthologiesSearch, callback: (anthologies: Anthology[]) => void) => Promise<void>;
				one: (id: number, callback: (anthology: Anthology) => void) => Promise<void>;
			};
			update: (id: number, newName: string, newDescription: string, callback: () => void) => Promise<void>;
			addArticle: (id: number, articleId: number, callback: () => void) => Promise<void>;
			removeArticle: (id: number, articleId: number, callback: () => void) => Promise<void>;
			delete: (id: number, callback: () => void) => Promise<void>;
		};
		topics: {
			search: {
				all: (callback: (topics: Topic[]) => void) => Promise<void>;
			};
		};
	};
	offline: {
		articles: {
			like: (cid: string, isLiked: boolean, callback: (isLiked: boolean) => void) => void;
			search: {
				one: (cid: string, callback: (article: OfflineArticle) => void) => void;
			};
			getContent: (cid: string, callback: (content: string) => void) => Promise<void>;
		};
		anthologies: {
			articles: (id: string, callback: (articles: OfflineArticle[]) => void) => void;
			create: ({
				params: { name, description, cid },
				callback,
			}: {
				params: { name: string; description: string; cid?: string };
				callback: () => void;
			}) => void;
			search: {
				one: (id: string, callback: (anthology: OfflineAnthology) => void) => void;
			};
			addArticle: (id: string, cid: string, callback: () => void) => void;
			removeArticle: (id: string, cid: string, callback: () => void) => void;
			update: (id: string, newName: string, newDescription: string, callback: () => void) => void;
			delete: (id: string, callback: () => void) => void;
		};
	};
};

const UIContext = createContext<UIContextType | undefined>(undefined);

const useUIContext = (): UIContextType => {
	const context = useContext(UIContext);
	if (!context) throw new Error('UIContext used outside of provider.');
	return context;
};

export type { UIContextType };
export { useUIContext };
export default UIContext;
