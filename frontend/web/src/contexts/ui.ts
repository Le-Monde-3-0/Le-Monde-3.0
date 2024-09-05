import { createContext, useContext } from 'react';

import { Handler } from 'types/handler';
import { Article, OfflineArticle } from 'types/article';
import { Anthology, OfflineAnthology } from 'types/anthology';

// TODO: verify what must be async and what must not be async
type UIContextType = {
	handleToast: (
		res: Handler<unknown>,
		showIfSuccess?: boolean,
		showIfNotSuccess?: boolean,
		showIfAuthError?: boolean,
		overrideMessage?: string,
	) => void;
	online: {
		articles: {
			like: (id: number, isLiked: boolean, callback: (isLiked: boolean) => Promise<void>) => Promise<void>;
			load: {
				liked: (callback: (articles: Article[]) => void) => Promise<void>;
			};
			search: {
				one: (id: number, callback: (article: Article) => void) => Promise<void>;
			};
		};
		anthologies: {
			articles: (id: number, callback: (articles: Article[]) => void) => Promise<void>;
			create: ({
				params: { name, description, articleId },
				callback,
			}: {
				params: { name: string; description: string; articleId?: number };
				callback: () => Promise<void>;
			}) => Promise<void>;
			delete: (id: number, callback: () => Promise<void>) => Promise<void>;
			load: (callback: (anthologies: Anthology[]) => void) => Promise<void>;
			search: {
				one: (id: number, callback: (anthology: Anthology) => void) => Promise<void>;
			};
			addArticle: (id: number, articleId: number, callback: () => Promise<void>) => Promise<void>;
			removeArticle: (id: number, articleId: number, callback: () => Promise<void>) => Promise<void>;
			update: (id: number, newName: string, newDescription: string, callback: () => Promise<void>) => Promise<void>;
		};
	};
	offline: {
		articles: {
			like: (cid: string, isLiked: boolean, callback?: (isLiked: boolean) => void) => Promise<void>;
			search: {
				one: (cid: string, callback: (article: OfflineArticle) => void) => Promise<void>;
			};
			getContent: (cid: string, callback: (content: string) => void) => Promise<void>;
		};
		anthologies: {
			articles: (id: string, callback: (articles: OfflineArticle[]) => void) => Promise<void>;
			create: ({
				params: { name, description, cid },
				callback,
			}: {
				params: { name: string; description: string; cid?: string };
				callback: () => void;
			}) => Promise<void>;
			delete: (id: string) => Promise<void>;
			search: {
				one: (id: string, callback: (anthology: OfflineAnthology) => void) => Promise<void>;
			};
			addArticle: (id: string, cid: string, callback: () => void) => Promise<void>;
			removeArticle: (id: string, cid: string, callback: () => Promise<void>) => Promise<void>;
			update: (id: string, newName: string, newDescription: string, callback: () => void) => Promise<void>;
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
