import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { OfflineUser } from 'types/user';
import { OfflineArticle } from 'types/article';
import { OfflineAnthologyArticle, OfflineCreateAnthology, OfflineUpdateAnthology } from 'types/offline';
import OfflineUserContext, { OfflineUserContextType } from 'contexts/offlineUser';
import loadFromLocalStorage from 'utils/loadFromLocalStorage';

// TODO: clean in different files
// TODO: connect account settings to backend
const OfflineUserProvider = ({ children }: { children: JSX.Element }) => {
	const defaultOfflineUser: OfflineUser = {
		config: {
			gateway: '',
			step: 0,
		},
		articles: {
			liked: [],
		},
		anthologies: [],
	};

	const [offlineUser, setOfflineUser] = useState<OfflineUser>(
		loadFromLocalStorage<OfflineUser>('offlineUser', defaultOfflineUser),
	);

	const [articlesCatalog, setArticlesCatalog] = useState<OfflineArticle[]>([]);

	useEffect(() => {
		const localStorageOfflineUser = localStorage.getItem('offlineUser');
		if (localStorageOfflineUser) setOfflineUser(JSON.parse(localStorageOfflineUser));
	}, []);

	useEffect(() => {
		if (offlineUser) {
			localStorage.setItem('offlineUser', JSON.stringify(offlineUser));
		}
	}, [offlineUser]);

	const OfflineUserContextValue: OfflineUserContextType = {
		data: offlineUser,
		articlesCatalog,
		methods: {
			data: {
				clear: () => {
					localStorage.removeItem('offlineUser');
					setOfflineUser(defaultOfflineUser);
				},
				upload: (newOfflineUser: OfflineUser) =>
					setOfflineUser((u) => ({ ...u, articles: newOfflineUser.articles, anthologies: newOfflineUser.anthologies })),
			},
			config: {
				setGateway: (gateway: string) => setOfflineUser((u) => ({ ...u, config: { ...u.config, gateway } })),
				setStep: (step: number) => setOfflineUser((u) => ({ ...u, config: { ...u.config, step } })),
				testGateway: async () => {
					try {
						const cid = 'QmRHrMFdxqeht72REo9e2YUCVuYxKSgqvViHnb6Z3hhMxm';
						const file = await OfflineUserContextValue.methods.ipfs.get<{ articles: OfflineArticle[] }>(cid);
						console.log(file);
						return file.articles.length > 0;
					} catch (error) {
						console.error(error);
						return false;
					}
				},
			},
			articles: {
				loadCatalog: async () => {
					// TODO: optimise it (sorting) using decentralized cloud functions
					try {
						const cid = 'QmRHrMFdxqeht72REo9e2YUCVuYxKSgqvViHnb6Z3hhMxm';
						const file = await OfflineUserContextValue.methods.ipfs.get<{
							articles: OfflineArticle[];
						}>(cid);
						console.log(file);
						setArticlesCatalog(file.articles);
						return true;
					} catch (error) {
						console.error(error);
						return false;
					}
				},
				like: (cid: string) => {
					const article = articlesCatalog.find((a) => a.cid === cid);
					if (!article) return false;
					if (!offlineUser.articles.liked.find((a) => a.cid === cid)) {
						setOfflineUser((u) => ({
							...u,
							articles: {
								liked: [...u.articles.liked, article],
							},
						}));
					}
					return true;
				},
				unlike: (cid: string) => {
					const article = offlineUser.articles.liked.find((a) => a.cid === cid);
					if (!article) return false;
					setOfflineUser((u) => ({
						...u,
						articles: {
							liked: [...u.articles.liked.filter((a) => a.cid !== cid)],
						},
					}));
					return true;
				},
			},
			anthologies: {
				articles: (id: string) => {
					const anthology = offlineUser.anthologies.find((a) => a.id === id);
					if (!anthology) return undefined;
					return anthology.articles.map((cid) => articlesCatalog.find((a) => a.cid === cid)!);
				},
				create: (params: OfflineCreateAnthology) => {
					setOfflineUser((u) => ({
						...u,
						anthologies: [
							...u.anthologies,
							{
								id: uuidv4(),
								createdAt: new Date(),
								updatedAt: new Date(),
								name: params.name,
								description: params.description,
								articles: params.articles || [],
							},
						],
					}));
					return true;
				},
				update: (params: OfflineUpdateAnthology) => {
					setOfflineUser((u) => ({
						...u,
						anthologies: [
							...u.anthologies.map((a) => {
								if (a.id === params.id) {
									return {
										...a,
										updatedAt: new Date(),
										name: params.newName,
										description: params.newDescription,
									};
								}
								return a;
							}),
						],
					}));
					return true;
				},
				delete: (id: string) => {
					setOfflineUser((u) => ({
						...u,
						anthologies: [...u.anthologies.filter((a) => a.id !== id)],
					}));
					return true;
				},
				addArticle: (params: OfflineAnthologyArticle): boolean => {
					const anthology = offlineUser.anthologies.find((a) => a.id === params.id);
					if (!anthology) return false;
					setOfflineUser((u) => ({
						...u,
						anthologies: [
							...u.anthologies.map((a) => {
								if (a.id === params.id && !a.articles.find((i) => i === params.cid))
									return { ...a, articles: [...a.articles, params.cid] };
								return a;
							}),
						],
					}));
					return true;
				},
				removeArticle: (params: OfflineAnthologyArticle): boolean => {
					const anthology = offlineUser.anthologies.find((a) => a.id === params.id);
					if (!anthology) return false;
					setOfflineUser((u) => ({
						...u,
						anthologies: [
							...u.anthologies.map((a) => {
								if (a.id === params.id) return { ...a, articles: [...a.articles.filter((i) => i !== params.cid)] };
								return a;
							}),
						],
					}));
					return true;
				},
			},
			ipfs: {
				get: async (cid: string) => {
					try {
						console.log(`get IPFS CID: ${cid}`);
						const res = await axios.get(`${offlineUser.config.gateway}/ipfs/${cid}`, { timeout: 50000 });
						console.log(res);
						return res.data;
					} catch (error) {
						throw error;
					}
				},
			},
		},
	};

	return <OfflineUserContext.Provider value={OfflineUserContextValue} children={children} />;
};

export default OfflineUserProvider;
