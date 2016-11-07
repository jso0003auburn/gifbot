#Groupme Gif-Bot

## Introduction

Ultimate GroupMe Bot

Type #omg or #(your search term) for a gif

Type $MSFT or #(any other stock ticker) for price and change

Type !Atlanta or !(your zip code) or !NYC or !(your city) for weather info

Type ? for help

## Requirements:

  * GroupMe dev account [dev.GroupMe](https://dev.groupme.com/session/new),
  
  	* Set your callnack URL to your heroku app domain (your-heroku-app-name.herokuapp.com)
  	
  	* Get bot ID and group ID from dev.groupme.com

  * Heroku account [Heroku](http://heroku.com).
  
  	* use Heroku config var to set the following
    * botIdProd = bot id for your main group
    * groupIdProd = group id for your main group
    * botIdTest = bot id for a test group
    * groupIdTest = group id for a test group

## Useful Heroku Command Line Tools

git add .

git commit -m "comment here"

git push -f heroku

heroku ps

heroku logs

heroku logs —source app

# gifbot
