FROM redis

COPY redis.conf /usr/local/etc/redis/redis.conf
COPY users.acl /usr/local/etc/redis/users.acl

RUN echo >> /usr/local/etc/redis/users.acl
RUN echo "user apiworker on +@all -DEBUG allkeys >${REDIS_PASSWORD}" >> /usr/local/etc/redis/users.acl

CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]
