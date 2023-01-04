export const isStrNumber = (data: string) => {
	if (data !== null && data !== '') {
		return !isNaN(Number(data));
	}
	return false;
};
