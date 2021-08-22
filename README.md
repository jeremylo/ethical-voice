# Breathlessness data gathering and analysis project

This repository contains Jeremy Lo Ying Ping's UCL summer research project to develop a more ethical breathlessness data gathering and analysis tool for respiratory disease researchers.
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

