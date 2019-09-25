## GroupMe gifbot
  * add this bot to your groupme group chat to provide GIFs or stock prices when summoned
  * You can use [MeBots](https://mebotsco.herokuapp.com/) to simply add this bot to your own GroupMe group or feel free to reuse code as necessary to run it yourself
    * [Add gifbot directly to your group using MeBots](https://mebotsco.herokuapp.com/bot/gifbot)
    * Huge thanks to [Erik Boesen](https://github.com/ErikBoesen) for helping me clean things up and integrate into [MeBots](https://mebotsco.herokuapp.com/)

## Post #lol or #happy birthday for a GIF
  <img src="https://i.imgur.com/ztk71Bj.jpg" alt="gifs" width="300"/>

## Post $BAC or $MSFT for a stock quote
  <img src="https://i.imgur.com/CHq3CVO.jpg" alt="stocks" width="300"/>

## Requirements:
  * GroupMe dev account [dev.GroupMe](https://dev.groupme.com/session/new)
  	* Create a bot and set your callback URL to your heroku app domain (your-heroku-app-name.herokuapp.com)
  	* This is managed within [MeBots](https://mebotsco.herokuapp.com/)
  * Heroku account [Heroku](http://heroku.com)
    * Only if you want to host the bot yourself
  * AlphaVantage API key for stock Quotes [AlphaVantage](https://www.alphavantage.co/).
    * alphaVantageAPIKey = API key for stock quotes
    * Set within Heroku config vars if you want to host the bot yourself

## Useful Heroku Commands
Install Homebrew (`brew`) and install Heroku CLI(https://devcenter.heroku.com/articles/heroku-cli#download-and-install)
```sh
git add .
git commit -m "comment here"
git push -f heroku
heroku ps
heroku logs
heroku logs --source app
heroku logs --app groupme-gif-bot --source app --tail
```

## Contact

john.stephen.olson@gmail.com
