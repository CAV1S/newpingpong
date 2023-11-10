import type { Player } from '../../types/Player';

enum COMMANDS {
  ADD_POINTS = 'dodaj',
  REMOVE_POINTS = 'cofnij',
  TELL_SCORE = 'wynik'
}

export const HandleVoiceCommands = (
  transcript: string,
  resetTranscript: () => void,
  playerOne: Player,
  playerTwo: Player,
  changePoints: (player: 'one' | 'two' | 'reset', options: { add: boolean }) => void
) => {
  const keywords = transcript.toLowerCase().split(' ');
  const result = keywords.some((v) => (Object.values(COMMANDS) as string[]).includes(v));
  console.log({ result, transcript, keywords });
  if (result && transcript !== '') {
    if (keywords.includes(playerOne.name) && keywords.includes(COMMANDS.ADD_POINTS)) {
      changePoints('one', { add: true });
      speak(`Dodano punkt ${playerOne.name}`);
      resetTranscript();
    } else if (keywords.includes(playerTwo.name) && keywords.includes(COMMANDS.ADD_POINTS)) {
      changePoints('two', { add: true });
      speak(`Dodano punkt ${playerTwo.name}`);
      resetTranscript();
    } else if (keywords.includes(playerOne.name) && keywords.includes(COMMANDS.REMOVE_POINTS)) {
      try {
        changePoints('one', { add: false });
        speak(`Odebrano punkt dla gracza ${playerOne.name}`);
      } catch (e) {
        speak(`Gracz ${playerOne.name} ma już 0 punktów`);
      }
      resetTranscript();
    } else if (keywords.includes(playerTwo.name) && keywords.includes(COMMANDS.REMOVE_POINTS)) {
      try {
        changePoints('two', { add: false });
        speak(`Odebrano punkt dla gracza ${playerTwo.name}`);
      } catch (e) {
        speak(`Gracz ${playerTwo.name} ma już 0 punktów`);
      }
      resetTranscript();
    } else if (keywords.includes(COMMANDS.TELL_SCORE)) {
      speak(`${playerOne.name} ${playerOne.score} ${playerTwo.name} ${playerTwo.score}`);
      resetTranscript();
    }
    //resetTranscript();
  }
};

const speak = (text: string) => {
  const msg = new SpeechSynthesisUtterance();
  msg.text = text;
  window.speechSynthesis.speak(msg);
};