import create from './create';
import hardDelete from './delete';
import like from './like';
import { many, one } from './search';
import update from './update';

const articles = {
	create,
	delete: hardDelete,
	like,
	search: {
		one,
		many,
	},
	update,
};

export default articles;
