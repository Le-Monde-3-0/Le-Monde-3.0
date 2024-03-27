import { createContext, useContext } from 'react';

import { Article } from 'types/article';

type IpfsContextType = {
	ipfs: {
		config: {
			gateway: string | undefined;
		};
		data: {
			articles: Article[];
		};
	};
	clearIpfs: () => void;
	setGateway: (gateway: string) => void;
	setArticles: (articles: Article[]) => void;
	getIPFSFile: <Type>(cid: string) => Promise<Type>;
};

const IpfsContext = createContext<IpfsContextType | undefined>(undefined);

const useIpfsContext = (): IpfsContextType => {
	const context = useContext(IpfsContext);
	if (!context) throw new Error('Context used outside of provider.');
	return context;
};

export type { IpfsContextType };
export { useIpfsContext };
export default IpfsContext;
