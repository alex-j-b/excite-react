const ecoinOptions = [
    { value: 50, label: '50' },
    { value: 100, label: '100' },
    { value: 200, label: '200' },
    { value: 500, label: '500' },
    { value: 1000, label: '1000' }
]

let lolCountDown = function(bet) {
    const timestamp = bet.timestamp;
    const timeRemaining = 1800 - ((Date.now() - timestamp) / 1000);
    if (bet.status === 'playing') {
        this.refs.notifLolBet.innerHTML = 'Partie en cours... GLHF!';
    }
    else if (timeRemaining < 0) {
        this.refs.notifLolBet.innerHTML = 'Pari en cours...';
    }
    else {
        const hour = Math.floor(timeRemaining / 3600);
        const hourString = hour > 0 ? `${hour}h` : '';
        const min = Math.floor(timeRemaining % 3600 / 60);
        const minString = min > 0 ? `${min}min` : '';
        this.refs.countDown.innerHTML = hourString + minString;
    }
}

let fortniteCountDown = function(bet) {
    const timestamp = bet.timestamp;
    const timeRemaining = 600 - ((Date.now() - timestamp) / 1000);
    if (timeRemaining < 0) {
        this.refs.notifFortniteBet.innerHTML = 'Pari en cours...';
    }
    else {
        const hour = Math.floor(timeRemaining / 3600);
        const hourString = hour > 0 ? `${hour}h` : '';
        const min = Math.floor(timeRemaining % 3600 / 60);
        const minString = min > 0 ? `${min}min` : '';
        this.refs.countDown.innerHTML = hourString + minString;
    }
}

let csgoCountDown = function(bet) {
    const timestamp = bet.timestamp;
    const timeRemaining = 1800 - ((Date.now() - timestamp) / 1000);
    if (timeRemaining < 0) {
        this.refs.notifCsgoBet.innerHTML = 'Pari en cours...';
    }
    else {
        const hour = Math.floor(timeRemaining / 3600);
        const hourString = hour > 0 ? `${hour}h` : '';
        const min = Math.floor(timeRemaining % 3600 / 60);
        const minString = min > 0 ? `${min}min` : '';
        this.refs.countDown.innerHTML = hourString + minString;
    }
}

let popUpCountDown = function(refs, timer, innerHTML) {
    if (timer && refs.countDown) {
        refs.countDown.innerHTML = innerHTML;
    }
    else if (!timer && refs.notifConfirmFifa20) {
        refs.notifConfirmFifa20.innerHTML = innerHTML;
    }
    if (refs.countDown || refs.notifConfirmFifa20) {
        clearInterval(window.intervalPopUpCountDown);
    }
};
let fifa20ConfirmCountDown = function(refs, bet) {
    const timestamp = bet.timestampTimer;
    const timeRemaining = 900 - ((Date.now() - timestamp) / 1000);

    if (timeRemaining < 0) {
        window.intervalPopUpCountDown = setInterval(() => {
            popUpCountDown(refs, false, 'Confirmation imminente...');
        }, 100);
    }
    else {
        const hour = Math.floor(timeRemaining / 3600);
        const hourString = hour > 0 ? `${hour}h` : '';
        const min = Math.floor(timeRemaining % 3600 / 60);
        const minString = min > 0 ? `${min}min` : '';

        window.intervalPopUpCountDown = setInterval(() => {
            popUpCountDown(refs, true, hourString + minString);
        }, 100);
    }
}


