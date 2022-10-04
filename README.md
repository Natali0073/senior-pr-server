Local debug run:
Start - docker-compose -f docker-compose-dev.yml up
Stop -  docker-compose down
Stop & remove images -  docker-compose down --rmi all
Prod:
docker build . -t natali/server