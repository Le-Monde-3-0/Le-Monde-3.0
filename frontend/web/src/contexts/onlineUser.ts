import { createContext, useContext } from 'react';

import { OnlineUser } from 'types/user';
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
	AuthSignIn,
	AuthSignUp,
	AuthUpdateEmail,
	AuthUpdatePassword,
	AuthUpdateUsername,
	MeResponse,
	SignResponse,
} from 'types/services';

// TODO: remove useless types
type OnlineUserContextType = {
	data: OnlineUser;
	methods: {
		data: {
			clear: () => void;
		};
		auth: {
			sign: {
				up: (params: AuthSignUp) => Promise<Handler<SignResponse>>;
				in: (params: AuthSignIn) => Promise<Handler<SignResponse>>;
				out: () => Promise<Handler<EmptyResponse>>;
				again: () => Promise<Handler<EmptyResponse>>;
			};
			me: () => Promise<Handler<MeResponse>>;
			update: {
				password: (params: AuthUpdatePassword) => Promise<Handler<EmptyResponse>>;
				email: (params: AuthUpdateEmail) => Promise<Handler<EmptyResponse>>;
				username: (params: AuthUpdateUsername) => Promise<Handler<EmptyResponse>>;
			};
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

const OnlineUserContext = createContext<OnlineUserContextType | undefined>(undefined);

const useOnlineUserContext = (): OnlineUserContextType => {
	const context = useContext(OnlineUserContext);
	if (!context) throw new Error('OnlineUserContext used outside of provider.');
	return context;
};

export type { OnlineUserContextType };
export { useOnlineUserContext };
export default OnlineUserContext;
