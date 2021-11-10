#!/bin/sh

# Setup solid-pg web environment

# Install requisite Node packages and dependencies
echo Installing requisite Node packages...
npm install

# Setup Solid authentication popup
solid-auth-client generate-popup
mv popup.html public

