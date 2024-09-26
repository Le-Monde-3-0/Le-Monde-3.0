import services from 'services';
import { ParamsArticlesUpdate } from 'types/services';
import handle from 'utils/handler/handle';

const update = (params: ParamsArticlesUpdate) => handle(async () => await services.articles.update(params));

export default update;
