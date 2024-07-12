import { servicesURL } from 'services';
import { ArticlesDelete, EmptyResponse } from 'types/services';

const hardDelete = async (params: ArticlesDelete) => servicesURL.delete<EmptyResponse>(`/articles/${params.id}`);

export default hardDelete;
