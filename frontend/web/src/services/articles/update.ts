import { servicesURL } from 'services';
import { Article } from 'types/article';

const update = async ({
	id,
	newTitle,
	newSubtitle,
	newContent,
	newTopic,
	newDraft,
}: {
	id: number;
	newTitle?: string;
	newSubtitle?: string;
	newContent?: string;
	newTopic?: number;
	newDraft?: boolean;
}) =>
	servicesURL.patch<Article>(`/articles/${id}`, {
		title: newTitle,
		subtitle: newSubtitle,
		content: newContent,
		topic: newTopic,
		draft: newDraft,
	});

export default update;
