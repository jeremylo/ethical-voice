import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import AddIcon from '@material-ui/icons/Add';
import BarChartIcon from '@material-ui/icons/BarChart';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import PeopleIcon from '@material-ui/icons/People';
import SettingsVoiceIcon from '@material-ui/icons/SettingsVoice';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

export const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    navList: {
        '& .MuiListItem-gutters': {
            paddingLeft: '24px'
        },
        '& .MuiListSubheader-inset': {
            paddingLeft: '80px'
        },
    }
}));

export default function Sidebar({ open, handleDrawerClose }) {
    const classes = useStyles();

    return <Drawer
        variant="permanent"
        classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
    >
        <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
                <ChevronLeftIcon />
            </IconButton>
        </div>
        <Divider />
        <List className={classes.navList}>
            <ListItem button component={Link} to="/">
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/patients">
                <ListItemIcon>
                    <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="My patients" />
            </ListItem>
            <ListItem button component={Link} to="/refer">
                <ListItemIcon>
                    <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Refer a patient" />
            </ListItem>
            <ListItem button component={Link} to="/submissions">
                <ListItemIcon>
                    <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary="Submissions" />
            </ListItem>
            <ListItem button component={Link} to="/tests">
                <ListItemIcon>
                    <SettingsVoiceIcon />
                </ListItemIcon>
                <ListItemText primary="Speaking tests" />
            </ListItem>
            <ListItem button component={Link} to="/export">
                <ListItemIcon>
                    <ImportExportIcon />
                </ListItemIcon>
                <ListItemText primary="Export data" />
            </ListItem>
            <ListItem button component={Link} to="/sros">
                <ListItemIcon>
                    <AccessibilityNewIcon />
                </ListItemIcon>
                <ListItemText primary="SRO management" />
            </ListItem>
            {/* <ListItem button component={Link} to="/">
                <ListItemIcon>
                    <LayersIcon />
                </ListItemIcon>
                <ListItemText primary="Integrations" />
            </ListItem> */}
        </List>
        {/* <Divider />
        <List className={classes.navList}>
            <ListSubheader inset>Saved reports</ListSubheader>
            <ListItem button>
                <ListItemIcon>
                    <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="1" />
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="2" />
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="3" />
            </ListItem>
        </List> */}
    </Drawer>;
}
