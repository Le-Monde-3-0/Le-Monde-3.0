import React, { useEffect, useState } from 'react';
import axios from 'axios';

import IpfsContext, { IpfsContextType } from 'contexts/ipfs';

const IpfsProvider = ({ children }: { children: JSX.Element }) => {
	const [config, setConfig] = useState<IpfsContextType['config']>({
		gateway: undefined,
	});

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
			console.log(`getFile(${cid})`);
			try {
				const res = await axios.get(`${config.gateway}/ipfs/${cid}`);
				console.log(res);
				return JSON.parse('{}');
			} catch (error) {
				console.error(error);
				return JSON.parse('{}');
			}
		},
	};

	return <IpfsContext.Provider value={ipfsContextValue} children={children} />;
};

export default IpfsProvider;
