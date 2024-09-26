import services from 'services';
import { ParamsAnthologiesCreate } from 'types/services';
import handle from 'utils/handler/handle';

const create = async (params: ParamsAnthologiesCreate) => handle(async () => await services.anthologies.create(params));

export default create;
