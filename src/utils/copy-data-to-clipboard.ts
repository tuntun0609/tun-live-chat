import { isNumber, isString } from 'lodash';

export const copyDataToClipboard = async (
	data: any,
) => {
	if (isString(data) || isNumber(data)) {
		return await navigator.clipboard.writeText(data.toString());
	}
	return await navigator.clipboard.write(data);
};
