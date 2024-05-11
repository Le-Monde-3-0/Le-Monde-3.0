import React from 'react';
import { useToast } from '@chakra-ui/react';

import { RequestResponse } from 'utils/handleRequest';
import UIContext, { UIContextType } from 'contexts/ui';

const UIProvider = ({ children }: { children: JSX.Element }) => {
	const toast = useToast();

	const uiContextValue: UIContextType = {
		// This method by default only toast when res.status is 'error'.
		requestResponseToast: (res: RequestResponse<unknown>, showIfSuccess = false, showIfNotSuccess = true) => {
			if ((showIfSuccess && res.status === 'success') || (showIfNotSuccess && res.status !== 'success')) {
				toast({
					status: res.status,
					title: res.message,
					description: res.subMessage,
					duration: 5000,
					isClosable: true,
				});
			}
		},
	};

	return <UIContext.Provider value={uiContextValue} children={children} />;
};

export default UIProvider;
