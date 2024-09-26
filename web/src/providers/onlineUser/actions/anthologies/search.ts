import services from 'services';
import { ParamsAnthologiesSearch } from 'types/services';
import handle from 'utils/handler/handle';

export const many = async (params: ParamsAnthologiesSearch) =>
	handle(async () => await services.anthologies.search.many(params));

export const one = async (id: number) => handle(async () => await services.anthologies.search.one(id));