export function onBetPending(game, bet) {
    const ecoinOptionIdx = ecoinOptions.findIndex(option => Number(option.value) === Number(bet.ecoin));
    this.setState({
        loading: false,
        betIsPending: true,
        ecoinOption: ecoinOptions[ecoinOptionIdx],
        type: bet.type
    });
    console.log('ICI')
    console.log('')
    console.log('bet: ', bet)
    console.log('ecoinOption: ', ecoinOptions[ecoinOptionIdx])
    console.log('')

    switch (game) {
        case 'leagueoflegends':
            this.refs.buttonLolBet.disabled = true;

            if (bet.type === 'leagueoflegends-5v5-ranked-solo') {
                this.setState({
                    multiplayer: false,
                    searching: false
                });
                this.refs.notifLolBet.style.display = 'inline';

                lolCountDown = lolCountDown.bind(this);
                lolCountDown(bet);
                window.intervalLolBet = setInterval(() => {
                    lolCountDown(bet);
                }, 60000);
            }
            else if (bet.type === 'leagueoflegends-5v5-private-solo') {
                this.setState({
                    multiplayer: true,
                    searching: false
                });
                this.refs.notifLolSearch.style.display = 'none';
                this.refs.notifLolEstimation.style.display = 'none';
                this.refs.buttonLolBet.innerHTML = 'Parier';
                this.refs.buttonLolBet.classList.remove('grey');
                this.refs.chrono.innerHTML = '00:00';
                clearInterval(window.intervalLolBet);

                this.refs.notifGameFound.style.display = 'inline';
                this.refs.notifLolTournCode.style.display = 'inline';
                this.refs.notifLolTournCode.innerHTML = bet.code;
                this.refs.notifLolJoin.style.display = 'inline';
                this.refs.linkLolHelp.style.display = 'inline';
                this.refs.notifDiscord.style.display = 'inline';
                this.refs.discordLink.style.display = 'inline';
            }
            break;

        case 'fortnite':
            this.refs.buttonFortniteBet.disabled = true;
            this.refs.notifFortniteBet.style.display = 'inline';
            this.refs.lostBetLink.style.display = 'inline';

            fortniteCountDown = fortniteCountDown.bind(this);
            fortniteCountDown(bet);
            window.intervalFortniteBet = setInterval(() => {
                fortniteCountDown(bet);
            }, 60000);
            break;

        case 'counterstrikego':
            this.refs.buttonCsgoBet.disabled = true;

            if (bet.type === 'counterstrikego-5v5-competitive-solo') {
                this.setState({
                    multiplayer: false,
                    searching: false
                });
                this.refs.notifCsgoBet.style.display = 'inline';
                
                csgoCountDown = csgoCountDown.bind(this);
                csgoCountDown(bet);
                window.intervalCsgoBet = setInterval(() => {
                    csgoCountDown(bet);
                }, 60000);
            }
            else if (bet.type === 'counterstrikego-5v5-private-solo') {
                console.log("bet.type === 'counterstrikego-5v5-private-solo'")
                this.setState({
                    multiplayer: true,
                    searching: false
                });
                this.refs.notifCsgoSearch.style.display = 'none';
                this.refs.buttonCsgoBet.innerHTML = 'Parier';
                this.refs.buttonCsgoBet.classList.remove('grey');
                this.refs.chrono.innerHTML = '00:00';
                clearInterval(window.intervalCsgoBet);

                this.refs.notifGameFound.style.display = 'inline';
                if ("team" in bet) {
                    console.log('"team" in bet')
                    this.refs.notifCsgoCreation.style.display = 'none';
                    this.refs.notifCsgoSvInfo.style.display = 'inline';
                    this.refs.notifCsgoSvInfo.innerHTML = `Rejoignez Excite #${bet.serverId}&nbsp;&nbsp;Mdp : ${bet.password}`;

                    this.refs.notifCsgoConsole.style.display = 'inline';
                    this.refs.notifCsgoConsole.innerHTML = `Ou via la console :<br/>connect ${bet.publicIp}:2701${Number(bet.serverId)-1}; password ${bet.password}`;

                    this.refs.notifDiscord.style.display = 'inline';
                    this.refs.discordLink.style.display = 'inline';
                }
                else {
                    console.log("this.refs.notifCsgoCreation.style.display = 'inline';")
                    this.refs.notifCsgoCreation.style.display = 'inline';
                }
            }
            break;

        case 'fifa20':
            this.refs.buttonFifa20Bet.disabled = true;

            this.setState({
                multiplayer: true,
                searching: false
            });

            this.refs.notifFifa20Search.style.display = 'none';

            this.refs.resultButtonsFifa20.style.display = 'inline';

            this.refs.buttonFifa20Bet.style.display = 'none';
            this.refs.buttonFifa20Bet.innerHTML = 'Parier';
            this.refs.buttonFifa20Bet.classList.remove('grey');

            this.refs.chrono.innerHTML = '00:00';
            clearInterval(window.intervalFifa20Bet);

            this.refs.notifGameFound.style.display = 'inline';
            this.refs.notifFifa20Screenshot.style.display = 'inline';
            this.refs.notifFifa20Opponent.style.display = 'inline';
            this.refs.notifFifa20Opponent.innerHTML = `Ajoutez et Affrontez ${bet.opponentAccountId}`;
            this.refs.notifDiscord.style.display = 'inline';
            this.refs.discordLink.style.display = 'inline';

            if (bet.status === 'confirmLost') {
                this.setState({ popUpConfirmLost: true }, () => {
                    fifa20ConfirmCountDown(this.refs, bet);
                    window.intervalFifa20ConfirmCountDown = setInterval(() => {
                        fifa20ConfirmCountDown(this.refs, bet);
                    }, 60000);
                });
            }
            break;

        default:
            break;
    }
}

export function offBetPending(game) {
    this.setState({ betIsPending: false });
    this.props.loggedInCheck();

    switch (game) {
        case 'leagueoflegends':
            this.refs.buttonLolBet.disabled = false;
            this.refs.notifLolBet.style.display = 'none';
            clearInterval(window.intervalLolBet);
            break;

        case 'fortnite':
            this.refs.buttonFortniteBet.disabled = false;
            this.refs.notifFortniteBet.style.display = 'none';
            this.refs.lostBetLink.style.display = 'none';
            clearInterval(window.intervalFortniteBet);
            break;

        case 'counterstrikego':
            this.refs.buttonCsgoBet.disabled = false;
            this.refs.notifCsgoBet.style.display = 'none';
            this.refs.notifGameFound.style.display = 'none';
            this.refs.notifCsgoCreation.style.display = 'none';
            this.refs.notifCsgoSvInfo.style.display = 'none';
            this.refs.notifCsgoConsole.style.display = 'none';
            this.refs.notifDiscord.style.display = 'none';
            this.refs.discordLink.style.display = 'none';
            clearInterval(window.intervalCsgoBet);
            break;

        case 'fifa20':
            this.setState({ popUpConfirmLost: false });
            this.refs.buttonFifa20Bet.disabled = false;
            this.refs.resultButtonsFifa20.style.display = 'none';
            this.refs.buttonFifa20Bet.style.display = 'inline';

            this.refs.notifGameFound.style.display = 'none';
            this.refs.notifFifa20Screenshot.style.display = 'none';
            this.refs.notifFifa20Opponent.style.display = 'none';
            this.refs.notifDiscord.style.display = 'none';
            this.refs.discordLink.style.display = 'none';
            clearInterval(window.intervalPopUpCountDown);
            clearInterval(window.intervalFifa20ConfirmCountDown);
            this.refs.chrono.innerHTML = '00:00';
            clearInterval(window.intervalSearchingFifa20CountDown);
            break;

        default:
            break;
    }
}