import React, { useEffect, useState } from 'react';

import OnlineUserContext, { OnlineUserContextType } from 'contexts/onlineUser';
import { OnlineUser } from 'types/user';
import {
	AnthologiesArticles,
	AnthologiesCreate,
	AnthologiesDelete,
	AnthologiesSearchMany,
	AnthologiesSearchOne,
	AnthologiesUpdate,
	ArticlesCreate,
	ArticlesDelete,
	ArticlesLike,
	ArticlesSearchMany,
	ArticlesSearchOne,
	ArticlesUpdate,
	AuthUpdateEmail,
	AuthUpdateUsername,
	TopicsSearchOne,
} from 'types/services';
import loadFromLocalStorage from 'utils/loadFromLocalStorage';
import actions from './actions';

const UserProvider = ({ children }: { children: JSX.Element }) => {
	const defaultOnlineUser: OnlineUser = {
		id: 0,
		createdAt: new Date(),
		email: '',
		username: '',
	};

	const [onlineUser, setOnlineUser] = useState<OnlineUser>(
		loadFromLocalStorage<OnlineUser>('onlineUser', defaultOnlineUser),
	);

	const data = {
		updateAll: (newData: OnlineUser) => setOnlineUser(newData),
		updateEmail: (newEmail: string) => setOnlineUser((u) => ({ ...u, email: newEmail })),
		updateUsername: (newUsername: string) => setOnlineUser((u) => ({ ...u, username: newUsername })),
	};

	useEffect(() => {
		const localStorageOnlineUser = localStorage.getItem('onlineUser');
		if (localStorageOnlineUser) setOnlineUser(JSON.parse(localStorageOnlineUser));
	}, []);

	useEffect(() => {
		if (onlineUser) {
			localStorage.setItem('onlineUser', JSON.stringify(onlineUser));
		}
	}, [onlineUser]);

	const OnlineuserContextValue: OnlineUserContextType = {
		data: onlineUser,
		methods: {
			data: {
				clear: () => {
					localStorage.removeItem('user');
					setOnlineUser(defaultOnlineUser);
				},
			},
			auth: {
				sign: {
					up: actions.auth.sign.up,
					in: actions.auth.sign.in,
					out: actions.auth.sign.out,
					again: actions.auth.sign.again,
				},
				me: () => actions.auth.me({ callback: data.updateAll }),
				update: {
					password: actions.auth.update.password,
					email: (params: AuthUpdateEmail) => actions.auth.update.email({ callback: data.updateEmail, params }),
					username: (params: AuthUpdateUsername) =>
						actions.auth.update.username({ callback: data.updateUsername, params }),
				},
			},
			articles: {
				create: (params: ArticlesCreate) => actions.articles.create(params),
				delete: (params: ArticlesDelete) => actions.articles.delete(params),
				like: (params: ArticlesLike) => actions.articles.like(params),
				load: {
					written: () => actions.articles.load.written(),
					liked: () => actions.articles.load.liked(),
				},
				search: {
					one: (params: ArticlesSearchOne) => actions.articles.search.one(params),
					many: (params: ArticlesSearchMany) => actions.articles.search.many(params),
				},
				update: (params: ArticlesUpdate) => actions.articles.update(params),
			},
			anthologies: {
				articles: (params: AnthologiesArticles) => actions.anthologies.articles(params),
				create: (params: AnthologiesCreate) => actions.anthologies.create(params),
				delete: (params: AnthologiesDelete) => actions.anthologies.delete(params),
				load: () => actions.anthologies.load(),
				search: {
					one: (params: AnthologiesSearchOne) => actions.anthologies.search.one(params),
					many: (params: AnthologiesSearchMany) => actions.anthologies.search.many(params),
				},
				update: (params: AnthologiesUpdate) => actions.anthologies.update(params),
			},
			topics: {
				search: {
					one: (params: TopicsSearchOne) => actions.topics.search.one(params),
					all: () => actions.topics.search.all(),
				},
			},
		},
	};

	return <OnlineUserContext.Provider value={OnlineuserContextValue} children={children} />;
};

export default UserProvider;
