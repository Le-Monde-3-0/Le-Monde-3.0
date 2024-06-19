import React, { useEffect, useState } from 'react';

import services from 'services';
import { useIpfsContext } from 'contexts/ipfs';
import UserContext, { UserContextType } from 'contexts/user';
import { User } from 'types/user';
import { Article } from 'types/article';
import { Anthology } from 'types/anthology';
import handleRequest from 'utils/handleRequest';
import loadFromLocalStorage from 'utils/loadFromLocalStorage';

///
///
///

// const Article = (article: Article): Article => ({
// 	id: article.id,
// 	createdAt: article.createdAt,
// 	updatedAt: article.updatedAt,
// 	draft: article.draft,
// 	title: article.title,
// 	authorId: article.authorId,
// 	totalViews: article.totalViews,
// 	totalLikes: article.totalLikes,
// 	topicId: article.topicId,
// });

const createArticle = async ({
	isOffline,
	callback,
	params,
}: {
	isOffline: boolean;
	callback: (article: Article) => void;
	params: {
		title: string;
		subtitle?: string;
		content: string;
		topic: number;
		draft: boolean;
	};
}) => {
	if (isOffline) {
		throw new Error("Action 'createArticle' is not available using IPFS.");
	}
	return handleRequest({
		request: async () => {
			const res = await services.articles.create({ ...params });
			callback(res.data);
			return res;
		},
		name: 'createArticle',
	});
};

const deleteArticle = async ({
	isOffline,
	callback,
	params,
}: {
	isOffline: boolean;
	callback: (id: number) => void;
	params: { id: number };
}) => {
	if (isOffline) {
		throw new Error("Action 'deleteArticle' is not available using IPFS.");
	}
	return handleRequest({
		request: async () => {
			const res = await services.articles.delete(params.id);
			callback(params.id);
			return res;
		},
		name: 'deleteArticle',
	});
};

const likeArticle = async ({
	isOffline,
	callback,
	params,
}: {
	isOffline: boolean;
	callback: (article: Article, isLiked: boolean) => void;
	params: {
		id: number;
		isLiked: boolean;
	};
}) => {
	if (isOffline) {
		throw new Error("Action 'likeArticle' is not available using IPFS.");
	}
	return handleRequest({
		request: async () => {
			const res = await services.articles.like({ id: params.id, isLiked: params.isLiked });
			const articleRes = await services.articles.searchOne(params.id);
			callback(articleRes.data, params.isLiked);
			return res;
		},
		name: 'likeArticle',
	});
};

const loadWrittenArticles = async ({
	isOffline,
	callback,
}: {
	isOffline: boolean;
	callback: (articles: Article[]) => void;
}) => {
	if (isOffline) {
		throw new Error("Action 'loadWrittenArticles' is not available using IPFS.");
	}
	return handleRequest({
		request: async () => {
			const res = await services.articles.searchMany({ author: 'me' });
			callback(res.data);
			return res;
		},
		name: 'loadWrittenArticles',
	});
};

const loadLikedArticles = async ({
	isOffline,
	callback,
}: {
	isOffline: boolean;
	callback: (articles: Article[]) => void;
}) => {
	if (isOffline) {
		throw new Error("Action 'loadLikedArticles' is not available using IPFS.");
	}
	return handleRequest({
		request: async () => {
			const res = await services.articles.searchMany({ isLiked: true });
			callback(res.data);
			return res;
		},
		name: 'loadLikedArticles',
	});
};

const searchArticles = async ({
	isOffline,
	params,
}: {
	isOffline: boolean;
	params: {
		author?: string;
		draft?: boolean;
		topic?: number;
		isLiked?: boolean;
		anthologyId?: number;
		query?: string;
	};
}) => {
	if (isOffline) {
		throw new Error("Action 'searchArticles' is not available using IPFS.");
	}
	return handleRequest({
		request: async () => {
			const res = await services.articles.searchMany({ ...params });
			return res;
		},
		name: 'searchArticles',
	});
};

