import { servicesURL } from 'services';
import { OnlineUser } from 'types/user';

const me = async () => servicesURL.get<OnlineUser>('/user/me');

export default me;
