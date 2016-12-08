#/bin/bash
git pull
docker-compose run --rm  web  rake db:create db:migrate
docker-compose restart