import { servicesURL } from 'services';
import { TopicsSearchOne } from 'types/services';
import { Topic } from 'types/topic';

export const one = async (params: TopicsSearchOne) => servicesURL.get<Topic>(`/topics/${params.id}`);

export const all = async () => servicesURL.get<Topic[]>('/topics');
