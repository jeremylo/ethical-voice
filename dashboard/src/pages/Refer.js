import { Typography } from '@material-ui/core';
import NewReferral from './patients/NewReferral';
import Referrals from './patients/Referrals';
import { useForceLogin } from './utils';

export default function Refer() {
    useForceLogin();

    return (<>
        <Typography variant="h4">Referrals</Typography>
        <br />
        <NewReferral />
        <br /><br />
        <Referrals />
    </>);
}
