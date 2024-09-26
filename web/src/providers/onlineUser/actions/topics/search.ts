import services from 'services';
import handle from 'utils/handler/handle';

export const all = async () => handle(async () => await services.topics.search.all());
