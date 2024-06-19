import { servicesURL } from 'services';
import { EmptyType } from 'types/services';

const hardDelete = async (id: number) => servicesURL.delete<EmptyType>(`/anthologies/${id}`);

export default hardDelete;
