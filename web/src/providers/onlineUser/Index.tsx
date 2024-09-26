import React, { useEffect, useState } from 'react';

import { OnlineUser } from 'types/user';
import {
	ParamsAnthologiesCreate,
	ParamsAnthologiesSearch,
	ParamsAnthologiesUpdate,
	ParamsArticlesCreate,
	ParamsArticlesLike,
	ParamsArticlesSearch,
	ParamsArticlesUpdate,
	ParamsUserUpdatePassword,
} from 'types/services';
import OnlineUserContext, { OnlineUserContextType } from 'contexts/onlineUser';
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
			auth: {
				sign: {
					up: actions.auth.sign.up,
					in: actions.auth.sign.in,
					out: () =>
						actions.auth.sign.out(() => {
							localStorage.removeItem('user');
							setOnlineUser(defaultOnlineUser);
						}),
					again: actions.auth.sign.again,
				},
			},
			user: {
				me: () => actions.user.me(data.updateAll),
				update: {
					password: (params: ParamsUserUpdatePassword) => actions.user.update.password(params),
					email: (newEmail: string) => actions.user.update.email({ newEmail, callback: data.updateEmail }),
					username: (newUsername: string) =>
						actions.user.update.username({ newUsername, callback: data.updateUsername }),
				},
			},
			articles: {
				create: (params: ParamsArticlesCreate) => actions.articles.create(params),
				search: {
					allPublications: (params: ParamsArticlesSearch) => actions.articles.search.allPublications(params),
					myArticles: (params: ParamsArticlesSearch) => actions.articles.search.myArticles(params),
					likedPublications: (params: ParamsArticlesSearch) => actions.articles.search.likedPublications(params),
					oneDraft: (id: number) => actions.articles.search.oneDraft(id),
					onePublication: (id: number) => actions.articles.search.onePublication(id),
				},
				update: (params: ParamsArticlesUpdate) => actions.articles.update(params),
				like: (params: ParamsArticlesLike) => actions.articles.like(params),
				delete: (id: number) => actions.articles.delete(id),
			},
			anthologies: {
				create: (params: ParamsAnthologiesCreate) => actions.anthologies.create(params),
				search: {
					many: (params: ParamsAnthologiesSearch) => actions.anthologies.search.many(params),
					one: (id: number) => actions.anthologies.search.one(id),
				},
				update: (params: ParamsAnthologiesUpdate) => actions.anthologies.update(params),
				delete: (id: number) => actions.anthologies.delete(id),
			},
			topics: {
				search: {
					all: () => actions.topics.search.all(),
				},
			},
		},
	};

	return <OnlineUserContext.Provider value={OnlineuserContextValue} children={children} />;
};

export default UserProvider;