const searchArticle = async ({
	isOffline,
	params,
}: {
	isOffline: boolean;
	params: {
		id: number;
	};
}) => {
	if (isOffline) {
		throw new Error("Action 'searchArticle' is not available using IPFS.");
	}
	return handleRequest({
		request: async () => {
			const res = await services.articles.searchOne(params.id);
			return res;
		},
		name: 'searchArticle',
	});
};

const updateArticle = ({
	isOffline,
	callback,
	params,
}: {
	isOffline: boolean;
	callback: (article: Article) => void;
	params: {
		id: number;
		newTitle?: string;
		newSubtitle?: string;
		newContent?: string;
		newTopic?: number;
		newDraft?: boolean;
	};
}) => {
	if (isOffline) {
		throw new Error("Action 'updateArticle' is not available using IPFS.");
	}
	return handleRequest({
		request: async () => {
			const res = await services.articles.update({ ...params });
			callback(res.data);
			return res;
		},
		name: 'updateArticle',
	});
};

const loadAnthologyArticles = async ({
	isOffline,
	callback,
	params,
}: {
	isOffline: boolean;
	callback: (id: number, articles: Article[]) => void;
	params: {
		id: number;
	};
}) => {
	if (isOffline) {
		throw new Error("Action 'loadAnthologyArticles' is not available using IPFS.");
	}
	return handleRequest({
		request: async () => {
			const res = await services.anthologies.getArticles(params.id);
			callback(params.id, res.data);
			return res;
		},
		name: 'loadAnthologyArticles',
	});
};

const createAnthology = async ({
	isOffline,
	callback,
	params,
}: {
	isOffline: boolean;
	callback: (anthology: Anthology) => void;
	params: {
		name: string;
		description: string;
		isPublic: boolean;
		articles?: number[];
	};
}) => {
	if (isOffline) {
		throw new Error("Action 'createAnthology' is not available using IPFS.");
	}
	return handleRequest({
		request: async () => {
			const res = await services.anthologies.create({ ...params });
			callback(res.data);
			return res;
		},
		name: 'createAnthology',
	});
};

const deleteAnthology = async ({
	isOffline,
	callback,
	params,
}: {
	isOffline: boolean;
	callback: (id: number) => void;
	params: {
		id: number;
	};
}) => {
	if (isOffline) {
		throw new Error("Action 'deleteAnthology' is not available using IPFS.");
	}
	return handleRequest({
		request: async () => {
			const res = await services.anthologies.delete(params.id);
			callback(params.id);
			return res;
		},
		name: 'deleteAnthology',
	});
};

const loadAnthologies = async ({
	isOffline,
	callback,
}: {
	isOffline: boolean;
	callback: (anthologies: Anthology[]) => void;
}) => {
	if (isOffline) {
		throw new Error("Action 'loadAnthologies' is not available using IPFS.");
	}
	return handleRequest({
		request: async () => {
			const res = await services.anthologies.searchMany({ author: 'me' });
			callback(res.data);
			return res;
		},
		name: 'loadAnthologies',
	});
};

const searchAnthologies = async ({
	isOffline,
	params,
}: {
	isOffline: boolean;
	params: {
		author?: string;
		query?: string;
	};
}) => {
	if (isOffline) {
		throw new Error("Action 'searchAnthologies' is not available using IPFS.");
	}
	return handleRequest({
		request: async () => {
			const res = await services.anthologies.searchMany({ ...params });
			return res;
		},
		name: 'searchAnthologies',
	});
};

const searchAnthology = async ({
	isOffline,
	params,
}: {
	isOffline: boolean;
	params: {
		id: number;
	};
}) => {
	if (isOffline) {
		throw new Error("Action 'searchAnthology' is not available using IPFS.");
	}
	return handleRequest({
		request: async () => {
			const res = await services.anthologies.searchOne(params.id);
			return res;
		},
		name: 'searchAnthology',
	});
};

const updateAnthology = ({
	isOffline,
	callback,
	params,
}: {
	isOffline: boolean;
	callback: (anthology: Anthology) => void;
	params: {
		id: number;
		addArticles?: number[];
		removeArticles?: number[];
		newName?: string;
		newDescription?: string;
		newIsPublic?: boolean;
	};
}) => {
	if (isOffline) {
		throw new Error("Action 'updateAnthology' is not available using IPFS.");
	}
	return handleRequest({
		request: async () => {
			const res = await services.anthologies.update({ ...params });
			callback(res.data);
			return res;
		},
		name: 'updateAnthology',
	});
};

