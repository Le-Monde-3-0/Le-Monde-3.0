import create from './create';
import hardDelete from './delete';
import like from './like';
import { allPublications, myArticles, likedPublications, oneDraft, onePublication } from './search';

const articles = {
	create,
	search: {
		allPublications,
		myArticles,
		likedPublications,
		oneDraft,
		onePublication,
	},
	like,
	delete: hardDelete,
};

export default articles;
