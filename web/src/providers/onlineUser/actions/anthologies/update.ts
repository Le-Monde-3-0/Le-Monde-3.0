import services from 'services';
import { ParamsAnthologiesUpdate } from 'types/services';
import handle from 'utils/handler/handle';

const update = (params: ParamsAnthologiesUpdate) => handle(async () => await services.anthologies.update(params));

export default update;
