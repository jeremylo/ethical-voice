import { Paper } from '@material-ui/core';
import { VictoryChart, VictoryLabel, VictoryLine, VictoryScatter } from 'victory';
import theme from './chartTheme';
import { VictoryZoomContainer } from './zoom-container';



export default function ComparisonChart({
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
                    <VictoryZoomContainer
                    // zoomDimension="x"
                    />
                }>

                <VictoryLabel text={title} x={225} y={30} textAnchor="middle" />

                {/* Data */}
                <VictoryLine
                    interpolation="bundle" data={data}
                    style={{ data: { stroke: "#8bb9dd" } }}
                />

                <VictoryScatter data={data}
                    size={2}
                    style={{ data: { fill: "#00e5ff" } }}
                />

            </VictoryChart>
        </Paper >
    );
}
