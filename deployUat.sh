#!/bin/bash
yarn build:uat
scp -r ./dist/* www@192.168.103.107:~/web/lotterycore
