import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

import UIContext, { UIContextType } from 'contexts/ui';
import { useOnlineUserContext } from 'contexts/onlineUser';
import { useOfflineUserContext } from 'contexts/offlineUser';
import { Article, OfflineArticle } from 'types/article';
import { Handler } from 'types/handler';
import { Anthology, OfflineAnthology } from 'types/anthology';

// TODO: clean in different files
const UIProvider = ({ children }: { children: JSX.Element }) => {
	const toast = useToast();
	const onlineUser = useOnlineUserContext();
	const offlineUser = useOfflineUserContext();
	const navigate = useNavigate();

	const uiContextValue: UIContextType = {
		// By default it toasts when res.status is 'error'.
		handleToast: (
			res: Handler<unknown>,
			showIfSuccess = false,
			showIfNotSuccess = true,
			showIfAuthError = false,
			overrideMessage = undefined,
		) => {
			if (!showIfAuthError && res.code === 401) {
				navigate('/connexion');
			} else if (
				(showIfSuccess && res.status === 'success') ||
				(showIfNotSuccess && res.status !== 'success') ||
				(showIfAuthError && res.code === 401)
			) {
				toast({
					status: res.status,
					title: overrideMessage || res.message,
					description: res.subMessage,
					duration: 9000,
					isClosable: true,
				});
			}
		},
		online: {
			articles: {
				like: async (id: number, isLiked: boolean, callback: (isLiked: boolean) => void) => {
					try {
						const res = await onlineUser.methods.articles.like({ id, isLiked: !isLiked });
						// TODO: not clean
						uiContextValue.handleToast(
							res,
							true,
							true,
							false,
							!isLiked ? 'Article ajouté aux favoris.' : 'Article retiré des favoris.',
						);
						if (res.status === 'success') {
							callback(!isLiked);
						}
					} catch (error) {
						console.error(error);
					}
				},
				load: {
					liked: async (callback: (articles: Article[]) => void) => {
						try {
							const res = await onlineUser.methods.articles.load.liked();
							uiContextValue.handleToast(res);
							if (res.status === 'success') {
								callback(res.data!);
							}
						} catch (error) {
							console.error(error);
						}
					},
				},
				search: {
					one: async (id: number, callback: (article: Article) => void) => {
						try {
							const res = await onlineUser.methods.articles.search.one({ id });
							uiContextValue.handleToast(res);
							if (res.code === 404) {
								navigate('/favoris');
							} else if (res.data !== undefined && res.status === 'success') {
								callback(res.data);
							}
						} catch (error) {
							console.error(error);
						}
					},
				},
			},
			anthologies: {
				articles: async (id: number, callback: (articles: Article[]) => void) => {
					try {
						const res = await onlineUser.methods.anthologies.articles({ id });
						uiContextValue.handleToast(res);
						if (res.code === 404) {
							navigate('/bibliotheque');
						} else if (res.status === 'success') {
							callback(res.data!);
						}
					} catch (error) {
						console.error(error);
					}
				},
				create: async ({
					params: { name, description, articleId },
					callback,
				}: {
					params: { name: string; description: string; articleId?: number };
					callback: () => Promise<void>;
				}) => {
					try {
						const res = await onlineUser.methods.anthologies.create({
							name,
							description,
							isPublic: false,
							articles: articleId ? [articleId] : [],
						});
						uiContextValue.handleToast(res, true);
						if (res.status === 'success') {
							await callback();
						}
					} catch (error) {
						console.error(error);
					}
				},
				delete: async (id: number, callback: () => Promise<void>) => {
					try {
						const res = await onlineUser.methods.anthologies.delete({ id });
						uiContextValue.handleToast(res, true);
						if (res.status === 'success') await callback();
					} catch (error) {
						console.error(error);
					}
				},
				load: async (callback: (anthologies: Anthology[]) => void) => {
					try {
						const res = await onlineUser.methods.anthologies.load();
						uiContextValue.handleToast(res);
						if (res.status === 'success') {
							callback(res.data!);
						}
					} catch (error) {
						console.error(error);
					}
				},
				search: {
					one: async (id: number, callback: (anthology: Anthology) => void) => {
						try {
							const res = await onlineUser.methods.anthologies.search.one({ id });
							uiContextValue.handleToast(res);
							if (res.code === 404) {
								navigate('/bibliotheque');
							} else if (res.status === 'success') {
								callback(res.data!);
							}
						} catch (error) {
							console.error(error);
						}
					},
				},
				addArticle: async (id: number, articleId: number, callback: () => Promise<void>) => {
					try {
						const res = await onlineUser.methods.anthologies.update({ id, addArticles: [articleId] });
						uiContextValue.handleToast(res, true, true, false, 'Article ajouté au dossier !');
						if (res.status === 'success') {
							await callback();
						}
					} catch (error) {
						console.error(error);
					}
				},
				removeArticle: async (id: number, articleId: number, callback: () => Promise<void>) => {
					try {
						const res = await onlineUser.methods.anthologies.update({ id, removeArticles: [articleId] });
						uiContextValue.handleToast(res, true);
						if (res.status === 'success') {
							await callback();
						}
					} catch (error) {
						console.error(error);
					}
				},
				update: async (id: number, newName: string, newDescription: string, callback: () => Promise<void>) => {
					try {
						const res = await onlineUser.methods.anthologies.update({
							id,
							newName,
							newDescription,
						});
						uiContextValue.handleToast(res, true);
						if (res.status === 'success') {
							await callback();
						}
					} catch (error) {
						console.error(error);
					}
				},
			},
		},
		offline: {
			articles: {
				like: async (cid: string, isLiked: boolean, callback?: (isLiked: boolean) => void) => {
					if (isLiked) {
						const res = offlineUser.methods.articles.unlike(cid);
						toast({
							status: res ? 'success' : 'error',
							title: res ? 'Article retiré des favoris.' : 'Une erreur est survenue.',
							duration: 9000,
							isClosable: true,
						});
						callback && callback(!isLiked);
					} else {
						const res = offlineUser.methods.articles.like(cid);
						toast({
							status: res ? 'success' : 'error',
							title: res ? 'Article ajouté aux favoris !' : 'Une erreur est survenue.',
							duration: 9000,
							isClosable: true,
						});
						callback && callback(!isLiked);
					}
				},
				search: {
					one: async (cid: string, callback: (article: OfflineArticle) => void) => {
						const article = offlineUser.articlesCatalog.find((a) => a.cid === cid);
						if (!article) {
							navigate('/bibliotheque');
							toast({
								status: 'error',
								title: 'Article inconnu.',
								duration: 9000,
								isClosable: true,
							});
						} else {
							callback(article);
						}
					},
				},
				getContent: async (cid: string, callback: (content: string) => void) => {
					try {
						const file = await offlineUser.methods.ipfs.get<{ id: string; subtitle: string; content: string }>(cid);
						console.log(file);
						callback(file.content);
					} catch (error) {
						console.error(error);
					}
				},
			},
			anthologies: {
				articles: async (id: string, callback: (articles: OfflineArticle[]) => void) => {
					try {
						const res = offlineUser.methods.anthologies.articles(id);
						if (res === undefined) {
							navigate('/bibliotheque');
							toast({
								status: 'error',
								title: 'Dossier inconnu.',
								duration: 9000,
								isClosable: true,
							});
						}
						callback(res!);
					} catch (error) {
						console.error(error);
					}
				},
				create: async ({
					params: { name, description, cid },
					callback,
				}: {
					params: { name: string; description: string; cid?: string };
					callback: () => void;
				}) => {
					const res = offlineUser.methods.anthologies.create({ name, description, articles: cid ? [cid] : [] });
					toast({
						status: res ? 'success' : 'error',
						title: res ? 'Dossier créé !' : 'Une erreur est survenue',
						duration: 9000,
						isClosable: true,
					});
					if (res) callback();
				},
				delete: async (id: string) => {
					const res = offlineUser.methods.anthologies.delete(id);
					toast({
						status: res ? 'success' : 'error',
						title: res ? 'Dossier supprimé.' : 'Dossier introuvable.',
						duration: 9000,
						isClosable: true,
					});
				},
				search: {
					one: async (id: string, callback: (anthology: OfflineAnthology) => void) => {
						const anthology = offlineUser.data.anthologies.find((a) => a.id === id);
						if (!anthology) {
							navigate('/bibliotheque');
							toast({
								status: 'error',
								title: 'Dossier inconnu.',
								duration: 9000,
								isClosable: true,
							});
						} else {
							callback(anthology);
						}
					},
				},
				addArticle: async (id: string, cid: string, callback: () => void) => {
					const res = offlineUser.methods.anthologies.addArticle({ id, cid });
					toast({
						status: res ? 'success' : 'error',
						title: res ? 'Article ajouté au dossier !' : 'Une erreur est survenue',
						duration: 9000,
						isClosable: true,
					});
					if (res) callback();
				},
				removeArticle: async (id: string, cid: string, callback: () => Promise<void>) => {
					const res = offlineUser.methods.anthologies.removeArticle({ cid, id });
					toast({
						status: res ? 'success' : 'error',
						title: res ? 'Article retiré du dossier !' : 'Une erreur est survenue.',
						duration: 9000,
						isClosable: true,
					});
					if (res) await callback();
				},
				update: async (id: string, newName: string, newDescription: string, callback: () => void) => {
					const res = offlineUser.methods.anthologies.update({ id, newName, newDescription });
					toast({
						status: res ? 'success' : 'error',
						title: res ? 'Dossier modifié !' : 'Une erreur est survenue.',
						duration: 9000,
						isClosable: true,
					});
					if (res) callback();
				},
			},
		},
	};

	return <UIContext.Provider value={uiContextValue} children={children} />;
};

export default UIProvider;
