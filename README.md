## GroupMe Gif Bot
  * #omg or #(your search term) for a GIF

## Requirements:
  * GroupMe dev account [dev.GroupMe](https://dev.groupme.com/session/new),
  	* Create a bot and set your callback URL to your heroku app domain (your-heroku-app-name.herokuapp.com) 	
  * Heroku account [Heroku](http://heroku.com).
  	* use Heroku config vars to set the following (all variables come from dev.groupme.com)
  	* http://i.imgur.com/gCgMp6E.png
  	  * botName = name of your bot (from dev.groupme.com)
      * botIdMain = bot id for your main group (from dev.groupme.com)
      * groupIdMain = group id for your main group (from dev.groupme.com)
      * botIdAlt = bot id for an alternate group (optional-- should work even if you don't enter this variable)
      * groupIdAlt = group id for an alternate group (Optional-- should work if you don't enter this variable)



## Useful Heroku Command Line Tools
  * git add .
  * git commit -m "comment here"
  * git push -f heroku
  * heroku ps
  * heroku logs
  * heroku logs --source app
  * heroku logs --app groupme-gif-bot --source app --tail
  * alphavantage 528P3B6Q2EW4I7B3
  
## Contact

john.stephen.olson@gmail.com


