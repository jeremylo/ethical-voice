import Fab from '@material-ui/core/Fab';
import { Mic, Stop } from '@material-ui/icons';
import React, { useState } from 'react';


export default function ToggleButton({ disabled, onStart, onStop }) {
  const [standby, setStandby] = useState(true);

  function toggle() {
    setStandby(!standby);
    if (standby) {
      onStart();
    } else {
      onStop();
    }
  }

  return (
    <Fab
      color={standby ? 'primary' : 'secondary'}
      disabled={disabled}
      onClick={toggle}
      size="large"
      variant="extended"
    >
      {standby ? <Mic fontSize="large" /> : <Stop fontSize="large" />}
      {standby ? 'Start' : 'Stop'}
    </Fab>
  );
}
