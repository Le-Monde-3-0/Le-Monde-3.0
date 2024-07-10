import create from './create';
import hardDelete from './delete';
import like from './like';
import { liked, written } from './load';
import { one, many } from './search';
import update from './update';

const articles = {
	create,
	delete: hardDelete,
	like,
	load: {
		written,
		liked,
	},
	search: {
		one,
		many,
	},
	update,
};

export default articles;
