---
layout: page
title: My Data Documentation
---


# My Data: a breathlessness data collection and visualisation project

## Project background

This is the extended documentation for [Jeremy Lo Ying Ping](https://jezz.me/)'s _UCL Computer Science_ summer research project, which ran from June to August 2021 and was supervised by Prof Joseph Connor, Prof Dean Mohamedally and Prof Graham Roberts.

The principal aim of the project was to develop a proof-of-concept progressive web app for patients to collect and visualise both speech data -- using an offline, on-device speech recognition model -- and additional self-reported health data, as may be useful for analysing and tracking symptoms of breathlessness. This data may then be shared -- only at patients' behest to ensure they maintain control over their data -- with their associated senior responsible officer to support research.

The hope is that this could provide a more ethical framework for respiratory disease researchers or clinicians to gather invaluable speech and self-reported data from consenting patients.

## Demo

The app is currently live at [https://mydata.jezz.me/](https://mydata.jezz.me/). There is an anonymous login mode whereby anyone can test out the core functionality of the progressive web app without having been referred by a senior responsible officer of the demo system.

## Research

### Measures of fluency

> **Terminology**
>
> *syllable*: an organisational unit of a sequence of speech sounds, from which words are formed, e.g. the word 'computer' is formed from three syllables (`com-pu-ter`).
>
> *pause*: a momentary silent gap in someone's speech
>
> *duration*: the duration for which someone speaks
>
> *phonation time* or *speaking time*: the duration, excluding any silent pauses



## System architecture design

The project is formed of the following main components:
- a React-based progressive web app for patients ("the app");
- an Express.js-based API powering the app;
- a React-based dashboard for senior responsible officers to view and manage patient and submission data ("the dashboard");
- an Express.js-based API powering the dashboard;
- a MariaDB database server to store data (important tables are encrypted at rest);
- a Redis server for session token storage; and
- a Caddy server to serve static app and dashboard files, and reverse proxy API requests to their respective APIs.

![system architecture diagram](system-architecture.png)


## Metrics gathered

The focus of this project has been to devise a way to gather the following metrics:
- **syllable rate**: a measure of how many syllables are spoken per minute (and a hypothesised potential proxy for breathlessness)
- **word rate**: a (less preferred) measure of how many words are spoken per minute
- **sputum colour**: a 5-point self-reported measure of a patient's [sputum colour](https://www.nbt.nhs.uk/sites/default/files/attachments/COPD%20Rescue%20Pack_NBT002760.pdf)
  - 1 - white
  - 2 - cream
  - 3 - yellow
  - 4 - pale green
  - 5 - green
- **wellbeing**: a self-reported wellbeing rating from 1 (low) to 10 (high)
- **MRC dyspnoea score**: a self-reported measure using the MRC dyspnoea scale
  - 1 - "I am not troubled by breathlessness, except on strenuous exertion."
  - 2 - "I am short of breath when hurrying on the level or walking up a slight hill."
  - 3 - "I have to walk slower than most people on the level and stop after a mile or so (or after 15 minutes) on the level at my own pace."
  - 4 - "I have to stop for breath after walking about 100 yards (or after a few minutes) on the level."
  - 5 - "I am too breathless to leave the house, or breathless after undressing."

