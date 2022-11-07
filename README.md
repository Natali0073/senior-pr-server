Local debug run:
Start - docker-compose -f docker-compose-dev.yml up
Stop -  docker-compose -f docker-compose-dev.yml down
Stop & remove images -  docker-compose -f docker-compose-dev.yml down --rmi all
Remove volumes - docker volume prune   
Prod:
docker build . -t natali/server