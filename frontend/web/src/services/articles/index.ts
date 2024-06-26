import create from './create';
import hardDelete from './delete';
import like from './like';
import { searchMany, searchOne } from './search';
import update from './update';

const articlesService = {
	create,
	delete: hardDelete,
	like,
	searchMany,
	searchOne,
	update,
};

export default articlesService;
