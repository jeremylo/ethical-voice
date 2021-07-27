import { Container, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { mean, sampleStandardDeviation } from 'simple-statistics';
import { VictoryChart, VictoryLine, VictoryScatter, VictoryTheme } from 'victory';


function calculateCumulativeRollingAverage(data) {
    let newData = [data[0]];
    for (let i = 1; i < data.length; ++i) {
        newData.push({
            x: data[i].x,
            y: (newData.at(-1).y * i + data[i].y) / (i + 1)
        })
    }
    return newData;
}

function calculateRollingAverage(data) {
    let newData = [data[0], {
        x: data[1].x,
        y: (data[0].y + data[1].y) / 2
    }];
    for (let i = 2; i < data.length; ++i) {
        newData.push({
            x: data[i].x,
            y: (newData.at(-1).y + newData.at(-2).y + data[i].y) / 3
        })
    }
    return newData;
}


const syllableRateData = [
    { x: new Date(2021, 5, 14), y: 288 },
    { x: new Date(2021, 5, 21), y: 228 },
    { x: new Date(2021, 5, 28), y: 270 },
    { x: new Date(2021, 6, 5), y: 330 },
    { x: new Date(2021, 6, 9), y: 348 },
    { x: new Date(2021, 6, 12), y: 294 },
    { x: new Date(2021, 6, 17), y: 186 },
    { x: new Date(2021, 6, 19), y: 166 },
    { x: new Date(2021, 6, 24), y: 234 },
    { x: new Date(2021, 6, 26), y: 222 },
];

/* const cartesianInterpolations = [
    "cardinal",
    "catmullRom",
    "linear",
    "monotoneX",
    "monotoneY",
    "natural",
]; */

export default function SpeakingRateChart() {
    const ys = syllableRateData.map(datum => datum.y);

    const avg = mean(ys);
    const std = sampleStandardDeviation(ys);

    return (
        <Paper elevation={1}>
            <Container>
                <Typography variant="h6">Speaking rate (syllables per minute)</Typography>
            </Container>

            <VictoryChart theme={VictoryTheme.grayscale} scale={{ x: "time" }} domainPadding={20} domain={{ y: [0, 400] }}>
                <VictoryLine
                    interpolation="linear" data={syllableRateData}
                    style={{ data: { stroke: "#00e5ff" } }}
                />
                <VictoryScatter data={syllableRateData}
                    size={5}
                    style={{ data: { fill: "#00e5ff" } }}
                />

                <VictoryLine
                    interpolation="linear" data={calculateCumulativeRollingAverage(syllableRateData)}
                    style={{ data: { stroke: "#ccc" } }}
                />
                <VictoryLine
                    interpolation="linear" data={calculateRollingAverage(syllableRateData)}
                    style={{ data: { stroke: "#aaa" } }}
                />

                <VictoryLine data={[
                    { x: syllableRateData[0].x, y: avg },
                    { x: syllableRateData.at(-1).x, y: avg },
                ]} />

                <VictoryLine data={[
                    { x: syllableRateData[0].x, y: avg + std },
                    { x: syllableRateData.at(-1).x, y: avg + std },
                ]} />
                <VictoryLine data={[
                    { x: syllableRateData[0].x, y: avg - std },
                    { x: syllableRateData.at(-1).x, y: avg - std },
                ]} />

                <VictoryLine data={[
                    { x: syllableRateData[0].x, y: avg + 3 * std },
                    { x: syllableRateData.at(-1).x, y: avg + 3 * std },
                ]} />
                <VictoryLine data={[
                    { x: syllableRateData[0].x, y: avg - 3 * std },
                    { x: syllableRateData.at(-1).x, y: avg - 3 * std },
                ]} />


            </VictoryChart>
        </Paper>
    );
}
