import React, { useEffect, useState } from 'react';

import UserContext, { UserContextType } from 'contexts/user';
import actions from './actions';
import { User } from 'types/user';
import { Article } from 'types/article';
import { Anthology } from 'types/anthology';
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
	TopicsSearchOne,
} from 'types/services';
import loadFromLocalStorage from 'utils/loadFromLocalStorage';

const UserProvider = ({ children }: { children: JSX.Element }) => {
	const defaultUser = {
		isOffline: false,
		articles: {
			written: [],
			liked: [],
		},
		anthologies: [],
		anthologiesArticles: [],
	};

	const [user, setUser] = useState<User>(loadFromLocalStorage<User>('user', defaultUser));

	const data = {
		articles: {
			create: (article: Article) =>
				setUser((u) => ({ ...u, articles: { ...u.articles, written: [...u.articles.written, article] } })),
			delete: (id: number) =>
				setUser((u) => ({
					...u,
					articles: { ...u.articles, written: [...u.articles.written.filter((a) => a.id !== id)] },
				})),
			like: (article: Article, isLiked: boolean) =>
				setUser((u) => ({
					...u,
					articles: {
						...u.articles,
						written: [...u.articles.written.map((a) => (a.id === article.id ? article : a))],
						liked: isLiked ? [...u.articles.liked, article] : [...u.articles.liked.filter((a) => a.id !== article.id)],
					},
					anthologiesArticles: [
						...u.anthologiesArticles.map((a) => ({
							...a,
							articles: a.articles.map((e) => (e.id === article.id ? article : e)),
						})),
					],
				})),
			load: {
				written: (articles: Article[]) =>
					setUser((u) => ({
						...u,
						articles: {
							...u.articles,
							written: articles,
						},
					})),
				liked: (articles: Article[]) =>
					setUser((u) => ({
						...u,
						articles: {
							...u.articles,
							liked: articles,
						},
					})),
			},
			update: (article: Article) =>
				setUser((u) => ({
					...u,
					articles: {
						written: [...u.articles.written.map((a) => (a.id === article.id ? article : a))],
						liked: [...u.articles.written.map((a) => (a.id === article.id ? article : a))],
					},
					anthologiesArticles: [
						...u.anthologiesArticles.map((a) => ({
							...a,
							articles: a.articles.map((e) => (e.id === article.id ? article : e)),
						})),
					],
				})),
		},
		anthologies: {
			articles: (id: number, articles: Article[]) =>
				setUser((u) => ({
					...u,
					anthologiesArticles: [...u.anthologiesArticles.filter((a) => a.id !== id), { id, articles }],
				})),
			create: (anthology: Anthology) =>
				setUser((u) => ({
					...u,
					anthologies: [...u.anthologies, anthology],
					anthologiesArticles: [...u.anthologiesArticles, { id: anthology.id, articles: [] }],
				})),
			delete: (id: number) =>
				setUser((u) => ({
					...u,
					anthologies: [...u.anthologies.filter((a) => a.id !== id)],
					anthologiesArticles: [...u.anthologiesArticles.filter((a) => a.id !== id)],
				})),
			load: (anthologies: Anthology[]) =>
				setUser((u) => ({
					...u,
					anthologies,
					anthologiesArticles: anthologies.map((a) => ({ id: a.id, articles: [] })),
				})),
			// TODO: articles of updated anthology are removed, to change
			update: (anthology: Anthology) =>
				setUser((u) => ({
					...u,
					anthologies: [...u.anthologies.filter((a) => a.id !== anthology.id), anthology],
					anthologiesArticles: [
						...u.anthologiesArticles.filter((a) => a.id !== anthology.id),
						{ id: anthology.id, articles: [] },
					],
				})),
		},
	};

	useEffect(() => {
		const localStorageUser = localStorage.getItem('user');
		if (localStorageUser) setUser(JSON.parse(localStorageUser));
	}, []);

	useEffect(() => {
		if (user) {
			localStorage.setItem('user', JSON.stringify(user));
		}
	}, [user]);

	const userContextValue: UserContextType = {
		data: {
			user,
		},
		methods: {
			user: {
				clear: () => {
					localStorage.removeItem('user');
					setUser(defaultUser);
				},
				upload: (newUser: User) => setUser(newUser),
				toggleIsOfflineState: () => setUser((u) => ({ ...u, isOffline: !u.isOffline })),
			},
			articles: {
				create: (params: ArticlesCreate) =>
					actions.articles.create({ isOffline: user.isOffline, callback: data.articles.create, params }),
				delete: (params: ArticlesDelete) =>
					actions.articles.delete({ isOffline: user.isOffline, callback: data.articles.delete, params }),
				like: (params: ArticlesLike) =>
					actions.articles.like({ isOffline: user.isOffline, callback: data.articles.like, params }),
				load: {
					written: () =>
						actions.articles.load.written({ isOffline: user.isOffline, callback: data.articles.load.written }),
					liked: () => actions.articles.load.liked({ isOffline: user.isOffline, callback: data.articles.load.liked }),
				},
				search: {
					one: (params: ArticlesSearchOne) => actions.articles.search.one({ isOffline: user.isOffline, params }),
					many: (params: ArticlesSearchMany) => actions.articles.search.many({ isOffline: user.isOffline, params }),
				},
				update: (params: ArticlesUpdate) =>
					actions.articles.update({ isOffline: user.isOffline, callback: data.articles.update, params }),
			},
			anthologies: {
				articles: (params: AnthologiesArticles) =>
					actions.anthologies.articles({ isOffline: user.isOffline, callback: data.anthologies.articles, params }),
				create: (params: AnthologiesCreate) =>
					actions.anthologies.create({ isOffline: user.isOffline, callback: data.anthologies.create, params }),
				delete: (params: AnthologiesDelete) =>
					actions.anthologies.delete({ isOffline: user.isOffline, callback: data.anthologies.delete, params }),
				load: () => actions.anthologies.load({ isOffline: user.isOffline, callback: data.anthologies.load }),
				search: {
					one: (params: AnthologiesSearchOne) => actions.anthologies.search.one({ isOffline: user.isOffline, params }),
					many: (params: AnthologiesSearchMany) =>
						actions.anthologies.search.many({ isOffline: user.isOffline, params }),
				},
				update: (params: AnthologiesUpdate) =>
					actions.anthologies.update({ isOffline: user.isOffline, callback: data.anthologies.update, params }),
			},
			topics: {
				search: {
					one: (params: TopicsSearchOne) => actions.topics.search.one({ isOffline: user.isOffline, params }),
					all: () => actions.topics.search.all({ isOffline: user.isOffline }),
				},
			},
		},
	};

	return <UserContext.Provider value={userContextValue} children={children} />;
};

export default UserProvider;
