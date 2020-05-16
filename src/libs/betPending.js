const ecoinOptions = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' }
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

let fifa20CountDown = function(bet) {
    const timestamp = bet.timestamp;
    const timeRemaining = 1800 - ((Date.now() - timestamp) / 1000);
    if (timeRemaining < 0) {
        this.refs.notifFifa20Bet.innerHTML = 'Pari en cours...';
    }
    else {
        const hour = Math.floor(timeRemaining / 3600);
        const hourString = hour > 0 ? `${hour}h` : '';
        const min = Math.floor(timeRemaining % 3600 / 60);
        const minString = min > 0 ? `${min}min` : '';
        this.refs.countDown.innerHTML = hourString + minString;
    }
}

export function onBetPending(game, bet) {
    const ecoinValue = bet.ecoin.toString();
    const optionIndex = ecoinOptions.findIndex(option => option.value === ecoinValue);
    this.setState({
        loading: false,
        betIsPending: true,
        defaultEcoinOption: ecoinOptions[optionIndex],
        type: bet.type
    });

    switch (game) {
        case 'leagueoflegends':
            this.refs.buttonLolBet.disabled = true;

            if (bet.type === 'lol-5v5-ranked-solo') {
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
            else if (bet.type === 'lol-5v5-private-solo') {
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
                //this.refs.notifLolTournCode.innerHTML = bet.code;
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

            if (bet.type === 'csgo-5v5-competitive-solo') {
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
            else if (bet.type === 'csgo-5v5-private-solo') {
                console.log("bet.type === 'csgo-5v5-private-solo'")
                this.setState({
                    multiplayer: true,
                    searching: false
                });
                this.refs.notifCsgoSearch.style.display = 'none';
                this.refs.notifCsgoEstimation.style.display = 'none';
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

            case 'fifa20':
                this.refs.buttonCsgoBet.disabled = true;

                this.setState({
                    multiplayer: true,
                    searching: false
                });

                this.refs.notifFifa20Estimation.style.display = 'none';
                this.refs.buttonFifa20Bet.innerHTML = 'Parier';
                this.refs.buttonFifa20Bet.classList.remove('grey');
                this.refs.chrono.innerHTML = '00:00';
                clearInterval(window.intervalFifa20Bet);

                this.refs.notifGameFound.style.display = 'inline';
                this.refs.notifFifa20Creation.style.display = 'none';
                this.refs.notifFifa20SvInfo.style.display = 'inline';
                this.refs.notifFifa20SvInfo.innerHTML = `Rejoignez Excite #${bet.serverId}&nbsp;&nbsp;Mdp : ${bet.password}`;

                this.refs.notifFifa20Console.style.display = 'inline';
                this.refs.notifFifa20Console.innerHTML = `Ou via la console :<br/>connect ${bet.publicIp}:2701${Number(bet.serverId)-1}; password ${bet.password}`;

                this.refs.notifDiscord.style.display = 'inline';
                this.refs.discordLink.style.display = 'inline';

            break;
         
        default:
            break;
    }
}

export function offBetPending(game) {
    this.setState({
        betIsPending: false,
        defaultEcoinOption: undefined
    });
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
            this.refs.buttonFifa20Bet.disabled = false;
            this.refs.notifFifa20Bet.style.display = 'none';
            this.refs.notifGameFound.style.display = 'none';
            this.refs.notifFifa20Creation.style.display = 'none';
            this.refs.notifFifa20SvInfo.style.display = 'none';
            this.refs.notifFifa20Console.style.display = 'none';
            this.refs.notifDiscord.style.display = 'none';
            this.refs.discordLink.style.display = 'none';
            clearInterval(window.intervalFifa20Bet);
            break;

        default:
            break;
    }
}