import { createContext, useContext } from 'react';

import { RequestResponse } from 'utils/handleRequest';

type UIContextType = {
	requestResponseToast: (res: RequestResponse<unknown>, showIfSuccess?: boolean, showIfNotSuccess?: boolean) => void;
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
