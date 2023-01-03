// 十进制颜色值转十六进制
export const dec2hex = (dec: number) => {
	let hex = dec.toString(16);
	for (let i = hex.length; i < 6; i++) {
		hex += '0';
	}
	return hex;
};
