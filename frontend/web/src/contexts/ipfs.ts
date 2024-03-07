import { createContext, useContext } from 'react';

type IpfsContextType = {
	config: {
		gateway: string | undefined;
	};
	clearConfig: () => void;
	setGateway: (gateway: string) => void;
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
