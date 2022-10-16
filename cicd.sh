#!/bin/sh

sudo systemctl stop nginx
git pull origin main
python3 manage.py collectstatic

if [ $# = 1 ]; then
    if [ "$1" = "db" ]; then
        python3 manage.py makemigrations
        python3 manage.py migrate
    fi
fi

sudo supervisorctl reread
sudo supervisorctl update
sudo systemctl start nginx
