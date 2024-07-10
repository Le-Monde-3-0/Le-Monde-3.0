import { Handler } from 'types/handler';
import { createdResponse, badRequestError, conflictError, okResponse } from './responses';

const table: { [key: string]: Handler<never>[] } = {
	'sign.up': [createdResponse('Inscription réussie!'), badRequestError(), conflictError()],
	'sign.in': [okResponse('Connexion réussie!'), badRequestError()],
	'sign.out': [okResponse('Vous êtes déconnectés.')],
	'sign.again': [createdResponse('Bienvenue !')],
	'update.password': [],
	'update.email': [],
	'update.username': [],
	'articles.create': [],
	'articles.delete': [],
	'articles.like': [],
	'articles.load.liked': [],
	'articles.load.written': [],
	'articles.search.one': [],
	'articles.search.many': [],
	'articles.update': [],
	'anthologies.articles': [],
	'anthologies.create': [],
	'anthologies.delete': [],
	'anthologies.load': [],
	'anthologies.search.one': [],
	'anthologies.search.many': [],
	'anthologies.update': [],
	'topics.search.one': [],
	'topics.search.all': [],
};

export default table;
