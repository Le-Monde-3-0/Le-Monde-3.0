import articles from './articles';
import create from './create';
import hardDelete from './delete';
import { many, one } from './search';
import update from './update';

const anthologies = {
	articles,
	create,
	delete: hardDelete,
	search: {
		one,
		many,
	},
	update,
};

export default anthologies;
