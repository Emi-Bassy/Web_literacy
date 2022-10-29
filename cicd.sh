#!/bin/sh

sudo systemctl stop nginx
sudo systemctl stop supervisor
git pull origin main
sudo systemctl start supervisor
sudo systemctl start nginx
