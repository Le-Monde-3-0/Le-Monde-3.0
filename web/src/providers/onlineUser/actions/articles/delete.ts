import services from 'services';
import handle from 'utils/handler/handle';

const hardDelete = async (id: number) => handle(async () => await services.articles.delete(id));

export default hardDelete;
