import addArticle from './addArticle';
import create from './create';
import hardDelete from './delete';
import removeArticle from './removeArticle';
import { many, one } from './search';
import update from './update';

const anthologies = {
	create,
	search: {
		many,
		one,
	},
	update,
	addArticle,
	removeArticle,
	delete: hardDelete,
};

export default anthologies;
