import { servicesURL } from 'services';
import { Topic } from 'types/topic';

const searchAll = async () => servicesURL.get<Topic[]>('/topics');
const searchOne = async (id: number) => servicesURL.get<Topic>(`/topics/${id}`);

export { searchAll, searchOne };
