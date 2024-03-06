import React, { useEffect, useState } from 'react';

import { useAuthContext } from 'contexts/auth';
import UserContext, { UserContextType } from 'contexts/user';
import { Article } from 'types/article';
import { Bookmark } from 'types/bookmark';
import handleRequest from 'utils/handleRequest';
import services from 'services';
import loadFromLocalStorage from 'utils/loadFromLocalStorage';

const UserProvider = ({ children }: { children: JSX.Element }) => {
	const { auth } = useAuthContext();

	const [user, setUser] = useState<UserContextType['user']>(
		loadFromLocalStorage<UserContextType['user']>('user', {
			draftArticles: [],
			publishedArticles: [],
			likedArticles: [],
			bookmarks: [],
		}),
	);

	const setArticlesData = (articles: Article[]) =>
		setUser((u) => ({
			...u,
			publishedArticles: articles.filter((a) => !a.Draft),
			draftArticles: articles.filter((a) => a.Draft),
		}));
	const setLikedArticlesData = (likedArticles: Article[]) => setUser((u) => ({ ...u, likedArticles }));
	const addArticleData = (article: Article) => {
		if (article.Draft) {
			setUser((u) => ({ ...u, draftArticles: [...u.draftArticles, article] }));
		} else {
			setUser((u) => ({ ...u, publishedArticles: [...u.publishedArticles, article] }));
		}
	};
	const switchArticleDraftStateData = (articleId: number) => {
		const draftArticle = user.draftArticles.find((a) => a.Id === articleId);
		const publishedArticle = user.publishedArticles.find((a) => a.Id === articleId);
		if (draftArticle) {
			setUser((u) => ({
				...u,
				draftArticles: [...u.draftArticles.filter((a) => a.Id !== articleId)],
				publishedArticles: [...u.publishedArticles, draftArticle],
			}));
		}
		if (publishedArticle) {
			setUser((u) => ({
				...u,
				draftArticles: [...u.draftArticles, publishedArticle],
				publishedArticles: [...u.publishedArticles.filter((a) => a.Id !== articleId)],
			}));
		}
	};
	const deleteArticleData = (articleId: number) => {
		const draftArticle = user.draftArticles.find((a) => a.Id === articleId);
		const publishedArticle = user.publishedArticles.find((a) => a.Id === articleId);
		if (draftArticle) {
			setUser((u) => ({
				...u,
				draftArticles: [...u.draftArticles.filter((a) => a.Id !== articleId)],
			}));
		}
		if (publishedArticle) {
			setUser((u) => ({
				...u,
				publishedArticles: [...u.publishedArticles.filter((a) => a.Id !== articleId)],
			}));
		}
	};
	const likeArticleData = (article: Article) =>
		setUser((u) => ({ ...u, likedArticles: [...u.likedArticles, article] }));
	const unlikeArticleData = (articleId: number) =>
		setUser((u) => ({ ...u, likedArticles: u.likedArticles.filter((a) => a.Id !== articleId) }));
	const setBookmarksData = (bookmarks: Bookmark[]) => setUser((u) => ({ ...u, bookmarks }));
	const addBookmarkData = (bookmark: Bookmark) => setUser((u) => ({ ...u, bookmarks: [...u.bookmarks, bookmark] }));
	const updateBookmarkData = ({
		bookmarkId,
		title,
		description,
	}: {
		bookmarkId: number;
		title: string;
		description: string;
	}) => {
		setUser((u) => ({
			...u,
			bookmarks: [
				...u.bookmarks.map((b) => {
					if (b.Id === bookmarkId) {
						b.Title = title;
						b.Description = description;
					}
					return b;
				}),
			],
		}));
	};
	const deleteBookmarkData = (bookmarkId: number) =>
		setUser((u) => ({ ...u, bookmarks: [...u.bookmarks.filter((b) => b.Id !== bookmarkId)] }));
	const addArticleToBookmarkData = (bookmarkId: number, articleId: number) =>
		setUser((u) => ({
			...u,
			bookmarks: user.bookmarks.map((b) => {
				if (b.Id === bookmarkId) {
					b.Articles = [...b.Articles, articleId];
				}
				return b;
			}),
		}));

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
		user,

		clearUser: () => {
			localStorage.removeItem('user');
			setUser({
				draftArticles: [],
				publishedArticles: [],
				likedArticles: [],
				bookmarks: [],
			});
		},

		getArticles: async () => {
			if (auth.offline) {
				throw new Error('Action not available using IPFS.');
			}
			return handleRequest({
				request: async () => {
					const res = await services.articles.me({ token: auth.accessToken! });
					setArticlesData(res.data);
					return res;
				},
				requestName: 'getArticles',
			});
		},
		getLikedArticles: async () => {
			if (auth.offline) {
				throw new Error('getLikedArticles IPFS TODO');
			}
			return handleRequest({
				request: async () => {
					const res = await services.articles.liked({ token: auth.accessToken! });
					setLikedArticlesData(res.data);
					return res;
				},
				requestName: 'getLikedArticles',
			});
		},
		getArticle: async (articleId: number) => {
			if (auth.offline) {
				throw new Error('');
			}
			return handleRequest({
				request: async () => {
					const res = await services.articles.read({ token: auth.accessToken!, articleId: articleId });
					return res;
				},
				requestName: 'getArticle',
			});
		},
		getBookmarks: async () => {
			if (auth.offline) {
				throw new Error('getBookmarks IPFS TODO');
			}
			return handleRequest({
				request: async () => {
					const res = await services.bookmarks.getAll({ token: auth.accessToken! });
					setBookmarksData(res.data);
					return res;
				},
				requestName: 'getBookmarks',
			});
		},
		getBookmark: async (bookmarkId: number) => {
			if (auth.offline) {
				throw new Error('getBookmark IPFS TODO');
			}
			return handleRequest({
				request: async () => {
					const res = await services.bookmarks.get({ token: auth.accessToken!, bookmarkId: bookmarkId });
					return res;
				},
				requestName: 'getBookmark',
			});
		},
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
		}) => {
			if (auth.offline) {
				throw new Error('addPublishedArticle');
			}
			return handleRequest({
				request: async () => {
					const res = await services.articles.publish({ token: auth.accessToken!, title, topic, content, draft });
					addArticleData(res.data);
					return res;
				},
				requestName: 'addArticle',
			});
		},
		switchArticleDraftState: async (articleId: number) => {
			if (auth.offline) {
				throw new Error('switchArticleDraftState IPFS TODO');
			}
			return handleRequest({
				request: async () => {
					const currentDraftState = user.draftArticles.some((a) => a.Id === articleId);
					const res = await services.articles.changeDraftState({
						token: auth.accessToken!,
						articleId,
						state: !currentDraftState,
					});
					switchArticleDraftStateData(articleId);
					return res;
				},
				requestName: 'switchArticleDraftState',
			});
		},
		deleteArticle: async (articleId: number) => {
			if (auth.offline) {
				throw new Error('deletePublishedArticle IPFS TODO');
			}
			return handleRequest({
				request: async () => {
					const res = await services.articles.delete({ token: auth.accessToken!, articleId });
					deleteArticleData(articleId);
					return res;
				},
				requestName: 'deleteArticle',
			});
		},
		likeArticle: async (articleId: number) => {
			if (auth.offline) {
				throw new Error('likeArticles IPFS TODO');
			}
			return handleRequest({
				request: async () => {
					const res = await services.articles.like({ token: auth.accessToken!, articleId });
					likeArticleData(res.data);
					return res;
				},
				requestName: 'likeArticle',
			});
		},
		unlikeArticle: async (articleId: number) => {
			if (auth.offline) {
				throw new Error('unlikeArticles IPFS TODO');
			}
			return handleRequest({
				request: async () => {
					const res = await services.articles.unlike({ token: auth.accessToken!, articleId });
					unlikeArticleData(articleId);
					return res;
				},
				requestName: 'unlikeArticle',
			});
		},
		addBookmark: ({ title, description }: { title: string; description: string }) => {
			if (auth.offline) {
				throw new Error('addBookmark IPFS TODO');
			}
			return handleRequest({
				request: async () => {
					const res = await services.bookmarks.create({ token: auth.accessToken!, title, description });
					addBookmarkData(res.data);
					return res;
				},
				requestName: 'addBookmark',
			});
		},
		updateBookmark: ({
			bookmarkId,
			title,
			description,
		}: {
			bookmarkId: number;
			title: string;
			description: string;
		}) => {
			if (auth.offline) {
				throw new Error('updateBookmark IPFS TODO');
			}
			return handleRequest({
				request: async () => {
					const res = await services.bookmarks.update({ token: auth.accessToken!, bookmarkId, title, description });
					updateBookmarkData({ bookmarkId, title, description });
					return res;
				},
				requestName: 'updateBookmark',
			});
		},
		deleteBookmark: (bookmarkId: number) => {
			if (auth.offline) {
				throw new Error('deleteBookmark IPFS TODO');
			}
			return handleRequest({
				request: async () => {
					const res = services.bookmarks.delete({ token: auth.accessToken!, bookmarkId });
					deleteBookmarkData(bookmarkId);
					return res;
				},
				requestName: 'deleteBookmark',
			});
		},
		addArticleToBookmark: async (bookmarkId: number, articleId: number) => {
			if (auth.offline) {
				throw new Error('addArticleToBookmark IPFS TODO');
			}
			return handleRequest({
				request: async () => {
					const res = await services.bookmarks.addArticle({
						token: auth.accessToken!,
						bookmarkId,
						articleId,
					});
					addArticleToBookmarkData(bookmarkId, articleId);
					return res;
				},
				requestName: 'addArticleToBookmark',
			});
		},
	};

	return <UserContext.Provider value={userContextValue} children={children} />;
};

export default UserProvider;
