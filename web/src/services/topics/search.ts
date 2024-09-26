import { servicesURL } from 'services';
import { Topic } from 'types/topic';

export const all = async () => servicesURL.get<Topic[]>('/topics');
