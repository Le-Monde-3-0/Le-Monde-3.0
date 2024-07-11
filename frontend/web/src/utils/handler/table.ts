import { Handler } from 'types/handler';
import { createdResponse, badRequestError, conflictError, okResponse, notAuthError, notFoundError } from './responses';

const table: { [key: string]: Handler<never>[] } = {
	'sign.up': [
		createdResponse('Bienvenue !', "Qu'allez-vous lire ou écrire aujourd'hui ?"),
		badRequestError(),
		conflictError(),
	],
	'sign.in': [okResponse('Vous êtes de retour !', "Qu'allez-vous lire ou écrire aujourd'hui ?"), badRequestError()],
	'sign.out': [okResponse('Vous êtes déconnecté.')],
	'sign.again': [createdResponse("Votre connexion vient d'être rafraîchie."), notAuthError()],
	me: [okResponse('Profil récupéré.')],
	'update.password': [notAuthError()],
	'update.email': [notAuthError()],
	'update.username': [notAuthError()],
	'articles.create': [createdResponse('Article créé !'), notAuthError()],
	'articles.delete': [notAuthError()],
	'articles.like': [okResponse('Article ajouté aux / retiré des favoris.'), notAuthError()],
	'articles.load.liked': [okResponse('Vos articles favoris ont été récupérés.'), notAuthError()],
	'articles.load.written': [okResponse('Vos rédactions ont été récupérées.'), notAuthError()],
	'articles.search.one': [okResponse('Article trouvé.'), notAuthError(), notFoundError('Article introuvable.')],
	'articles.search.many': [notAuthError()],
	'articles.update': [notAuthError()],
	'anthologies.articles': [notAuthError()],
	'anthologies.create': [createdResponse('Dossier créé !'), notAuthError()],
	'anthologies.delete': [okResponse('Dossier supprimé.'), notAuthError()],
	'anthologies.load': [okResponse('Dossiers récupérés.'), notAuthError()],
	'anthologies.search.one': [notAuthError()],
	'anthologies.search.many': [notAuthError()],
	'anthologies.update': [okResponse('Dossier modifié.'), notAuthError()],
	'topics.search.one': [notAuthError()],
	'topics.search.all': [okResponse('Catégories récupérées.'), notAuthError()],
};

export default table;
