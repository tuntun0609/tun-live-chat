const storage = window.localStorage;

export const storageGet = (key: string, defaultValue: any = null) => {
	const text = storage.getItem(key);
	try {
		return text ? JSON.parse(text) : defaultValue;
	} catch (error) {
		return defaultValue;
	}
};

export const storageSet = (key: string, value: any) => storage.setItem(key, JSON.stringify(value));
