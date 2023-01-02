type Setting = {
	roomid?: string,
	isTTS?: string,
	voice?: string,
	direction?: 'top' | 'bottom',
	isFansMedal?: 'true' | 'false',
};

type DanmuItem = {
	key: string,
	type: DanmuType,
	data: any,
	isFansMedal?: 'true' | 'false',
};
