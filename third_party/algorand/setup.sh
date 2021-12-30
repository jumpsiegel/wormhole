#!/bin/bash

# python3 setup.py --devnet --appid 7 --teal_dir teal; python3 setup.py --test --appid 7

dn="$(dirname "$0")"
cd $dn

pipenv install

pipenv run python3 setup.py --devnet
