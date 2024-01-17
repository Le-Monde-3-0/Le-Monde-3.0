import create from './create';
import hardDelete from './delete';
import { get, getAll } from './get';
import { addArticle, removeArticle } from './articles';

const bookmarksService = {
	create,
	get,
	getAll,
	delete: hardDelete,
	addArticle,
	removeArticle,
};

export default bookmarksService;
