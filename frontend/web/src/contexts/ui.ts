import { createContext, useContext } from 'react';

import { Handler } from 'types/handler';

type UIContextType = {
	handleToast: (
		res: Handler<unknown>,
		showIfSuccess?: boolean,
		showIfNotSuccess?: boolean,
		showIfAuthError?: boolean,
		overrideMessage?: string,
	) => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

const useUIContext = (): UIContextType => {
	const context = useContext(UIContext);
	if (!context) throw new Error('Context used outside of provider.');
	return context;
};

export type { UIContextType };
export { useUIContext };
export default UIContext;
