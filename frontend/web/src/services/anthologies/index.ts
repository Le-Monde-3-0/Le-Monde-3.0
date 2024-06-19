import { getArticles } from './articles';
import create from './create';
import hardDelete from './delete';
import { searchMany, searchOne } from './search';
import update from './update';

const anthologiesService = {
	getArticles,
	create,
	delete: hardDelete,
	searchMany,
	searchOne,
	update,
};

export default anthologiesService;
