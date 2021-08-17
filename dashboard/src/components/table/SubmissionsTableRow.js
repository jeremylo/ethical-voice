import { Box, Collapse, IconButton, TableHead } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import React from 'react';

function SubmissionMetadataTable({ row }) {
    return (
        <TableContainer component={Paper}>
            <Table size="small" aria-label="metadata">
                <TableHead>
                    <TableRow>
                        <TableCell>Metadata key</TableCell>
                        <TableCell>Metadata value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.entries(row.metadata).map(([k, v]) => (
                        <TableRow key={`metadata-${row.submission_id}-${k}`}>
                            <TableCell component="th" scope="row">
                                {k}
                            </TableCell>
                            <TableCell>{v}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

export default function SubmissionsTableRow({ row }) {
    const classes = useRowStyles();
    const [open, setOpen] = React.useState(false);

    return (<>
        <TableRow hover tabIndex={-1} className={classes.root}>
            <TableCell>
                <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </TableCell>
            <TableCell component="th" scope="row">{row.submission_id}</TableCell>
            <TableCell align="left">{row.reference_id}</TableCell>
            <TableCell align="left">{row.test_type_id}</TableCell>
            <TableCell align="left">{row.outward_postcode}</TableCell>
            <TableCell align="left">{new Date(row.created_at).toLocaleString()}</TableCell>
            <TableCell align="left">{new Date(row.received_at).toLocaleString()}</TableCell>
        </TableRow>
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box margin={1}>
                        {/* <Typography variant="h6" gutterBottom component="div">
                            Submission metadata
                        </Typography> */}
                        <SubmissionMetadataTable row={row} />
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    </>);
}
