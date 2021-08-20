import { Paper } from '@material-ui/core';
import { VictoryChart, VictoryHistogram, VictoryLabel } from 'victory';
import theme from './chartTheme';
import { VictoryZoomContainer } from './zoom-container';



export default function Histogram({
    title,
    data,
    domain
}) {
    return (
        <Paper elevation={1} variant="outlined">
            <VictoryChart
                theme={theme}
                domainPadding={10}
                domain={domain}
                style={{
                    parent: {
                        paddingTop: 0
                    }
                }}
                containerComponent={
                    <VictoryZoomContainer />
                }>

                <VictoryLabel text={title} x={225} y={30} textAnchor="middle" />

                {/* Data */}
                <VictoryHistogram
                    data={data.map(datum => ({ x: datum }))}
                    bins={20}
                />

            </VictoryChart>
        </Paper >
    );
}
