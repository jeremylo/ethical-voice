import { Paper } from '@material-ui/core';
import { VictoryBoxPlot, VictoryChart, VictoryHistogram, VictoryLabel } from 'victory';
import theme from './chartTheme';
import { VictoryZoomContainer } from './zoom-container';



export default function Distribution({
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

            <VictoryBoxPlot
                data={data.map(datum => ({ x: 1, y: datum }))}
                horizontal
                labels
                labelOrientation="top"
                height={50}
            />
        </Paper >
    );
}
