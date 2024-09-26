import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

import UIContext, { UIContextType } from 'contexts/ui';
import { useOnlineUserContext } from 'contexts/onlineUser';
import { useOfflineUserContext } from 'contexts/offlineUser';
import { Topic } from 'types/topic';
import { UIHandling } from 'types/handler';
import { Article, OfflineArticle } from 'types/article';
import { Anthology, OfflineAnthology } from 'types/anthology';
import {
	ParamsAnthologiesCreate,
	ParamsAnthologiesSearch,
	ParamsArticlesCreate,
	ParamsArticlesLike,
	ParamsArticlesSearch,
	ParamsAuthSignIn,
	ParamsAuthSignUp,
	ParamsUserUpdatePassword,
} from 'types/services';
import actions from './actions';

const UIProvider = ({ children }: { children: JSX.Element }) => {
	const toast = useToast();
	const onlineUser = useOnlineUserContext();
	const offlineUser = useOfflineUserContext();
	const navigate = useNavigate();

	const uiContextValue: UIContextType = {
		handleToast: ({ res, settings, messages }: UIHandling) => {
			if (!settings.showIfAuthError && res.code === 401) {
				navigate('/connexion');
			} else if (
				(settings.showIfSuccess && res.status === 'success') ||
				(settings.showIfNotSuccess && res.status !== 'success') ||
				(settings.showIfAuthError && res.code === 401)
			) {
				let title = '';
				let description: string | undefined = undefined;

				switch (res.code) {
					case 1:
						title = messages[1]?.message || 'Serveur inaccessible.';
						description = messages[1]?.subMessage || res.message;
						break;
					case 2:
						title = messages[2]?.message || "Erreur de l'application.";
						description = messages[2]?.subMessage || res.message;
						break;
					case 3:
						title = messages[3]?.message || 'Réponse du serveur inconnue.';
						description = messages[3]?.subMessage || res.message;
						break;
					case 200:
						title = messages[200]?.message || 'Ressource récupérée.';
						description = messages[200]?.subMessage || res.message;
						break;
					case 201:
						title = messages[200]?.message || 'Ressource créée.';
						description = messages[200]?.subMessage || res.message;
						break;
					case 400:
						title = messages[400]?.message || 'Paramètres invalides.';
						description = messages[400]?.subMessage || res.message;
						break;
					case 401:
						title = messages[401]?.message || 'Accès interdit.';
						description = messages[401]?.subMessage || res.message;
						break;
					case 404:
						title = messages[404]?.message || 'Ressource introuvable.';
						description = messages[404]?.subMessage || res.message;
						break;
					case 409:
						title = messages[409]?.message || 'Conflit.';
						description = messages[409]?.subMessage || res.message;
						break;
					case 500:
						title = 'Erreur du serveur.';
						description = '';
						break;

					default:
						title = 'Invalide code';
						description = 'Developer error';
				}

				toast({
					status: res.status,
					title,
					description,
					duration: 9000,
					isClosable: true,
				});
			}
		},
		online: {
			auth: {
				sign: {
					up: (params: ParamsAuthSignUp, callback: () => void) =>
						actions.online.auth.sign.up(params, callback, onlineUser, uiContextValue.handleToast),
					in: (params: ParamsAuthSignIn, callback: () => void) =>
						actions.online.auth.sign.in(params, callback, onlineUser, uiContextValue.handleToast),
					out: (callback: () => void) => actions.online.auth.sign.out(callback, onlineUser, uiContextValue.handleToast),
					again: (callback: () => void) =>
						actions.online.auth.sign.again(callback, onlineUser, uiContextValue.handleToast),
				},
			},
			user: {
				me: () => actions.online.user.me(onlineUser, uiContextValue.handleToast),
				update: {
					password: (params: ParamsUserUpdatePassword) =>
						actions.online.user.update.password(params, onlineUser, uiContextValue.handleToast),
					email: (newEmail: string) =>
						actions.online.user.update.email(newEmail, onlineUser, uiContextValue.handleToast),
					username: (newUsername: string) =>
						actions.online.user.update.username(newUsername, onlineUser, uiContextValue.handleToast),
				},
			},
			articles: {
				create: (params: ParamsArticlesCreate, callback: (id: number) => void) =>
					actions.online.articles.create(params, callback, onlineUser, uiContextValue.handleToast),
				search: {
					allPublications: (params: ParamsArticlesSearch, callback: (articles: Article[]) => void) =>
						actions.online.articles.search.allPublications(params, callback, onlineUser, uiContextValue.handleToast),
					myArticles: (params: ParamsArticlesSearch, callback: (articles: Article[]) => void) =>
						actions.online.articles.search.myArticles(params, callback, onlineUser, uiContextValue.handleToast),
					likedPublications: (params: ParamsArticlesSearch, callback: (articles: Article[]) => void) =>
						actions.online.articles.search.likedPublications(params, callback, onlineUser, uiContextValue.handleToast),
					oneDraft: (id: number, callback: (article: Article) => void) =>
						actions.online.articles.search.oneDraft(id, callback, onlineUser, uiContextValue.handleToast),
					onePublication: (id: number, callback: (article: Article) => void) =>
						actions.online.articles.search.onePublication(id, callback, onlineUser, uiContextValue.handleToast),
				},
				like: (params: ParamsArticlesLike, callback: (isLiked: boolean) => void) =>
					actions.online.articles.like(params, callback, onlineUser, uiContextValue.handleToast),
				delete: (id: number, callback: () => void) =>
					actions.online.articles.delete(id, callback, onlineUser, uiContextValue.handleToast),
			},
			anthologies: {
				create: (params: ParamsAnthologiesCreate, callback: () => void) =>
					actions.online.anthologies.create(params, callback, onlineUser, uiContextValue.handleToast),
				search: {
					many: (params: ParamsAnthologiesSearch, callback: (anthologies: Anthology[]) => void) =>
						actions.online.anthologies.search.many(params, callback, onlineUser, uiContextValue.handleToast),
					one: (id: number, callback: (anthologies: Anthology) => void) =>
						actions.online.anthologies.search.one(id, callback, onlineUser, uiContextValue.handleToast),
				},
				update: (id: number, newName: string, newDescription: string, callback: () => void) =>
					actions.online.anthologies.update(
						id,
						newName,
						newDescription,
						callback,
						onlineUser,
						uiContextValue.handleToast,
					),
				addArticle: (id: number, articleId: number, callback: () => void) =>
					actions.online.anthologies.addArticle(id, articleId, callback, onlineUser, uiContextValue.handleToast),
				removeArticle: (id: number, articleId: number, callback: () => void) =>
					actions.online.anthologies.removeArticle(id, articleId, callback, onlineUser, uiContextValue.handleToast),
				delete: (id: number, callback: () => void) =>
					actions.online.anthologies.delete(id, callback, onlineUser, uiContextValue.handleToast),
			},
			topics: {
				search: {
					all: (callback: (topics: Topic[]) => void) =>
						actions.online.topics.search.all(callback, onlineUser, uiContextValue.handleToast),
				},
			},
		},
		offline: {
			articles: {
				like: (cid: string, isLiked: boolean, callback: (isLiked: boolean) => void) => {
					if (isLiked) {
						const res = offlineUser.methods.articles.unlike(cid);
						toast({
							status: res ? 'success' : 'error',
							title: res ? 'Article retiré des favoris.' : 'Une erreur est survenue.',
							duration: 9000,
							isClosable: true,
						});
						callback(!isLiked);
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
					one: (cid: string, callback: (article: OfflineArticle) => void) => {
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
				articles: (id: string, callback: (articles: OfflineArticle[]) => void) => {
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
				},
				create: ({
					params: { name, description, cid },
					callback,
				}: {
					params: { name: string; description: string; cid?: string };
					callback: () => void;
				}) => {
					const res = offlineUser.methods.anthologies.create({ name, description, articles: cid ? [cid] : [] });
					toast({
						status: res ? 'success' : 'error',
						title: res ? 'Dossier créé.' : 'Une erreur est survenue.',
						duration: 9000,
						isClosable: true,
					});
					if (res) callback();
				},
				delete: (id: string, callback: () => void) => {
					const res = offlineUser.methods.anthologies.delete(id);
					toast({
						status: res ? 'success' : 'error',
						title: res ? 'Dossier supprimé.' : 'Dossier introuvable.',
						duration: 9000,
						isClosable: true,
					});
					callback();
				},
				search: {
					one: (id: string, callback: (anthology: OfflineAnthology) => void) => {
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
				addArticle: (id: string, cid: string, callback: () => void) => {
					const res = offlineUser.methods.anthologies.addArticle({ id, cid });
					toast({
						status: res ? 'success' : 'error',
						title: res ? 'Article ajouté au dossier !' : 'Une erreur est survenue',
						duration: 9000,
						isClosable: true,
					});
					if (res) callback();
				},
				removeArticle: (id: string, cid: string, callback: () => void) => {
					const res = offlineUser.methods.anthologies.removeArticle({ cid, id });
					toast({
						status: res ? 'success' : 'error',
						title: res ? 'Article retiré du dossier !' : 'Une erreur est survenue.',
						duration: 9000,
						isClosable: true,
					});
					if (res) callback();
				},
				update: (id: string, newName: string, newDescription: string, callback: () => void) => {
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
