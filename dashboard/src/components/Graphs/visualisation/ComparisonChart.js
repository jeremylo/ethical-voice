import { Paper } from '@material-ui/core';
import { linearRegression, linearRegressionLine, rSquared } from 'simple-statistics';
import { VictoryAxis, VictoryChart, VictoryLabel, VictoryLine, VictoryScatter } from 'victory';
import theme from './chartTheme';
import { VictoryZoomContainer } from './zoom-container';

const round4dp = (x) => Math.round((x + Number.EPSILON) * 10000) / 10000;

export default function ComparisonChart({
    title,
    data,
    domain,
    xLabel,
    yLabel
}) {
    const pairs = data.map(({ x, y }) => ([x, y]));
    const regressionLine = linearRegressionLine(linearRegression(pairs));
    const r2 = round4dp(rSquared(pairs, regressionLine));

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
                }
                padding={{ top: 40, bottom: 45, right: 10, left: 60 }}
            >

                {xLabel && <VictoryAxis
                    axisLabelComponent={<VictoryLabel dy={4} />}
                    label={xLabel}
                />}

                {yLabel && <VictoryAxis
                    dependentAxis
                    axisLabelComponent={<VictoryLabel dy={-16} />}
                    label={yLabel}
                />}

                {/* SVG: 450 x 300 */}
                <VictoryLabel text={title} x={225} y={20} textAnchor="middle" />

                {/* Interpolation */}
                <VictoryLine
                    interpolation="bundle" data={data}
                    style={{ data: { stroke: "#8bb9dd" } }}
                />

                {/* Linear regression */}
                <VictoryLine
                    y={(d) => regressionLine(d.x)}
                    style={{ data: { stroke: "#e7bd42", strokeDasharray: "8,4" } }}
                />
                <VictoryLabel text={`r^2=${r2}`} x={5} y={294} style={{ fill: "#e7bd42" }} />

                {/* Data */}
                <VictoryScatter data={data}
                    size={2}
                    style={{ data: { fill: "#00e5ff" } }}
                />

            </VictoryChart>
        </Paper >
    );
}
