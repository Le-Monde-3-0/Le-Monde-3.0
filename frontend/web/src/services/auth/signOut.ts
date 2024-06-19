import { servicesURL } from 'services';
import { EmptyType } from 'types/services';

const signOut = async () => servicesURL.delete<EmptyType>('/authentication/revoke-token');

export default signOut;
