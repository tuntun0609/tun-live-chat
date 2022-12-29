// 获取可以转换的声音列表
export const getVoices = (): Promise<SpeechSynthesisVoice[]> => {
	return new Promise((resolve) => {
		let id: number | undefined;
		id = setInterval(() => {
			const list = window.speechSynthesis.getVoices().filter((item) => (
				item.lang.includes('zh-CN')
			));
			if (list.length !== 0) {
				resolve(list);
				clearInterval(id);
			}
		}, 0);
	});
}