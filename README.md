## GroupMe Gif Bot
  * add this bot to your groupme group chat to provide GIFs or stock prices when summoned

## Post #lol or #happy birthday for a GIF
  <img src="https://i.imgur.com/ztk71Bj.jpg" alt="gifs" width="300"/>

## Post $BAC or $MSFT for a stock quote
  <img src="https://i.imgur.com/CHq3CVO.jpg" alt="stocks" width="300"/>

## Requirements:
  * GroupMe dev account [dev.GroupMe](https://dev.groupme.com/session/new),
  	* Create a bot and set your callback URL to your heroku app domain (your-heroku-app-name.herokuapp.com) 	
  * Heroku account [Heroku](http://heroku.com).
  	* use Heroku config vars to set the following (all variables come from dev.groupme.com)
  	<img src="https://i.imgur.com/QJphnhB.jpg" alt="variables" width="300"/>

  	  * botName = gifbot (set this in heroku and dev.groupme.com)
      * mainBotId = bot id for your main group (from dev.groupme.com)
      * mainGroupName = name of your main group
      * mainRating = determines the gif rating from giphy, options are: "r" or "pg-13" or "pg" or "g"
      * mainGroupId = group id for your main group (from dev.groupme.com)
      
      * testBotId = bot id for your Test group (from dev.groupme.com)
      * testGroupName = name of your Test group
      * testRating = determines the gif rating from giphy, options are: "r" or "pg-13" or "pg" or "g"
      * testGroupId = group id for your Test group (from dev.groupme.com)

  * AlphaVantage API key for stock Quotes [AlphaVantage](https://www.alphavantage.co/).
      * alphaVantageAPIKey = API key for stock quotes

## Useful Heroku Command Line Tools
  * git add .
  * git commit -m "comment here"
  * git push -f heroku
  * heroku ps
  * heroku logs
  * heroku logs --source app
  * heroku logs --app groupme-gif-bot --source app --tail
  
  * downloaded heroku CLI and install brew
  * https://devcenter.heroku.com/articles/heroku-cli#download-and-install
 
## Contact

john.stephen.olson@gmail.com

