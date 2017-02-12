#!/bin/bash

SCRIPT_PATH=$(cd "$(dirname "$0")"; pwd);

export SELENIUM_HUB_PORT=4444
export NODES_CHROME=1
export NODES_FIREFOX=0
export VNC_FROM_PORT=40650
export VNC_TO_PORT=40700
export VIDEO=false

cd ${SCRIPT_PATH}


docker-compose -p grid down
if [ "$1" = "stop" ];
then
  exit 0
fi

echo "grid up"
docker-compose -p grid up -d

echo "go to http://localhost:4444/grid/console for selenium console"
