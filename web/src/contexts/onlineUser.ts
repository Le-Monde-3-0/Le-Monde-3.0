import { createContext, useContext } from 'react';

import { OnlineUser } from 'types/user';
import { Topic } from 'types/topic';
import { Article } from 'types/article';
import { Anthology } from 'types/anthology';
import { Handler } from 'types/handler';
import {
	ParamsAnthologiesCreate,
	ParamsAnthologiesSearch,
	ParamsAnthologiesUpdate,
	ParamsArticlesCreate,
	ParamsArticlesLike,
	ParamsArticlesSearch,
	ParamsArticlesUpdate,
	ParamsAuthSignIn,
	ParamsAuthSignUp,
	ParamsUserUpdatePassword,
	ResponseEmpty,
} from 'types/services';

type OnlineUserContextType = {
	data: OnlineUser;
	methods: {
		auth: {
			sign: {
				up: (params: ParamsAuthSignUp) => Promise<Handler<OnlineUser>>;
				in: (params: ParamsAuthSignIn) => Promise<Handler<OnlineUser>>;
				out: () => Promise<Handler<ResponseEmpty>>;
				again: () => Promise<Handler<ResponseEmpty>>;
			};
		};
		user: {
			me: () => Promise<Handler<OnlineUser>>;
			update: {
				password: (params: ParamsUserUpdatePassword) => Promise<Handler<ResponseEmpty>>;
				email: (newEmail: string) => Promise<Handler<ResponseEmpty>>;
				username: (newUsername: string) => Promise<Handler<ResponseEmpty>>;
			};
		};
		articles: {
			create: (params: ParamsArticlesCreate) => Promise<Handler<Article>>;
			search: {
				allPublications: (params: ParamsArticlesSearch) => Promise<Handler<Article[]>>;
				myArticles: (params: ParamsArticlesSearch) => Promise<Handler<Article[]>>;
				likedPublications: (params: ParamsArticlesSearch) => Promise<Handler<Article[]>>;
				oneDraft: (id: number) => Promise<Handler<Article>>;
				onePublication: (id: number) => Promise<Handler<Article>>;
			};
			update: (params: ParamsArticlesUpdate) => Promise<Handler<Article>>;
			like: (params: ParamsArticlesLike) => Promise<Handler<ResponseEmpty>>;
			delete: (id: number) => Promise<Handler<ResponseEmpty>>;
		};
		anthologies: {
			create: (params: ParamsAnthologiesCreate) => Promise<Handler<Anthology>>;
			search: {
				many: (params: ParamsAnthologiesSearch) => Promise<Handler<Anthology[]>>;
				one: (id: number) => Promise<Handler<Anthology>>;
			};
			update: (params: ParamsAnthologiesUpdate) => Promise<Handler<Anthology>>;
			delete: (id: number) => Promise<Handler<ResponseEmpty>>;
		};
		topics: {
			search: {
				all: () => Promise<Handler<Topic[]>>;
			};
		};
	};
};

const OnlineUserContext = createContext<OnlineUserContextType | undefined>(undefined);

const useOnlineUserContext = (): OnlineUserContextType => {
	const context = useContext(OnlineUserContext);
	if (!context) throw new Error('OnlineUserContext used outside of provider.');
	return context;
};

export type { OnlineUserContextType };
export { useOnlineUserContext };
export default OnlineUserContext;
