import changeDraftState from './changeDraftState';
import hardDelete from './delete';
import like from './like';
import liked from './liked';
import me from './me';
import publish from './publish';
import read from './read';
import unlike from './unlike';

const articlesService = {
	me,
	liked,
	publish,
	changeDraftState,
	delete: hardDelete,
	read,
	like,
	unlike,
};

export default articlesService;
