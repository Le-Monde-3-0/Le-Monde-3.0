import services from 'services';
import { ParamsArticlesLike } from 'types/services';
import handle from 'utils/handler/handle';

const like = async (params: ParamsArticlesLike) => handle(async () => await services.articles.like(params));

export default like;
