#!/bin/sh

sudo systemctl stop nginx
git pull origin main
sudo supervisorctl reread
sudo supervisorctl update
sudo systemctl start nginx
