import React, { useEffect, useState } from 'react';
import axios from 'axios';

import IpfsContext, { IpfsContextType } from 'contexts/ipfs';
import loadFromLocalStorage from 'utils/loadFromLocalStorage';

const IpfsProvider = ({ children }: { children: JSX.Element }) => {
	const [config, setConfig] = useState<IpfsContextType['config']>(
		loadFromLocalStorage<IpfsContextType['config']>('ipfs', {
			gateway: undefined,
		}),
	);

	useEffect(() => {
		const localStorageIpfs = localStorage.getItem('ipfs');
		if (localStorageIpfs) setConfig(JSON.parse(localStorageIpfs));
	}, []);

	useEffect(() => {
		if (config && config.gateway) {
			localStorage.setItem('ipfs', JSON.stringify(config));
		}
	}, [config]);

	const ipfsContextValue: IpfsContextType = {
		config,
		clearConfig: () => {
			localStorage.removeItem('ipfs');
			setConfig({
				gateway: undefined,
			});
		},
		setGateway: (gateway: string) => setConfig((c) => ({ ...c, gateway })),
		getIPFSFile: async (cid: string) => {
			try {
				console.log(`get IPFS CID: ${cid}`);
				const res = await axios.get(`${config.gateway}/ipfs/${cid}`, { timeout: 50000 });
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
