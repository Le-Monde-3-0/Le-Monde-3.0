import { Handler } from 'types/handler';
import { createdResponse, badRequestError, conflictError, okResponse, notAuthError } from './responses';

const table: { [key: string]: Handler<never>[] } = {
	'sign.up': [createdResponse('Inscription réussie !'), badRequestError(), conflictError()],
	'sign.in': [okResponse('Connexion réussie !'), badRequestError()],
	'sign.out': [okResponse('Vous êtes déconnecté.')],
	'sign.again': [createdResponse('Bienvenue !'), notAuthError()],
	'update.password': [notAuthError()],
	'update.email': [notAuthError()],
	'update.username': [notAuthError()],
	'articles.create': [notAuthError()],
	'articles.delete': [notAuthError()],
	'articles.like': [notAuthError()],
	'articles.load.liked': [notAuthError()],
	'articles.load.written': [notAuthError()],
	'articles.search.one': [notAuthError()],
	'articles.search.many': [notAuthError()],
	'articles.update': [notAuthError()],
	'anthologies.articles': [notAuthError()],
	'anthologies.create': [notAuthError()],
	'anthologies.delete': [notAuthError()],
	'anthologies.load': [notAuthError()],
	'anthologies.search.one': [notAuthError()],
	'anthologies.search.many': [notAuthError()],
	'anthologies.update': [notAuthError()],
	'topics.search.one': [notAuthError()],
	'topics.search.all': [notAuthError()],
};

export default table;
