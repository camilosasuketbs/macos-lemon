#!/bin/bash

cp /bergedge/grub/grub-$1.cfg /bergedge/grub/grub.cfg

sleep 15

osascript -e 'tell app "System Events" to restart'


