import React, { Component } from 'react';
import annyang              from 'annyang';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            red: {
                score: 0,
                serving: true
            },
            blue: {
                score: 0,
                serving: false,
            },
            turnover: false,
            gamePoint: false,
            gameOver: false
        }
        this.speak = false;
    }

    componentWillMount() {
        annyang.addCommands({
            'reset (the) score': () => this.resetScore(),
            'score check': () => this.scoreCheck(),

            'blue (team) serves': () => this.setServing('blue', true),
            'red (team) serves': () => this.setServing('red', true),

            'red (team) scored': () => this.incrementScore('red', true),
            'blue (team) scored': () => this.incrementScore('blue', true),

            '(the) red (team) scored a point(s)': () => this.incrementScore('red', true),
            '(the) blue (team) scored a point(s)': () => this.incrementScore('blue', true),

            '(a) point(s) (was) (scored) (for) (by) (the) red (team)': () => this.incrementScore('red', true),
            '(a) point(s) (was) (scored) (for) (by) (the) blue (team)': () => this.incrementScore('blue', true),
        });
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.red.score !== this.state.red.score || prevState.blue.score !== this.state.blue.score) {
            this.trackGame();
        }
    }

    componentDidMount() {
        annyang.start();
        console.warn('listening...');

        annyang.addCallback('result', function(phrases) {
            console.log("I think the user said: ", phrases[0]);
            console.log("But then again, it could be any of the following: ", phrases);
        });
    }

    setServing(team, setByVoice) {
        if (this.state.gameOver) {
            return false;
        }

        if (setByVoice) {
            this.speak = true;
        }
        if (team === 'blue') {
            this.setState({
                blue: {
                    ...this.state.blue,
                    serving: true
                },
                red: {
                    ...this.state.red,
                    serving: false
                }
            });
        } else {
            this.setState({
                blue: {
                    ...this.state.blue,
                    serving: false
                },
                red: {
                    ...this.state.red,
                    serving: true
                }
            });
        }
        const confirmed = this.speak ? 'Confirmed, ' : ''
        this.speakMessage(confirmed + team + ' team serves.');
    }

    incrementScore(team, setByVoice) {
        if (this.state.gameOver) {
            return false;
        }

        this.speak = setByVoice;

        const redScore = team === 'red' ? this.state.red.score + 1 : this.state.red.score;
        const blueScore = team === 'blue' ? this.state.blue.score + 1 : this.state.blue.score;

        const turnover = (redScore + blueScore) % 5 === 0;

        this.setState({
            red: {
                ...this.state.red,
                score: redScore,
                serving: turnover ? !this.state.red.serving : this.state.red.serving,
            },
            blue: {
                ...this.state.blue,
                score: blueScore,
                serving: turnover ? !this.state.blue.serving : this.state.blue.serving,
            },
            turnover
        });
    }

    resetScore() {
        this.setState({
            red: {
                ...this.state.red,
                score: 0,
            },
            blue: {
                ...this.state.blue,
                score: 0,
            },
            gameOver: false
        });
    }

    congrats() {
        const chance = Math.random() * 100;

        if (chance > 80 && chance <= 90) {
            return 'Nice shot! ';
        }

        if (chance > 90) {
            return 'What a play! ';
        }

        return '';
    }
    checkGamePoint(red, blue, difference) {
        if (red >= 20 && red > blue && difference >= 1) {
            return ' Game Point. Blue Serves.';
        }
        if (blue >= 20 && blue > red && difference >= 1) {
            return ' Game Point. Red Serves.';
        }
    }
    checkWinningPoint(red, blue) {
        if (red >= 21 && red > blue && red - blue >= 2) {
            return ' Red wins!';
        }
        if (blue >= 21 && blue > red && blue - red >= 2) {
            return ' Blue wins!';
        }
        return false;
    }
    gameOver = () => (
        (this.state.red.score > 20 && this.state.red.score - 2 >= this.state.blue.score) ||
        (this.state.blue.score > 20 && this.state.blue.score - 2 >= this.state.red.score)
    );
    trackGame() {
        const red  = this.state.red.score;
        const blue = this.state.blue.score;
        const difference = red - blue <= -1 || red - blue >= 1;

        const winningPoint = this.checkWinningPoint(red, blue);
        const gamePoint = !winningPoint ? this.checkGamePoint(red, blue, difference) : null;
        const congrats = this.congrats();
        const gameOver = this.gameOver();

        if (gameOver) {
            const message = 'Game over!';
            console.log(message);
            this.setState({ gameOver: true });

            return this.speakMessage(message);
        }

        let serveNotice = '';

        if (this.state.turnover && this.state.red.serving && !gamePoint && !winningPoint) {
            serveNotice = ' Red Team Serves.';
        } else if (this.state.turnover && this.state.blue.serving && !gamePoint && !winningPoint) {
            serveNotice = ' Blue Team Serves.';
        }

        // Congratulations! Red ##, blue ##. Game Point. Blue serves.
        const message = congrats + 'Red ' + red + ', blue ' + blue + '.' + (gamePoint ? gamePoint : '') + serveNotice + (winningPoint ? winningPoint : '');
        console.log(message);
        this.speakMessage(message);
    }
    speakMessage(message) {
        if ('speechSynthesis' in window && this.speak) {
            console.log('Paused for output...');
            annyang.pause();
            setTimeout(() => {
                console.log('Resuming speech capture');
                annyang.resume()
            }, 4000);
            const speech = new SpeechSynthesisUtterance(message)
            window.speechSynthesis.speak(speech);
        }

        this.speak = false;
    }

    scoreCheck() {
        const speech = new SpeechSynthesisUtterance('Red ' + this.state.red.score + ', blue ' + this.state.blue.score);
        window.speechSynthesis.speak(speech);
    }

    render() {
        console.log(this.state.gameOver)
        return (
        <div className="pingbot">
            <div className="pingbot_scores">
                <button className="pingbot_redScore" onClick={() => this.incrementScore('red')}>
                    {this.state.red.score}
                </button>
                <button className="pingbot_blueScore" onClick={() => this.incrementScore('blue')}>
                    {this.state.blue.score}
                </button>
            </div>
            <div className="footer">
                <div className="pingbot_servingRed" onClick={() => this.setServing('blue')}>
                    {this.state.red.serving ? 'Serving' : ''}
                </div>
                <div className="pingbot_resetScore" onClick={() => this.resetScore()}>
                    Reset Score
                </div>
                <div className="pingbot_servingBlue" onClick={() => this.setServing('red')}>
                    {this.state.blue.serving ? 'Serving' : ''}
                </div>
            </div>
        </div>
        );
    }
}

export default App;