import { createContext, useContext } from 'react';

import { OfflineUser } from 'types/user';
import { OfflineArticle } from 'types/article';
import { OfflineAnthologyArticle, OfflineCreateAnthology, OfflineUpdateAnthology } from 'types/offline';

// TODO: remove useless types
type OfflineUserContextType = {
	data: OfflineUser;
	articlesCatalog: OfflineArticle[];
	methods: {
		data: {
			clear: () => void;
			upload: (offlineUser: OfflineUser) => void;
		};
		config: {
			setGateway: (gateway: string) => void;
			setStep: (step: number) => void;
			testGateway: () => Promise<boolean>;
		};
		articles: {
			loadCatalog: () => Promise<boolean>;
			like: (cid: string) => boolean;
			unlike: (cid: string) => boolean;
		};
		anthologies: {
			articles: (id: string) => OfflineArticle[] | undefined;
			create: (params: OfflineCreateAnthology) => boolean;
			update: (params: OfflineUpdateAnthology) => boolean;
			delete: (id: string) => boolean;
			addArticle: (params: OfflineAnthologyArticle) => boolean;
			removeArticle: (params: OfflineAnthologyArticle) => boolean;
		};
		ipfs: {
			get: <Type>(cid: string) => Promise<Type>;
		};
	};
};

const OfflineUserContext = createContext<OfflineUserContextType | undefined>(undefined);

const useOfflineUserContext = (): OfflineUserContextType => {
	const context = useContext(OfflineUserContext);
	if (!context) throw new Error('OfflineUserContext used outside of provider.');
	return context;
};

export type { OfflineUserContextType };
export { useOfflineUserContext };
export default OfflineUserContext;
