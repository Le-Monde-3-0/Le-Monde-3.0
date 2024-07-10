import React from 'react';
import { useToast } from '@chakra-ui/react';

import UIContext, { UIContextType } from 'contexts/ui';
import { Handler } from 'types/handler';

const UIProvider = ({ children }: { children: JSX.Element }) => {
	const toast = useToast();

	const uiContextValue: UIContextType = {
		// By default it toasts when res.status is 'error'.
		handleToast: (res: Handler<unknown>, showIfSuccess = false, showIfNotSuccess = true) => {
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
