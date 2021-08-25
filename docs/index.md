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

### Measures of utterance fluency

_While tangiential to the project, I have included this section out of my own interest and for the benefit of any interested readers._

> **Terminology**
>
> *syllable*: an organisational unit of a sequence of speech sounds, from which words are formed, e.g. the word 'computer' is formed from three syllables (`com-pu-ter`).
>
> *pause*: a momentary silent gap in someone's speech
>
> *duration*: the duration for which someone speaks
>
> *phonation time* or *speaking time*: the duration, excluding any silent pauses

It stands to reason that patients who experience greater degrees of breathlessness may find speaking more difficult, so it would be interesting to collect some data to test this hypothesis.

There are several different aspects to fluency [1]:
- **cognitive fluency** -- the ease of converting thoughts from cognitive processes into speech
- **perceived fluency** -- a _listener's_ subjective impression of someone's cognitive fluency
- **utterance fluency** -- the aspects of fluency that are objectively measurable acoustically, such as speed and pausing

For this project, I am most concerned with utterance fluency (although there is certainly some overlap between the categories).

*Note*: it is generally preferable to consider _syllables_ rather than whole _words_ when trying to evaluate how fast someone is speaking. As an example, the phrase "thoroughly thoroughly thoroughly" takes considerably more effort to say than the phrase "two two two", but while the former is 9 syllables and the latter only 3, they are both contain precisely 3 words.

In their investigation of fluency in long-term second-language speakers of English, Lahmann, Steinkrauss and Schmid used the speech analysis software Praat to calculate the following measures [2] of **speed fluency** (related to the speed at which one speaks):
- **speech rate**: number of syllables divided by the duration
- **articulation rate**: number of syllables divided by phonation time
- **average syllable duration** (ASD): phonation time divided by the number of syllables (the reciprocal of articulation rate)

Here, they defined a pause as lasting a minimum of 250ms for the purposes of calculating phonation time. This was also the definition used in _Jong et al_ [3].

Speed is not the only characteristic of fluency; linguists also study **breakdown fluency** (related to pauses that interrupt the flow of speech) and **repair fluency** (related to hesitation and corrective reformulations speakers make as they speak) [1]. Examples of these measures include the following:
- *Breakdown fluency*
  - **Mean pause duration**: the total duration of pauses divided by the number of pauses
  - **Mean pause rate**: the mean number of pauses over a given time period
- *Repair fluency*
  - **Mean rate of repair measures**: the mean number of repetitions whether complete or partial, hesitations, false starts, reformulations and so on over a given time period (some authors use the phonation time rather than the total duration for this [4])
  - **Mean rate of filled pauses**: i.e. time spent saying "ummm" or "uhhh" over a given time period (some authors use the phonation time rather than the total duration for this [4])

Furthermore, there are also composite measures that combine elements of all three characteristics of utterance fluency outlined above, e.g.
- **Mean length of runs**: the mean number of syllables between pauses
- **Phonation time ratio**: the phonation time as a proportion of the total duration

*Side-note*: in dialogues, measures such as the number of turns, pauses between turns and interruptions, as well as conversational overlap may be studied as well!

For my project, considering the limitations of the low-power mobile devices upon which my progressive web app is expected to run, my priority will be to measure speech rate (number of syllables divided by the duration); however, I would love to see articulation rate and a measure of breakdown fluency, such as mean pause rate as defined above, implemented in the future!

#### References

[1] P. Tavakoli, “Fluency in monologic and dialogic task performance: Challenges in defining and measuring L2 fluency,” International Review of Applied Linguistics in Language Teaching, vol. 54, no. 2, pp. 133-150, 2016.

[2] C. Lahmann, R. Steinkrauss and M. Schmid, “Speed, breakdown, and repair: An investigation of fluency in long-term second-language speakers of English,” International Journal of Bilingualism, vol. 15, 2015.

[3] N. H. de Jong, M. P. Steinel, A. F. Florijn, R. Schoonen, and J. H. Hulstijn, “FACETS OF SPEAKING PROFICIENCY,” Studies in Second Language Acquisition, vol. 34, no. 1, pp. 5–34, 2012.

[4] N. H. d. Jong, “LANGSNAP Workshop: Analysis of fluency,” 10 April 2013. [Online]. Available: [http://langsnap.soton.ac.uk/linked_files/LANGSNAP_dejong.pdf](http://langsnap.soton.ac.uk/linked_files/LANGSNAP_dejong.pdf). [Accessed 24 August 2021].



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

