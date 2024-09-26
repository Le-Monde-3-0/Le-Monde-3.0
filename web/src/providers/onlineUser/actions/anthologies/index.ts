import create from './create';
import hardDelete from './delete';
import { many, one } from './search';
import update from './update';

const anthologies = {
	create,
	search: {
		many,
		one,
	},
	update,
	delete: hardDelete,
};

export default anthologies;
