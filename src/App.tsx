import { useEffect, useState } from 'react';
import './App.css';

function App() {
	const [word, setWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectVoice, setSelectVoice] = useState(0);
  const [voicesList, setVoicesList] = useState<SpeechSynthesisVoice[]>([]);

	const getVoices = (): Promise<SpeechSynthesisVoice[]> => {
		return new Promise(function (resolve) {
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

  useEffect(() => {
    const init = async () => {
      if (typeof speechSynthesis === 'undefined') {
        return;
      }
      const voicesList = await getVoices();
      setVoicesList(voicesList);
      console.log(voicesList);
    }
    init();
  }, []);

	const onTTS = async () => {
    if (word) {
      setLoading(true);
      const msg = new SpeechSynthesisUtterance(word);
      msg.voice = voicesList[selectVoice];
      speechSynthesis.speak(msg);
      msg.onstart = () => {
        setLoading(false);
      };
    }
	};

	return (
		<div>
			<input
				value={word}
				onChange={(e) => {
					setWord(e.target.value);
				}}></input>
			<button onClick={onTTS}>tts</button>
      <select
        onChange={(e) => {
          setSelectVoice(e.target.selectedIndex);
        }}
      >
        {
          voicesList.map(voice => (
            <option key={voice.name}>{voice.name}</option>
          ))
        }
      </select>
      {
        loading ? 'loading' : ''
      }
		</div>
	);
}

export default App;
