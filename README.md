docker compose up -d --build


expressjs backend only

including bash script for testing backend API => check inside the curl folder


Example

docker compose ps

NAME                           IMAGE                      COMMAND                  SERVICE   CREATED             STATUS             PORTS
express_blog_session-mongo-1   mongo:noble                "docker-entrypoint.s…"   mongo     About an hour ago   Up About an hour   27017/tcp
express_blog_session-proxy-1   nginx:stable-alpine        "/docker-entrypoint.…"   proxy     About an hour ago   Up About an hour   0.0.0.0:3000->80/tcp, [::]:3000->80/tcp
express_blog_session-redis-1   redis:6.2-alpine           "docker-entrypoint.s…"   redis     About an hour ago   Up About an hour   6379/tcp
express_blog_session-web-1     express_blog_session-web   "docker-entrypoint.s…"   web       About an hour ago   Up About an hour   3000/tcp


$ curl/registeruser.sh 
$ curl/loginuser.sh 
{"message":"Login successful"}


Before login

docker compose exec redis redis-cli -a redispassword

127.0.0.1:6379> KEYS *
(empty array)




After login

127.0.0.1:6379> KEYS *
1) "myapp:lfEuSM4-h61HNd_C6ct6Do4_v9AdtHxH"


127.0.0.1:6379> GET myapp:lfEuSM4-h61HNd_C6ct6Do4_v9AdtHxH

"{\"cookie\":{\"originalMaxAge\":600000,\"expires\":\"2025-10-30T15:52:46.965Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":\"6903874a66732ea5d314a7e9\",\"username\":\"user01\"}"

127.0.0.1:6379>