import { Typography } from '@material-ui/core';
import NewReferral from './patients/NewReferral';
import Referrals from './patients/Referrals';


export default function Refer() {
    return (<>
        <Typography variant="h4">Referrals</Typography>
        <br />
        <NewReferral />
        <br /><br />
        <Referrals />
    </>);
}
