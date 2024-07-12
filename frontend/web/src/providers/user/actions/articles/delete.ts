import services from 'services';
import { ArticlesDelete } from 'types/services';
import handle from 'utils/handler/handle';

const hardDelete = async ({
	isOffline,
	callback,
	params,
}: {
	isOffline: boolean;
	callback: (id: number) => void;
	params: ArticlesDelete;
}) => {
	if (isOffline) {
		throw new Error("Action 'articles.delete' is not available using IPFS.");
	}
	return handle({
		request: async () => {
			const res = await services.articles.delete(params);
			callback(params.id);
			return res;
		},
		name: 'articles.delete',
	});
};

export default hardDelete;
