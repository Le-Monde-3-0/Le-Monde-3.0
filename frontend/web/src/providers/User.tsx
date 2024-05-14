import React, { useEffect, useState } from 'react';

import services from 'services';
import { useAuthContext } from 'contexts/auth';
import { useIpfsContext } from 'contexts/ipfs';
import UserContext, { UserContextType } from 'contexts/user';
import { Article } from 'types/article';
import { Bookmark } from 'types/bookmark';
import { User } from 'types/user';
import handleRequest from 'utils/handleRequest';
import loadFromLocalStorage from 'utils/loadFromLocalStorage';
import { generateDailyStats } from 'utils/generateDailyStats';

const UserProvider = ({ children }: { children: JSX.Element }) => {
	const { auth } = useAuthContext();
	const { ipfs } = useIpfsContext();

	const [user, setUser] = useState<UserContextType['user']>(
		loadFromLocalStorage<UserContextType['user']>('user', {
			draftArticles: [],
			publishedArticles: [],
			likedArticles: [],
			bookmarks: [],
			overallDailyTotalLikes: [],
			overallDailyTotalViews: [],
		}),
	);

	// ─── Articles ────────────────────────────────────────────────────────

	const setArticlesData = (articles: Article[]) => {
		let overallTotalViews = 0;
		for (let i = 0; i < articles.length; i++) {
			overallTotalViews += articles[i].TotalViews;
		}

		let overallTotalLikes = 0;
		for (let i = 0; i < articles.length; i++) {
			overallTotalLikes += articles[i].Likes.length;
		}

		setUser((u) => ({
			...u,
			publishedArticles: articles.filter((a) => !a.Draft),
			draftArticles: articles.filter((a) => a.Draft),
			overallDailyTotalViews: generateDailyStats(overallTotalViews),
			overallDailyTotalLikes: generateDailyStats(overallTotalLikes),
		}));
	};

	const setLikedArticlesData = (likedArticles: Article[]) => setUser((u) => ({ ...u, likedArticles }));

	const addArticleData = (article: Article) => {
		if (article.Draft) {
			setUser((u) => ({ ...u, draftArticles: [...u.draftArticles, article] }));
		} else {
			setUser((u) => ({ ...u, publishedArticles: [...u.publishedArticles, article] }));
		}
	};

	// ─── Drafts ──────────────────────────────────────────────────────────

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

	const removeArticleFromBookmarkData = (bookmarkId: number, articleId: number) =>
		setUser((u) => ({
			...u,
			bookmarks: user.bookmarks.map((b) => {
				if (b.Id === bookmarkId) {
					b.Articles = b.Articles.filter((a) => a !== articleId);
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
				overallDailyTotalLikes: [],
				overallDailyTotalViews: [],
			});
		},

		uploadUser: (newUser: User) => setUser(newUser),

		getArticles: async () => {
			if (auth.offline) {
				throw new Error("Action 'getArticles' not available using IPFS.");
			}
			return handleRequest({
				request: async () => {
					const res = await services.articles.me({ token: auth.accessToken! });
					for (let i = 0; i < res.data.length; i++) {
						res.data[i].TotalViews = Math.floor(Math.random() * 1000);
					}

					let overallTotalViews = 0;
					for (let i = 0; i < res.data.length; i++) {
						overallTotalViews += res.data[i].TotalViews;
					}
					const overallDailyTotalView = generateDailyStats(overallTotalViews);

					let overallTotalLikes = 0;
					for (let i = 0; i < res.data.length; i++) {
						overallTotalLikes += res.data[i].Likes.length;
					}
					const overallDailyTotalLike = generateDailyStats(overallTotalLikes);

					setArticlesData(res.data);
					return res;
				},
				name: 'getArticles',
			});
		},

		getLikedArticles: async () =>
			handleRequest({
				request: auth.offline
					? undefined
					: async () => {
							const res = await services.articles.liked({ token: auth.accessToken! });
							setLikedArticlesData(res.data);
							return res;
					  },
				action: auth.offline ? () => ({ status: 200, data: user.likedArticles }) : undefined,
				name: 'getLikedArticles',
			}),

		getArticle: async (articleId: number) =>
			handleRequest({
				request: auth.offline
					? undefined
					: async () => {
							const res = await services.articles.read({ token: auth.accessToken!, articleId });
							res.data.TotalViews = Math.floor(Math.random() * 1000);
							return res;
					  },
				action: auth.offline
					? () => {
							const article = ipfs.data.articles.find((a) => a.Id === articleId);
							return {
								status: article ? 200 : 404,
								data: article,
							};
					  }
					: undefined,
				name: 'getArticle',
			}),

		getBookmarks: async () =>
			handleRequest({
				request: auth.offline
					? undefined
					: async () => {
							const res = await services.bookmarks.getAll({ token: auth.accessToken! });
							if (res.data === null) {
								setBookmarksData([]);
							} else {
								const bookmarks = res.data.map((b) => (b.Articles === null ? { ...b, Articles: [] } : b));
								setBookmarksData(bookmarks);
							}
							return res;
					  },
				action: auth.offline
					? () => ({
							status: 200,
							data: user.bookmarks,
					  })
					: undefined,
				name: 'getBookmarks',
			}),

		getBookmark: async (bookmarkId: number) =>
			handleRequest({
				request: auth.offline
					? undefined
					: async () => {
							const res = await services.bookmarks.get({ token: auth.accessToken!, bookmarkId });
							return res;
					  },
				action: auth.offline
					? () => {
							const bookmark = user.bookmarks.find((b) => b.Id === bookmarkId);
							return {
								status: bookmark ? 200 : 404,
								data: bookmark,
							};
					  }
					: undefined,
				name: 'getBookmark',
			}),

		getBookmarkArticles: async (bookmarkId: number) =>
			handleRequest({
				request: auth.offline
					? undefined
					: async () => {
							const res = await services.bookmarks.getArticles({ token: auth.accessToken!, bookmarkId });
							return res;
					  },
				action: auth.offline
					? () => {
							const articlesId = user.bookmarks.find((b) => b.Id === bookmarkId)?.Articles;
							if (articlesId === undefined) {
								return {
									status: 404,
									data: undefined,
								};
							}
							const articles = ipfs.data.articles.filter((a) => articlesId.includes(a.Id));
							return {
								status: articles ? 200 : 404,
								data: articles,
							};
					  }
					: undefined,
				name: 'getBookmarkArticles',
			}),

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
				throw new Error("Action 'addArticle' not available using IPFS.");
			}
			return handleRequest({
				request: async () => {
					const res = await services.articles.publish({ token: auth.accessToken!, title, topic, content, draft });
					addArticleData(res.data);
					return res;
				},
				name: 'addArticle',
			});
		},

		switchArticleDraftState: async (articleId: number) => {
			if (auth.offline) {
				throw new Error("Action 'switchArticleDraftState' not available using IPFS.");
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
				name: 'switchArticleDraftState',
			});
		},

		deleteArticle: async (articleId: number) => {
			if (auth.offline) {
				throw new Error("Action 'deleteArticle' not available using IPFS.");
			}
			return handleRequest({
				request: async () => {
					const res = await services.articles.delete({ token: auth.accessToken!, articleId });
					deleteArticleData(articleId);
					return res;
				},
				name: 'deleteArticle',
			});
		},

		// ─── Like Actions ────────────────────────────────────────────

		likeArticle: async (articleId: number) =>
			handleRequest({
				request: auth.offline
					? undefined
					: async () => {
							const res = await services.articles.like({ token: auth.accessToken!, articleId });
							likeArticleData(res.data);
							return res;
					  },
				action: auth.offline
					? () => {
							const article = ipfs.data.articles.find((a) => a.Id === articleId);
							if (article) likeArticleData(article);
							return {
								status: article ? 200 : 400,
								data: article,
							};
					  }
					: undefined,
				name: 'likeArticle',
			}),

		unlikeArticle: async (articleId: number) =>
			handleRequest({
				request: auth.offline
					? undefined
					: async () => {
							const res = await services.articles.unlike({ token: auth.accessToken!, articleId });
							unlikeArticleData(articleId);
							return res;
					  },
				action: auth.offline
					? () => {
							const article = ipfs.data.articles.find((a) => a.Id === articleId);
							if (article) unlikeArticleData(articleId);
							return {
								status: article ? 200 : 400,
								data: article,
							};
					  }
					: undefined,
				name: 'unlikeArticle',
			}),

		// ─── Bookmarks ───────────────────────────────────────────────

		addBookmark: ({ title, description }: { title: string; description: string }) =>
			handleRequest({
				request: auth.offline
					? undefined
					: async () => {
							const res = await services.bookmarks.create({ token: auth.accessToken!, title, description });
							addBookmarkData(res.data);
							return res;
					  },
				action: auth.offline
					? () => {
							const bookmark = {
								Articles: [],
								Description: description,
								Title: title,
								Id: Date.now(),
								UserId: 0, // TODO: replace by user Id when we'll be able to
								CreatedAt: new Date(),
								UpdatedAt: new Date(),
							};
							addBookmarkData(bookmark);
							return {
								status: 201,
								data: bookmark,
							};
					  }
					: undefined,
				name: 'addBookmark',
			}),

		updateBookmark: ({ bookmarkId, title, description }: { bookmarkId: number; title: string; description: string }) =>
			handleRequest({
				request: auth.offline
					? undefined
					: async () => {
							const res = await services.bookmarks.update({ token: auth.accessToken!, bookmarkId, title, description });
							updateBookmarkData({ bookmarkId, title, description });
							return res;
					  },
				action: auth.offline
					? () => {
							const bookmark = user.bookmarks.find((b) => b.Id === bookmarkId);
							if (bookmark) updateBookmarkData({ bookmarkId, title, description });
							return {
								status: bookmark ? 200 : 400,
								data: bookmark,
							};
					  }
					: undefined,
				name: 'updateBookmark',
			}),

		deleteBookmark: (bookmarkId: number) =>
			handleRequest({
				request: auth.offline
					? undefined
					: async () => {
							const res = services.bookmarks.delete({ token: auth.accessToken!, bookmarkId });
							deleteBookmarkData(bookmarkId);
							return res;
					  },
				action: auth.offline
					? () => {
							const bookmark = user.bookmarks.find((b) => b.Id === bookmarkId);
							if (bookmark) deleteBookmarkData(bookmarkId);
							return {
								status: bookmark ? 200 : 400,
								data: undefined,
							};
					  }
					: undefined,
				name: 'deleteBookmark',
			}),

		addArticleToBookmark: async (bookmarkId: number, articleId: number) =>
			handleRequest({
				request: auth.offline
					? undefined
					: async () => {
							const res = await services.bookmarks.addArticle({
								token: auth.accessToken!,
								bookmarkId,
								articleId,
							});
							addArticleToBookmarkData(bookmarkId, articleId);
							return res;
					  },
				action: auth.offline
					? () => {
							const article = ipfs.data.articles.find((a) => a.Id === articleId);
							const bookmark = user.bookmarks.find((b) => b.Id === bookmarkId);
							if (article && bookmark) addArticleToBookmarkData(bookmarkId, articleId);
							return {
								status: article && bookmark ? 200 : 400,
								data: article,
							};
					  }
					: undefined,
				name: 'addArticleToBookmark',
			}),

		removeArticleFromBookmark: async (bookmarkId: number, articleId: number) =>
			handleRequest({
				request: auth.offline
					? undefined
					: async () => {
							const res = await services.bookmarks.removeArticle({ token: auth.accessToken!, bookmarkId, articleId });
							removeArticleFromBookmarkData(bookmarkId, articleId);
							return res;
					  },
				action: auth.offline
					? () => {
							const article = ipfs.data.articles.find((a) => a.Id === articleId);
							const bookmark = user.bookmarks.find((b) => b.Id === bookmarkId);
							if (article && bookmark) removeArticleFromBookmarkData(bookmarkId, articleId);
							return {
								status: article && bookmark ? 200 : 400,
								data: article,
							};
					  }
					: undefined,
				name: 'removeArticleFromBookmark',
			}),
	};

	// ─────────────────────────────────────────────────────────────────────

	return <UserContext.Provider value={userContextValue} children={children} />;
};

export default UserProvider;
