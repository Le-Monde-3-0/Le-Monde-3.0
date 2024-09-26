import { servicesURL } from 'services';
import { MeResponse } from 'types/services';

const me = async () => servicesURL.get<MeResponse>('/user/me');

export default me;
