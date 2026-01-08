#!/bin/bash
# Run this script to generate a zip file ready for uploading
cd ./source/
zip -q -r -9 ../main.zip *.*
