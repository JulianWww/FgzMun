#!/bin/bash

ssh-add /home/denanu/.ssh/id_ed25519-FGZ-MUN
yarnpkg build
zip -r build.zip build
scp build.zip mun@mun.fgz.ch:~/www.zip
ssh mun@mun.fgz.ch "rm -r ~/www"
ssh mun@mun.fgz.ch "unzip www.zip && rm www.zip && mv build www"
rm build.zip