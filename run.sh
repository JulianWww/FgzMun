#!/bin/bash

npm run build
cp ./.htaccess ./build/.htaccess
ssh ubuntu@wandhoven.ddns.net "rm -r /media/B/html/mun"
scp -r build ubuntu@wandhoven.ddns.net:/media/B/html/mun
