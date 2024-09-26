import services from 'services';
import { ParamsArticlesSearch } from 'types/services';
import handle from 'utils/handler/handle';

export const allPublications = async (params: ParamsArticlesSearch) =>
	handle(async () => await services.articles.search.allPublications(params));

export const myArticles = async (params: ParamsArticlesSearch) =>
	handle(async () => await services.articles.search.myArticles(params));

export const likedPublications = async (params: ParamsArticlesSearch) =>
	handle(async () => await services.articles.search.likedPublications(params));

export const oneDraft = async (id: number) => handle(async () => await services.articles.search.oneDraft(id));

export const onePublication = async (id: number) =>
	handle(async () => await services.articles.search.onePublication(id));
