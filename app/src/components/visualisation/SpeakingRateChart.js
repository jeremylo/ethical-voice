import { Paper } from '@material-ui/core';
import React from 'react';
import { max, sampleStandardDeviation } from 'simple-statistics';
import { VictoryChart, VictoryLabel, VictoryLine, VictoryScatter, VictoryTheme, VictoryZoomContainer } from 'victory';


function calculateCumulativeMovingAverage(data) {
    let newData = [data[0]];
    for (let i = 1; i < data.length; ++i) {
        newData.push({
            x: data[i].x,
            y: (newData.at(-1).y * i + data[i].y) / (i + 1)
        })
    }
    return newData;
}

function shiftData(data, shift) {
    return data.map(datum => ({ x: datum.x, y: datum.y + shift }))
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

const syllableRateData = [...Array(10).keys()].map(i => ({
    x: new Date(2021, getRandomInt(0, 11), getRandomInt(0, 27)), y: getRandomInt(220, 340)
})).sort((a, b) => a.x - b.x);

console.log(syllableRateData)

/*const syllableRateData = [
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
];*/

export default function SpeakingRateChart({ zoomDomain, setZoomDomain }) {
    const ys = syllableRateData.map(datum => datum.y);
    const maximum = max(ys);
    const stddev = sampleStandardDeviation(ys);
    const cumulativeRollingAverageData = calculateCumulativeMovingAverage(syllableRateData);

    return (
        <Paper elevation={1} variant="outlined">
            <VictoryChart
                theme={VictoryTheme.grayscale}
                scale={{ x: "time" }}
                domainPadding={10}
                domain={{ y: [0, maximum + stddev] }}
                style={{
                    parent: {
                        paddingTop: 0
                    }
                }}
                containerComponent={
                    <VictoryZoomContainer
                        zoomDimension="x"
                        zoomDomain={zoomDomain}
                        onZoomDomainChange={setZoomDomain}
                    />
                }>

                <VictoryLabel text="Speaking rate (syllables per minute)" x={225} y={30} textAnchor="middle" />

                {/* "Ground truth" +/- std devs */}
                <VictoryLine
                    interpolation="catmullRom" data={cumulativeRollingAverageData}
                    style={{ data: { stroke: "#d2e9af " } }}
                />
                <VictoryLine
                    interpolation="catmullRom" data={shiftData(cumulativeRollingAverageData, stddev)}
                    style={{ data: { stroke: "#fed8b1" } }}
                />
                <VictoryLine
                    interpolation="catmullRom" data={shiftData(cumulativeRollingAverageData, -stddev)}
                    style={{ data: { stroke: "#fed8b1" } }}
                />
                <VictoryLine
                    interpolation="catmullRom" data={shiftData(cumulativeRollingAverageData, 3 * stddev)}
                    style={{ data: { stroke: "#ffcccb" } }}
                />
                <VictoryLine
                    interpolation="catmullRom" data={shiftData(cumulativeRollingAverageData, -3 * stddev)}
                    style={{ data: { stroke: "#ffcccb" } }}
                />

                {/* Data */}
                <VictoryLine
                    interpolation="bundle" data={syllableRateData}
                    style={{ data: { stroke: "#00e5ff" } }}
                />

                <VictoryScatter data={syllableRateData}
                    size={5}
                    style={{ data: { fill: "#00e5ff" } }}
                />

            </VictoryChart>
        </Paper>
    );
}
