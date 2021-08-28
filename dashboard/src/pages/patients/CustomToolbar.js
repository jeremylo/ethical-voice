import {
    GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector,
    GridToolbarExport, GridToolbarFilterButton
} from '@material-ui/data-grid';


export default function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport />
        </GridToolbarContainer>
    );
}
