import React, { ChangeEvent, useState } from 'react';
import { Player } from '../../types/Player';
import BackArrowIcon from '../Icons/BackArrowIcon';

interface SettingsCardProps {
  setSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPlayers: React.Dispatch<
    React.SetStateAction<{
      playerOne: Player;
      playerTwo: Player;
    }>
  >;
}

const SettingsCard = ({ setSettingsOpen, setPlayers }: SettingsCardProps) => {
  const [playerOneName, setPlayerOneName] = useState('');
  const [playerTwoName, setPlayerTwoName] = useState('');

  const handleSubmit = () => {
    setPlayers((prev) => {
      return {
        playerOne: {
          name: playerOneName.toLowerCase(),
          score: prev.playerOne.score
        },
        playerTwo: {
          name: playerTwoName.toLowerCase(),
          score: prev.playerTwo.score
        }
      };
    });
  };

  return (
    <div className="bg-white rounded-xl w-96 p-8">
      <div className="pb-8 flex justify-between items-center">
        <span className="text-2xl  font-light">Ustawienia</span>
        <BackArrowIcon cb={() => setSettingsOpen(false)} />
      </div>
      <div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="p1">
            Imię pierwszego gracza
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="p1"
            type="text"
            placeholder="Imię"
            value={playerOneName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPlayerOneName(e.currentTarget.value)}
          />
        </div>
        <div className="mb-8">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="p2">
            Imię drugiego gracza
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="p2"
            type="text"
            placeholder="Imię"
            value={playerTwoName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPlayerTwoName(e.currentTarget.value)}
          />
        </div>
        <div className="flex w-full justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 w-full rounded transition-colors"
            onClick={() => {
              setSettingsOpen(false);
              handleSubmit();
            }}
          >
            Zapisz
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsCard;
