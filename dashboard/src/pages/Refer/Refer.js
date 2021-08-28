import { Typography } from '@material-ui/core';
import useForceLogin from '../../hooks/useForceLogin';
import NewReferral from './NewReferral';
import Referrals from './Referrals';

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
