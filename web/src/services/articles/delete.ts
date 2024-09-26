import { servicesURL } from 'services';
import { ResponseEmpty } from 'types/services';

const hardDelete = async (id: number) => servicesURL.delete<ResponseEmpty>(`/articles/${id}`);

export default hardDelete;
