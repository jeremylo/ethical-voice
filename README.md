# My Data: a breathlessness data collection and visualisation project

This repository contains [Jeremy Lo Ying Ping](https://jezz.me/)'s _UCL Computer Science_ summer research project, which ran from June to April 2021 and was supervised by Prof Joseph Connor, Prof Dean Mohamedally and Prof Graham Roberts.

The principal aim of the project was to develop a proof-of-concept progressive web app for patients to collect and visualise both speech data, using an offline, on-device speech recognition model, and additional self-reported health data -- as may be useful for analysing and tracking symptoms of breathlessness. This data may then be shared -- only at patients' behest to ensure they maintain control over their data -- with their associated senior responsible officer to support research.

The hope is that this could provide an ethical way for respiratory disease researchers or doctors to gather invaluable speech and self-reported data from supporting and consenting patients.

## Demo

The app is currently live at [https://mydata.jezz.me/](https://mydata.jezz.me/). There is an anonymous login mode whereby anyone can test out the core functionality of the progressive web app without having been referred by a senior responsible officer of the demo system.

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
  - 1 -- "I am not troubled by breathlessness, except on strenuous exertion."
  - 2 -- "I am short of breath when hurrying on the level or walking up a slight hill."
  - 3 -- "I have to walk slower than most people on the level and stop after a mile or so (or after 15 minutes) on the level at my own pace."
  - 4 -- "I have to stop for breath after walking about 100 yards (or after a few minutes) on the level."
  - 5 -- "I am too breathless to leave the house, or breathless after undressing."

**Note**: for the sake of this project, _syllable rate_ has been taken as a better measure of the rate someone is speaking than _word rate_ and has been used as the basis of visualising _speech rate_ and its deviations over time. The phrase "thoroughly thoroughly thoroughly" takes considerably more effort to say than the phrase "two two two", but while the former is 9 syllables and the latter only 3, they are both contain precisely 3 words.

## Project background, research & documentation

Further information beyond this `README` on the project may be found at the following link: [https://jeremylo.github.io/ethical-voice/](https://jeremylo.github.io/ethical-voice/)

### System architecture & Docker Compose structure

The project is formed of the following main components:
- a React-based progressive web app for patients ("the app");
- an Express.js-based API powering the app;
- a React-based dashboard for senior responsible officers to view and manage patient and submission data ("the dashboard");
- an Express.js-based API powering the dashboard;
- a MariaDB database server to store data (important tables are encrypted at rest);
- a Redis server for session token storage; and
- a Caddy server to serve static app and dashboard files, and reverse proxy API requests to their respective APIs.

![system architecture](./docs/system-architecture.png)

All of the different components of the project have been dockerised, spread across several containers:
- `app`: this container outputs an optimised production build of the app into a volume when it is built and ceases to run thereafter
- `api`: this container installs the necessary node modules and then runs the app API
- `dashboard`: this container outputs an optimised production build of the dashboard into a volume when it is built and ceases to run thereafter
- `dashboard-api`: this container installs the necessary node modules and then runs the dashboard API
- `redis`: this container runs the Redis server
- `db`: this container runs the MariaDB server
- `caddy`: this container runs the Caddy web and reverse-proxy server, serving static files from the built app and dashboard volumes on two separate domains and reverse-proxying /api/* requests to their respective APIs
- `adminer`: optionally in development, this container may be started running the database management web tool Adminer


## Configuration

### .env file options

The `.env` file is the principal means of configuring the app, dashboard and their respective APIs.

```env
MARIADB_ROOT_PASSWORD=PLEASE_RANDOMISE
MARIADB_USER=PLEASE_RANDOMISE
MARIADB_PASSWORD=PLEASE_RANDOMISE
MARIADB_DATABASE=mydata
MARIADB_HOST=db

BCRYPT_SALT_ROUNDS=14

APP_DOMAIN=mydata.jezz.me
APP_SESSION_COOKIE_NAME=APP_SESSION_ID
APP_REMEMBER_ME_COOKIE_NAME=REMEMBER_ME
APP_COOKIE_SECRET=PLEASE_RANDOMISE

DASHBOARD_DOMAIN=mydatadashboard.jezz.me
DASHBOARD_SESSION_COOKIE_NAME=DASHBOARD_SESSION_ID
DASHBOARD_COOKIE_SECRET=PLEASE_RANDOMISE
DASHBOARD_JWT_SECRET=PLEASE_RANDOMISE

REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=PLEASE_RANDOMISE

SENDGRID_API_KEY="PASTE_YOUR_SENDGRID_API_KEY_HERE"
```

Wherever `PLEASE_RANDOMISE` is listed above, please replace the string with a random string of characters before you run anything for development but especially for production.

- `MARIADB_ROOT_PASSWORD`: the root password of the MariaDB server (<= 79 characters)
- `MARIADB_USER`: the database user the applications should use (<= 79 characters)
- `MARIADB_PASSWORD`: the database password the applications should use (<= 79 characters)
- `MARIADB_DATABASE`: the name of the database (default: mydata)
- `MARIADB_HOST`: the host on which the MariaDB server is running (production: db, development: 127.0.0.1)
- `BCRYPT_SALT_ROUNDS`: the number of Bcrypt salt rounds to use in password hashing (default: 14)
- `APP_DOMAIN`: the domain on which the app is running
- `APP_SESSION_COOKIE_NAME`: the name of the app session cookie
- `APP_REMEMBER_ME_COOKIE_NAME`: the name of the app remember me cookie
- `APP_COOKIE_SECRET`: the secret used to sign all app API cookies
- `DASHBOARD_DOMAIN`: the domain on which the dashboard is running
- `DASHBOARD_SESSION_COOKIE_NAME`: the name of the dashboard session cookie
- `DASHBOARD_COOKIE_SECRET`: the secret used to sign all dashboard API cookies
- `DASHBOARD_JWT_SECRET`: the secret used to sign JSON web tokens generated
- `REDIS_HOST`: the host on which the redis server is running
- `REDIS_PORT`: the port on which the redis server is running
- `REDIS_PASSWORD`: the password the app and dashboard redis user should use
- `SENDGRID_API_KEY`: your own SendGrid API key required to send email


### Dashboard development .env file

In development, it may be useful to update the `dashboard/.env` configuration file.

```
PORT=3001
REACT_APP_APP_DOMAIN=mydata.jezz.me
REACT_APP_DASHBOARD_DOMAIN=mydatadashboard.jezz.me
```

- `PORT`: the port on your local machine to which the webpack development server to proxy `/api/` requests
- `REACT_APP_APP_DOMAIN`: the domain on which the app is served
- `REACT_APP_DASHBOARD_DOMAIN`: the domain on which the dashboard is served

### MariaDB keyfile

MariaDB tables potentially containing particularly sensitive data are encrypted at rest. For the database to work properly, a keyfile containing a default 256-bit AES encryption key must be provided, located at `keys/keyfile`.

On Linux systems with OpenSSL installed, such a key may be generated using the following command:
```bash
$ openssl rand -hex 32
```

This key may then be pasted into `keys/keyfile` prefixed with `1;` (to indicate that this key is the default key).

For example, `keys/keyfile` could -- but most definitely in all probability should not -- contain the following:
```
1;aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
```

For more information on MariaDB key files, visit the [MariaDB file key management plugin documentation](https://mariadb.com/kb/en/file-key-management-encryption-plugin/).

### Redis users.acl file

In order for Redis to work properly, a `redis/users.acl` must be set properly by replacing `PLEASE_RANDOMISE` below with a random string of characters (smaller than 512 characters in length) to use as a password. There must not be any space between the `>` and the password you wish to set.

```
user apiworker on +@all -DEBUG allkeys >PLEASE_RANDOMISE
```

