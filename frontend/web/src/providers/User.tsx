import React, { useEffect, useState } from 'react';

import { useAuthContext } from 'contexts/auth';
import UserContext, { UserContextType } from 'contexts/user';
import { Article } from 'types/article';
import { Bookmark } from 'types/bookmark';
import handleRequest from 'utils/handleRequest';
import services from 'services';

const UserProvider = ({ children }: { children: JSX.Element }) => {
	const { auth } = useAuthContext();

	const [user, setUser] = useState<UserContextType['user']>({
		offline: false,
		draftArticles: [],
		publishedArticles: [],
		likedArticles: [],
		bookmarks: [],
	});

	useEffect(() => {
		const localStorageUser = localStorage.getItem('user');
		if (localStorageUser) setUser(JSON.parse(localStorageUser));
	}, []);

	useEffect(() => {
		// TODO: verify that this condition is enough
		if (user) {
			localStorage.setItem('user', JSON.stringify(user));
		}
	}, [user]);

	const userContextValue: UserContextType = {
		user,

		clearUser: () => {
			localStorage.removeItem('user');
			setUser({
				offline: false,
				draftArticles: [],
				publishedArticles: [],
				likedArticles: [],
				bookmarks: [],
			});
		},
		toggleOfflineState: () => setUser((u) => ({ ...u, offline: !user.offline })),
		setPublishedArticlesData: (publishedArticles: Article[]) => setUser((u) => ({ ...u, publishedArticles })),
		setDraftArticlesData: (draftArticles: Article[]) => setUser((u) => ({ ...u, draftArticles })),
		setLikedArticlesData: (likedArticles: Article[]) => setUser((u) => ({ ...u, likedArticles })),
		addPublishedArticleData: (article: Article) =>
			setUser((u) => ({ ...u, publishedArticles: [...u.publishedArticles, article] })),
		addArticleData: (article: Article) => {
			if (article.Draft) {
				setUser((u) => ({ ...u, draftArticles: [...u.draftArticles, article] }));
			} else {
				setUser((u) => ({ ...u, publishedArticles: [...u.publishedArticles, article] }));
			}
		},
		switchArticleDraftStateData: (articleId: number) => {
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
		},
		deleteArticleData: (articleId: number) => {
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
		},
		likeArticleData: (article: Article) => setUser((u) => ({ ...u, likedArticles: [...u.likedArticles, article] })),
		unlikeArticleData: (articleId: number) =>
			setUser((u) => ({ ...u, likedArticles: u.likedArticles.filter((a) => a.Id !== articleId) })),
		setBookmarksData: (bookmarks: Bookmark[]) => setUser((u) => ({ ...u, bookmarks })),
		addBookmarkData: (bookmark: Bookmark) => setUser((u) => ({ ...u, bookmarks: [...u.bookmarks, bookmark] })),
		updateBookmarkData({ bookmarkId, title, description }: { bookmarkId: number; title: string; description: string }) {
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
		},
		deleteBookmarkData: (bookmarkId: number) =>
			setUser((u) => ({ ...u, bookmarks: [...u.bookmarks.filter((b) => b.Id !== bookmarkId)] })),
		addArticleToBookmarkData: (bookmarkId: number, articleId: number) =>
			setUser((u) => ({
				...u,
				bookmarks: user.bookmarks.map((b) => {
					if (b.Id === bookmarkId) {
						b.Articles = [...b.Articles, articleId];
					}
					return b;
				}),
			})),

		getPublishedArticles: async () => {
			if (user.offline) {
				throw new Error('getPublishedArticles IPFS TODO');
			}
			return handleRequest({
				request: async () => {
					const res = await services.articles.me({ token: auth.accessToken! });
					// TODO: vérifier qu'il ne faut pas trier "res.data.filter((a) => a.Draft === false"
					userContextValue.setPublishedArticlesData(res.data);
					return res;
				},
				requestName: 'getPublishedArticles',
			});
		},
		getDraftArticles: async () => {
			if (user.offline) {
				throw new Error('getDraftArticles IPFS TODO');
			}
			return handleRequest({
				request: async () => {
					const res = await services.articles.me({ token: auth.accessToken! });
					// TODO: vérifier qu'il ne faut pas trier "res.data.filter((a) => a.Draft === true"
					userContextValue.setDraftArticlesData(res.data);
					return res;
				},
				requestName: 'getDraftArticles',
			});
		},
		getLikedArticles: async () => {
			if (user.offline) {
				throw new Error('getLikedArticles IPFS TODO');
			}
			return handleRequest({
				request: async () => {
					const res = await services.articles.liked({ token: auth.accessToken! });
					userContextValue.setLikedArticlesData(res.data);
					return res;
				},
				requestName: 'getLikedArticles',
			});
		},
		getArticle: async (articleId: number) => {
			if (user.offline) {
				throw new Error('getArticle IPFS TODO');
			}
			return handleRequest({
				request: async () => {
					const res = await services.articles.read({ token: auth.accessToken!, articleId: articleId });
					return res;
				},
				requestName: 'getArticle',
			});
		},
		getBookmark: async (bookmarkId: number) => {
			if (user.offline) {
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
			if (user.offline) {
				throw new Error('addPublishedArticle');
			}
			return handleRequest({
				request: async () => {
					const res = await services.articles.publish({ token: auth.accessToken!, title, topic, content, draft });
					userContextValue.addArticleData(res.data);
					return res;
				},
				requestName: 'addArticle',
			});
		},
		switchArticleDraftState: async (articleId: number) => {
			if (user.offline) {
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
					userContextValue.switchArticleDraftStateData(articleId);
					return res;
				},
				requestName: 'switchArticleDraftState',
			});
		},
		deleteArticle: async (articleId: number) => {
			if (user.offline) {
				throw new Error('deletePublishedArticle IPFS TODO');
			}
			return handleRequest({
				request: async () => {
					const res = await services.articles.delete({ token: auth.accessToken!, articleId });
					userContextValue.deleteArticleData(articleId);
					return res;
				},
				requestName: 'deletePublishedArticle',
			});
		},
		likeArticle: async (articleId: number) => {
			if (user.offline) {
				throw new Error('likeArticles IPFS TODO');
			}
			return handleRequest({
				request: async () => {
					const res = await services.articles.like({ token: auth.accessToken!, articleId });
					userContextValue.likeArticleData(res.data);
					return res;
				},
				requestName: 'likeArticle',
			});
		},
		unlikeArticle: async (articleId: number) => {
			if (user.offline) {
				throw new Error('unlikeArticles IPFS TODO');
			}
			return handleRequest({
				request: async () => {
					const res = await services.articles.unlike({ token: auth.accessToken!, articleId });
					userContextValue.unlikeArticleData(articleId);
					return res;
				},
				requestName: 'unlikeArticle',
			});
		},
		getBookmarks: async () => {
			if (user.offline) {
				throw new Error('getBookmarks IPFS TODO');
			}
			return handleRequest({
				request: async () => {
					const res = await services.bookmarks.getAll({ token: auth.accessToken! });
					userContextValue.setBookmarksData(res.data);
					return res;
				},
				requestName: 'getBookmarks',
			});
		},
		addBookmark: ({ title, description }: { title: string; description: string }) => {
			if (user.offline) {
				throw new Error('addBookmark IPFS TODO');
			}
			return handleRequest({
				request: async () => {
					const res = await services.bookmarks.create({ token: auth.accessToken!, title, description });
					userContextValue.addBookmarkData(res.data);
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
			if (user.offline) {
				throw new Error('updateBookmark IPFS TODO');
			}
			return handleRequest({
				request: async () => {
					const res = await services.bookmarks.update({ token: auth.accessToken!, bookmarkId, title, description });
					userContextValue.updateBookmarkData({ bookmarkId, title, description });
					return res;
				},
				requestName: 'updateBookmark',
			});
		},
		deleteBookmark: (bookmarkId: number) => {
			if (user.offline) {
				throw new Error('deleteBookmark IPFS TODO');
			}
			return handleRequest({
				request: async () => {
					const res = services.bookmarks.delete({ token: auth.accessToken!, bookmarkId });
					userContextValue.deleteBookmarkData(bookmarkId);
					return res;
				},
				requestName: 'deleteBookmark',
			});
		},
		addArticleToBookmark: async (bookmarkId: number, articleId: number) => {
			if (user.offline) {
				throw new Error('addArticleToBookmark IPFS TODO');
			}
			return handleRequest({
				request: async () => {
					const res = await services.bookmarks.addArticle({
						token: auth.accessToken!,
						bookmarkId,
						articleId,
					});
					userContextValue.addArticleToBookmarkData(bookmarkId, articleId);
					return res;
				},
				requestName: 'addArticleToBookmark',
			});
		},
	};

	return <UserContext.Provider value={userContextValue} children={children} />;
};

export default UserProvider;
