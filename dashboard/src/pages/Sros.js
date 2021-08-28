import { Typography } from '@material-ui/core';
import { useForceLogin } from '../utils/utils';
import Invite from './sros/Invite';
import RegisteredSros from './sros/RegisteredSros';
import Transfer from './sros/Transfer';


export default function Sros() {
    useForceLogin();

    return (<>
        <Typography variant="h4">Senior responsible officers</Typography>
        <Typography variant="h5">Registered senior responsible officers</Typography>
        <RegisteredSros />
        <br />
        <Typography variant="h5">Invite new senior responsible officer</Typography>
        <Invite />
        <br />
        <Typography variant="h5">Transfer patients to a different senior responsible officer</Typography>
        <Transfer />
        <br /><br /><br /><br /><br /><br /><br />
    </>);
}
