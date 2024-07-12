import React from 'react';
import { useToast } from '@chakra-ui/react';

import UIContext, { UIContextType } from 'contexts/ui';
import { Handler } from 'types/handler';
import { useNavigate } from 'react-router-dom';

const UIProvider = ({ children }: { children: JSX.Element }) => {
	const toast = useToast();
	const navigate = useNavigate();

	const uiContextValue: UIContextType = {
		// By default it toasts when res.status is 'error'.
		handleToast: (res: Handler<unknown>, showIfSuccess = false, showIfNotSuccess = true, showIfAuthError = false, overrideMessage = undefined) => {
			if (!showIfAuthError && res.code === 401) {
				navigate('/connexion');
			} else if (
				(showIfSuccess && res.status === 'success') ||
				(showIfNotSuccess && res.status !== 'success') ||
				(showIfAuthError && res.code === 401)
			) {
				toast({
					status: res.status,
					title: overrideMessage || res.message,
					description: res.subMessage,
					duration: 9000,
					isClosable: true,
				});
			}
		},
	};

	return <UIContext.Provider value={uiContextValue} children={children} />;
};

export default UIProvider;
