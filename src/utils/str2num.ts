import { isStrNumber } from './index';

export const str2num = (text: string | number | undefined) => {
	if (typeof text === 'string') {
		if (isStrNumber(text)) {
			return parseInt(text, 10);
		}
		return undefined;
	} else if (typeof text === 'number') {
		return text;
	}
	return undefined;
};
