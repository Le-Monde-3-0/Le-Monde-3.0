import { createContext, useContext } from 'react';

import { User } from 'types/user';
import { Topic } from 'types/topic';
import { Article } from 'types/article';
import { Anthology } from 'types/anthology';
import { Handler } from 'types/handler';
import {
	ArticlesCreate,
	ArticlesDelete,
	EmptyResponse,
	ArticlesLike,
	ArticlesSearchOne,
	ArticlesSearchMany,
	ArticlesUpdate,
	AnthologiesArticles,
	AnthologiesCreate,
	AnthologiesDelete,
	AnthologiesSearchOne,
	AnthologiesSearchMany,
	AnthologiesUpdate,
	TopicsSearchOne,
} from 'types/services';

type UserContextType = {
	// TODO: not clean, data: User would be better (implies a lot of changes (but easy))
	data: {
		user: User;
	};
	methods: {
		user: {
			clear: () => void;
			upload: (user: User) => void;
			toggleIsOfflineState: () => void;
		};
		articles: {
			create: (params: ArticlesCreate) => Promise<Handler<Article>>;
			delete: (params: ArticlesDelete) => Promise<Handler<EmptyResponse>>;
			like: (params: ArticlesLike) => Promise<Handler<EmptyResponse>>;
			load: {
				written: () => Promise<Handler<Article[]>>;
				liked: () => Promise<Handler<Article[]>>;
			};
			search: {
				one: (params: ArticlesSearchOne) => Promise<Handler<Article>>;
				many: (params: ArticlesSearchMany) => Promise<Handler<Article[]>>;
			};
			update: (params: ArticlesUpdate) => Promise<Handler<Article>>;
		};
		anthologies: {
			articles: (params: AnthologiesArticles) => Promise<Handler<Article[]>>;
			create: (params: AnthologiesCreate) => Promise<Handler<Anthology>>;
			delete: (params: AnthologiesDelete) => Promise<Handler<EmptyResponse>>;
			load: () => Promise<Handler<Anthology[]>>;
			search: {
				one: (params: AnthologiesSearchOne) => Promise<Handler<Anthology>>;
				many: (params: AnthologiesSearchMany) => Promise<Handler<Anthology[]>>;
			};
			update: (params: AnthologiesUpdate) => Promise<Handler<Anthology>>;
		};
		topics: {
			search: {
				one: (params: TopicsSearchOne) => Promise<Handler<Topic>>;
				all: () => Promise<Handler<Topic[]>>;
			};
		};
	};
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
