import { Typography } from '@material-ui/core';
import { useForceLogin } from '../utils/validation';
import NewReferral from './patients/NewReferral';
import Referrals from './patients/Referrals';

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
