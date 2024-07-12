import articles from './articles';
import create from './create';
import hardDelete from './delete';
import load from './load';
import { one, many } from './search';
import update from './update';

const anthologies = {
	articles,
	create,
	delete: hardDelete,
	load,
	search: {
		one,
		many,
	},
	update,
};

export default anthologies;
