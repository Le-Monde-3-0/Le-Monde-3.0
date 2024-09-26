import { servicesURL } from 'services';
import { ResponseEmpty } from 'types/services';

const hardDelete = async (id: number) => servicesURL.delete<ResponseEmpty>(`/anthologies/${id}`);

export default hardDelete;
