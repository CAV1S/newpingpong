import React, { ReactElement, useState } from 'react';
import ScoreCard from './components/ScoreCard/ScoreCard';
import SettingsCard from './components/SettingsCard/SettingsCard';
import type { Player } from './types/Player';

function App(): ReactElement {
  const [players, setPlayers] = useState<{
    playerOne: Player;
    playerTwo: Player;
  }>({ playerOne: { name: '', score: 0 }, playerTwo: { name: '', score: 0 } });

  const [settingsOpen, setSettingsOpen] = useState(true);

  if (settingsOpen) return <SettingsCard setSettingsOpen={setSettingsOpen} setPlayers={setPlayers} />;

  return <ScoreCard players={players} setPlayers={setPlayers} setSettingsOpen={setSettingsOpen} />;
}

export default App;
