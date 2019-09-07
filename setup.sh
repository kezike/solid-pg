#!/bin/sh

# Setup solid-pg environment

# BEGIN SETUP

# BEGIN DEPENDENCY INSTALLATION

# Enable execution of solid-pg scripts
chmod +x util/*

# Install requisite Node packages and dependencies
echo Installing requisite Node packages...
npm install

# Define all file locations that are relevant for setup
uriApi=$PWD/util/uri.js # NOTE: $PWD == solid-pg at this point
jsonApi=$PWD/util/json.js # NOTE: $PWD == solid-pg at this point
configFile=$PWD/config.json # NOTE: $PWD == solid-pg at this point

# Define all config keys
webidKey=SOLID_WEBID
accountKey=SOLID_ACCOUNT
unameKey=SOLID_UNAME
passKey=SOLID_PASS
profileKey=SOLID_PROFILE

# Setup config file
echo {} > $configFile

# END DEPENDENCY INSTALLATION

# BEGIN AUTHENTICATION
cd util/

# Login to Solid account
echo To get started, please provide your Solid account info in the following section. If you do not own a Solid account, please quit this script and register for one here: https://solid.inrupt.com
printf "Please enter your Solid WebID (eg. https://USER.solid.community/profile/card#me) [ENTER]:\n---> "
read webid
host=`node $uriApi --host=$webid`
protocol=`node $uriApi --protocol=$webid`
account=$protocol://$host/
profile=`node $uriApi --doc=$webid`
printf "Please enter your Solid account username [ENTER]:\n---> "
read uname
printf "Please enter your Solid account password [ENTER]:\n---> "
read pass
node $jsonApi --write --key=$webidKey --value=$webid --json=$configFile
node $jsonApi --write --key=$accountKey --value=$account --json=$configFile
node $jsonApi --write --key=$unameKey --value=$uname --json=$configFile
node $jsonApi --write --key=$passKey --value=$pass --json=$configFile
./login.sh

cd ../
# END AUTHENTICATION

echo SolidPG setup is complete. Run 'npm start' to get started!

# END SETUP

