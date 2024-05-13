import create from './create';
import update from './update';
import hardDelete from './delete';
import { get, getAll } from './get';
import { addArticle, getArticles, removeArticle } from './articles';

const bookmarksService = {
	create,
	update,
	get,
	getAll,
	delete: hardDelete,
	getArticles,
	addArticle,
	removeArticle,
};

export default bookmarksService;
