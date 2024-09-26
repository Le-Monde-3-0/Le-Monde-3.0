import services from 'services';
import { ParamsArticlesCreate } from 'types/services';
import handle from 'utils/handler/handle';

const create = async (params: ParamsArticlesCreate) => handle(async () => await services.articles.create(params));

export default create;
