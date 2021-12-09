#!/bin/bash

dn="$(dirname "$0")"

apt-get install -y python3-pip
pip install -r $dn/requirements.txt

python3 $dn/setup.py
