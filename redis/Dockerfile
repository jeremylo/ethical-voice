FROM redis

WORKDIR /usr/local/etc/redis/

COPY redis.conf /usr/local/etc/redis/redis.conf
COPY users.acl /usr/local/etc/redis/users.acl

CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]
