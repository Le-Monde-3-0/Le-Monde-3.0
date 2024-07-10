import { servicesURL } from 'services';
import { Article } from 'types/article';
import { AnthologiesArticles } from 'types/services';

const articles = async (params: AnthologiesArticles) =>
	servicesURL.get<Article[]>(`/anthologies/${params.id}/articles`);

export default articles;
