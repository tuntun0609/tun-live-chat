import { useEffect, useState } from 'react';
import { getVoices } from '../tts';

export const useSpeechSynthesisVoices = () => {
	const [voicesList, setVoicesList] = useState<SpeechSynthesisVoice[]>();
	useEffect(() => {
		const init = async () => {
			if (typeof speechSynthesis === 'undefined') {
				return;
			}
			const voicesList = await getVoices();
			setVoicesList(voicesList);
		};

		init();
	}, []);
	return voicesList;
};
