import { Link as MuiLink, Typography } from "@material-ui/core";

export default function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <MuiLink color="inherit" href="https://jezz.me/">
                Jeremy Lo Ying Ping
            </MuiLink>{' '}
            {new Date().getFullYear()}
        </Typography>
    );
};
