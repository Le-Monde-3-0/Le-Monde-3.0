const loadFromLocalStorage = <Type>(itemName: string, defaultValue: Type): Type => {
	const item = localStorage.getItem(itemName);
	if (!item) return defaultValue;
	return JSON.parse(item);
};

export default loadFromLocalStorage;
