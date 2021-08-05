FROM redis

COPY redis.conf /usr/local/etc/redis/redis.conf

RUN echo "requirepass \"${REDIS_PASSWORD}\"" >> /usr/local/etc/redis/redis.conf

CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" , "--appendonly", "yes" ]