const searchAllTopics = async ({ isOffline }: { isOffline: boolean }) => {
	if (isOffline) {
		throw new Error("Action 'searchAllTopics' is not available using IPFS.");
	}
	return handleRequest({
		request: async () => {
			const res = await services.topics.searchAll();
			return res;
		},
		name: 'searchAllTopics',
	});
};

const searchTopic = async ({
	isOffline,
	params,
}: {
	isOffline: boolean;
	params: {
		id: number;
	};
}) => {
	if (isOffline) {
		throw new Error("Action 'searchTopic' is not available using IPFS.");
	}
	return handleRequest({
		request: async () => {
			const res = await services.topics.searchOne(params.id);
			return res;
		},
		name: 'searchTopic',
	});
};

///
///
///

const UserProvider = ({ children }: { children: JSX.Element }) => {
	const { ipfs } = useIpfsContext();

	const defaultUser = {
		isOffline: false,
		articles: {
			written: [],
			liked: [],
		},
		anthologies: [],
		anthologiesArticles: [],
	};

	const [user, setUser] = useState<UserContextType['user']>(
		loadFromLocalStorage<UserContextType['user']>('user', defaultUser),
	);

	const createArticleData = (article: Article) =>
		setUser((u) => ({ ...u, articles: { ...u.articles, written: [...u.articles.written, article] } }));
	const deleteArticleData = (id: number) =>
		setUser((u) => ({
			...u,
			articles: { ...u.articles, written: [...u.articles.written.filter((a) => a.id !== id)] },
		}));
	const likeArticleData = (article: Article, isLiked: boolean) =>
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
		}));
	const loadWrittenArticlesData = (articles: Article[]) =>
		setUser((u) => ({
			...u,
			articles: {
				...u.articles,
				written: articles,
			},
		}));
	const loadLikedArticlesData = (articles: Article[]) =>
		setUser((u) => ({
			...u,
			articles: {
				...u.articles,
				liked: articles,
			},
		}));
	const updateArticleData = (article: Article) =>
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
		}));
	const loadAnthologyArticlesData = (id: number, articles: Article[]) =>
		setUser((u) => ({
			...u,
			anthologiesArticles: [...u.anthologiesArticles.filter((a) => a.id !== id), { id, articles }],
		}));
	const createAuthologyData = (anthology: Anthology) =>
		setUser((u) => ({
			...u,
			anthologies: [...u.anthologies, anthology],
			anthologiesArticles: [...u.anthologiesArticles, { id: anthology.id, articles: [] }],
		}));
	const deleteAnthologyData = (id: number) =>
		setUser((u) => ({
			...u,
			anthologies: [...u.anthologies.filter((a) => a.id !== id)],
			anthologiesArticles: [...u.anthologiesArticles.filter((a) => a.id !== id)],
		}));
	const loadAnthologiesData = (anthologies: Anthology[]) =>
		setUser((u) => ({
			...u,
			anthologies,
			anthologiesArticles: anthologies.map((a) => ({ id: a.id, articles: [] })),
		}));
	// TODO: articles of updated anthology are removed, to change
	const updateAnthologyData = (anthology: Anthology) =>
		setUser((u) => ({
			...u,
			anthologies: [...u.anthologies.filter((a) => a.id !== anthology.id), anthology],
			anthologiesArticles: [
				...u.anthologiesArticles.filter((a) => a.id !== anthology.id),
				{ id: anthology.id, articles: [] },
			],
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
			setUser(defaultUser);
		},
		uploadUser: (newUser: User) => setUser(newUser),
		toggleIsOfflineState: () => setUser((u) => ({ ...u, isOffline: !u.isOffline })),

		createArticle: ({
			title,
			subtitle,
			content,
			topic,
			draft,
		}: {
			title: string;
			subtitle?: string;
			content: string;
			topic: number;
			draft: boolean;
		}) =>
			createArticle({
				isOffline: user.isOffline,
				callback: createArticleData,
				params: {
					title,
					subtitle,
					content,
					topic,
					draft,
				},
			}),

		deleteArticle: (id: number) =>
			deleteArticle({
				isOffline: user.isOffline,
				callback: deleteArticleData,
				params: {
					id,
				},
			}),

		likeArticle: ({ id, isLiked }: { id: number; isLiked: boolean }) =>
			likeArticle({
				isOffline: user.isOffline,
				callback: likeArticleData,
				params: {
					id,
					isLiked,
				},
			}),

		loadWrittenArticles: () =>
			loadWrittenArticles({
				isOffline: user.isOffline,
				callback: loadWrittenArticlesData,
			}),

		loadLikedArticles: () =>
			loadLikedArticles({
				isOffline: user.isOffline,
				callback: loadLikedArticlesData,
			}),

		searchArticles: ({
			author,
			draft,
			topic,
			isLiked,
			anthologyId,
			query,
		}: {
			author?: string;
			draft?: boolean;
			topic?: number;
			isLiked?: boolean;
			anthologyId?: number;
			query?: string;
		}) =>
			searchArticles({
				isOffline: user.isOffline,
				params: {
					author,
					draft,
					topic,
					isLiked,
					anthologyId,
					query,
				},
			}),

		searchArticle: (id: number) =>
			searchArticle({
				isOffline: user.isOffline,
				params: {
					id,
				},
			}),

		updateArticle: ({
			id,
			newTitle,
			newSubtitle,
			newContent,
			newTopic,
			newDraft,
		}: {
			id: number;
			newTitle?: string;
			newSubtitle?: string;
			newContent?: string;
			newTopic?: number;
			newDraft?: boolean;
		}) =>
			updateArticle({
				isOffline: user.isOffline,
				callback: updateArticleData,
				params: {
					id,
					newTitle,
					newSubtitle,
					newContent,
					newTopic,
					newDraft,
				},
			}),

		loadAnthologyArticles: (id: number) =>
			loadAnthologyArticles({
				isOffline: user.isOffline,
				callback: loadAnthologyArticlesData,
				params: {
					id,
				},
			}),

		createAnthology: ({
			name,
			description,
			isPublic,
			articles,
		}: {
			name: string;
			description: string;
			isPublic: boolean;
			articles?: number[];
		}) =>
			createAnthology({
				isOffline: user.isOffline,
				callback: createAuthologyData,
				params: {
					name,
					description,
					isPublic,
					articles,
				},
			}),

		deleteAnthology: (id: number) =>
			deleteAnthology({
				isOffline: user.isOffline,
				callback: deleteAnthologyData,
				params: {
					id,
				},
			}),

		loadAnthologies: () =>
			loadAnthologies({
				isOffline: user.isOffline,
				callback: loadAnthologiesData,
			}),

		searchAnthologies: ({ author, query }: { author?: string; query?: string }) =>
			searchAnthologies({
				isOffline: user.isOffline,
				params: {
					author,
					query,
				},
			}),

		searchAnthology: (id: number) =>
			searchAnthology({
				isOffline: user.isOffline,
				params: {
					id,
				},
			}),

		updateAnthology: ({
			id,
			addArticles,
			removeArticles,
			newName,
			newDescription,
			newIsPublic,
		}: {
			id: number;
			addArticles?: number[];
			removeArticles?: number[];
			newName?: string;
			newDescription?: string;
			newIsPublic?: boolean;
		}) =>
			updateAnthology({
				isOffline: user.isOffline,
				callback: updateAnthologyData,
				params: {
					id,
					addArticles,
					removeArticles,
					newName,
					newDescription,
					newIsPublic,
				},
			}),

		searchAllTopics: () =>
			searchAllTopics({
				isOffline: user.isOffline,
			}),

		searchTopic: (id: number) =>
			searchTopic({
				isOffline: user.isOffline,
				params: {
					id,
				},
			}),
	};

	return <UserContext.Provider value={userContextValue} children={children} />;
};

export default UserProvider;
