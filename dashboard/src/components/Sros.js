import { Typography } from '@material-ui/core';
import Invite from './sros/Invite';
import RegisteredSros from './sros/RegisteredSros';


export default function Sros() {
    return (<>
        <Typography variant="h4">Senior responsible officers</Typography>
        <Typography variant="h5">Registered senior responsible officers</Typography>
        <RegisteredSros />
        <br />
        <Typography variant="h5">Invite new senior responsible officer</Typography>
        <Invite />
        <br />
        {/* <Typography variant="h5">Transfer patients</Typography> */}
        <br /><br /><br /><br /><br /><br /><br />
    </>);
}
