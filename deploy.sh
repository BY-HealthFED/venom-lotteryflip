#!/bin/bash
yarn build
scp -r ./dist/* www@192.168.103.107:~/web/lotterycoredemo/flip