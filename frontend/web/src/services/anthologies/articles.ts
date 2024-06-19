import { servicesURL } from 'services';
import { Article } from 'types/article';

const getArticles = async (id: number) => servicesURL.get<Article[]>(`/anthologies/${id}/articles`);

export { getArticles };
