import { servicesURL } from 'services';
import { AnthologiesDelete, EmptyResponse } from 'types/services';

const hardDelete = async (params: AnthologiesDelete) => servicesURL.delete<EmptyResponse>(`/anthologies/${params.id}`);

export default hardDelete;
