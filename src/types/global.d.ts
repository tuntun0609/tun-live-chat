type Setting = {
	roomid?: string,
	isTTS?: string,
	voice?: string,
	direction?: 'top' | 'bottom',
	isFansMedal?: 'true' | 'false',
	isDebug?: 'true' | 'false',
	removeDelay?: string,
	offset?: string,
	speed?: string,
	nameColor?: string,
	isCors?: 'true' | 'false',
	isAnimation?: 'true' | 'false',
	isGift?: 'true' | 'false',
};

type DanmuItem = {
	key: string,
	type: DanmuType,
	data: any,
	setting?: Setting,
	isFansMedal?: 'true' | 'false',
};
