# Setup:
```
git clone https://github.com/matthewpereira/pingbot
yarn
yarn start
```

Then visit [http://localhost:3000/](http://localhost:3000).

![screenshot](http://g.recordit.co/sv4q43F0q1.gif)

This is a hacky scorekeeping system for playing ping pong in the office. It's mainly an excuse to play with the [Annyang](https://www.talater.com/annyang/) library that facilitates Google Chrome's built in speech recognition engine. This will break in other browsers (for now).

Clicking the serving button transfers possession, and clicking either number increments the score. The program accepts voice commands like *'Blue team serves'* to set posession at the start of the game, and *'point red'*, *'red team scored'*, or *'point for red team'* to increment the score. Successful voice commands are answered by synthesized speech to keep track of the game progress and serving, as well as game point.

# Todo:
- Help overlay for describing available voice functions
- Tests
- Refactor! ¯\_(ツ)_/¯