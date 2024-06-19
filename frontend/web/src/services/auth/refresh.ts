import { servicesURL } from 'services';
import { EmptyType } from 'types/services';

const refresh = async () => servicesURL.post<EmptyType>('/authentication/refresh-token');

export default refresh;
