import React, { useEffect, useState } from 'react';
import axios from 'axios';

import IpfsContext, { IpfsContextType } from 'contexts/ipfs';
import loadFromLocalStorage from 'utils/loadFromLocalStorage';
import { Article } from 'types/article';

const defaultIpfs = {
	config: {
		gateway: undefined,
	},
	data: {
		articles: [],
	},
};

const IpfsProvider = ({ children }: { children: JSX.Element }) => {
	const [ipfs, setIpfs] = useState<IpfsContextType['ipfs']>(
		loadFromLocalStorage<IpfsContextType['ipfs']>('ipfs', defaultIpfs),
	);

	useEffect(() => {
		const localStorageIpfs = localStorage.getItem('ipfs');
		if (localStorageIpfs) setIpfs(JSON.parse(localStorageIpfs));
	}, []);

	useEffect(() => {
		if (ipfs) {
			localStorage.setItem('ipfs', JSON.stringify(ipfs));
		}
	}, [ipfs]);

	const ipfsContextValue: IpfsContextType = {
		ipfs,
		clearIpfs: () => {
			localStorage.removeItem('ipfs');
			setIpfs(defaultIpfs);
		},
		setGateway: (gateway: string) => setIpfs((i) => ({ ...i, config: { ...i.config, gateway } })),
		setArticles: (articles: Article[]) => setIpfs((i) => ({ ...i, data: { ...i.data, articles } })),
		getIPFSFile: async (cid: string) => {
			try {
				console.log(`get IPFS CID: ${cid}`);
				const res = await axios.get(`${ipfs.config.gateway}/ipfs/${cid}`, { timeout: 50000 });
				console.log(res);
				return res.data;
			} catch (error) {
				throw error;
			}
		},
	};

	return <IpfsContext.Provider value={ipfsContextValue} children={children} />;
};

export default IpfsProvider;
