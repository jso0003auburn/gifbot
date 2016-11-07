#Groupme Gif-Bot

## Introduction

Ultimate GroupMe Bot

Type #omg or #(your search term) for a gif

Type $MSFT or #(any other stock ticker) for price and change

Type !Atlanta or !(your zip code) or !NYC or !(your city) for weather info

Type ? for help

## Requirements:

  * GroupMe dev account [dev.GroupMe](https://dev.groupme.com/session/new),

  * Heroku account [Heroku](http://heroku.com).

## Setup

use Heroku variables to set the following

Get your BOTID from dev.groupme.com and configure it in the Heroku web client under settings

Set your callback URL in the dev.groupme page to your heroku domain (your-heroku-app-name.herokuapp.com)

botIdProd = bot id for your main group
groupIdProd = group id for your main group
botIdTest = bot id for a test group
groupIdTest = group id for a test group




git add .
git commit -m "comment here"
git push -f heroku


heroku ps
heroku logs
heroku logs —source app




# gifbot
