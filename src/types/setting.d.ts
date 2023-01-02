type Setting = {
	roomid?: string,
	isTTS?: string,
	voice?: string,
	direction?: 'top' | 'bottom',
};

type DanmuItem = {
	key: string,
	type: DanmuType,
	data: any,
};
