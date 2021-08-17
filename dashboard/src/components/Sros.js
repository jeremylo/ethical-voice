import { Typography } from '@material-ui/core';
import RegisteredSros from './sros/RegisteredSros';


export default function Sros() {
    return (<>
        <Typography variant="h4">Senior responsible officers</Typography>
        <Typography variant="h5">Registered senior responsible officers</Typography>
        <RegisteredSros />
        <br />
        <Typography variant="h5">Invite new senior responsible officer</Typography>
        <br />
        <Typography variant="h5">Transfer patients</Typography>
    </>);
}
