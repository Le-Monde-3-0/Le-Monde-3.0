import me from './me';
import liked from './liked';
import publish from './publish';
import changeDraftState from './changeDraftState';
import read from './read';
import like from './like';
import unlike from './unlike';
import hardDelete from './delete';

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
