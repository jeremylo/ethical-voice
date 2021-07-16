

import { Container, Divider, List, ListItem, ListItemText, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    header: {
        paddingTop: "1rem",
        paddingBottom: "0.5rem",
    }
}));

export default function Settings() {
    const classes = useStyles();

    return (
        <>
            <Container maxWidth="sm" className={classes.header}>
                <Typography variant="h5">
                    Settings
                </Typography>
            </Container>

            <List>
                <Divider />
                <ListItem>
                    <ListItemText primary="Reference ID" secondary="123456789" />
                </ListItem>
                <Divider />
                <ListItem button>
                    <ListItemText primary="Email" secondary="jeremy@example.com" />
                </ListItem>
                <Divider />
                <ListItem button>
                    <ListItemText primary="Password" secondary="Click to update" />
                </ListItem>
                <Divider />
                <ListItem button>
                    <ListItemText primary="Outward Postcode" secondary="SW1" />
                </ListItem>
                <Divider />
                <ListItem button>
                    <ListItemText primary="About this app" />
                </ListItem>
                <Divider />
            </List>
        </>
    )
}
