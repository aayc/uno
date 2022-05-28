const FACE_TYPES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "R", "S", "D2", "WD4", "W"]
const COLORS = ["R", "G", "Y", "B"]

type Card = {
    color: "R" | "G" | "Y" | "B" | "W",
    face: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "R" | "S" | "D2" | "WD4" | "W"
}

type GameState = {
    order: 1 | -1,
    turns: number,
    active_idx: number,
    n_players: number,
    player_names: string[],
    cpus: number[],
    force_draw: number,
    discard_pile: Card[],
    draw_pile: Card[]
}

function initGame(): GameState {
    let deck = []
    for (const color of COLORS) {
        for (const face of FACE_TYPES) {
            if (!color.startsWith("W") && !face.startsWith("W")) {
                deck.push({ color, face })
            }
        }
    }
    
    deck.push({ color: "W", face: "W"})
    deck.push({ color: "W", face: "W"})
    deck.push({ color: "W", face: "WD4"})
    deck.push({ color: "W", face: "WD4"})
    deck = shuffle(deck)

    const initial_discard_pile = deck.shift()
    if (initial_discard_pile.color == "W") {
        initial_discard_pile.color = "R"
    }

    return {
        order: 1,
        turns: 0,
        n_players: 3,
        // player_names: ["AARON", "CPU2"],
        // cpus: [1],
        player_names: ["AARON", "CPU2", "CPU3"],
        cpus: [1, 2],
        active_idx: 0,
        force_draw: 0,
        discard_pile: [initial_discard_pile],
        draw_pile: deck
    }
}


async function uno() {
    let state: GameState = initGame()
    const players = await Promise.all([...Array(state.n_players)].map(_ => drawCards(state, 7)))

    let winner = -1
    while (winner == -1) {
        let i = 0
        console.log("\nTURN", state.turns, state.player_names[state.active_idx],"'s turn")
        for (const player of players) {
            console.log("PLAYER", i, logCards(player))
            i += 1
        }
        console.log("DISCARD PILE:", logCards(state.discard_pile))

        state = await runTurn(players[state.active_idx], state)
        state.turns += 1

        winner = players.findIndex(x => x.length == 0)
    }

    console.log(`The winner is player ${winner}`)
}


function getPlayableCardIndexes(state: GameState, hand: Card[]) {
    const prev = state.discard_pile[state.discard_pile.length - 1]
    return hand.map((c, i) => {
        const sameColor = c.color === prev.color
        const sameFace = c.face === prev.face
        const isWild = c.face == "W" || c.face == "WD4"
        return (sameColor || sameFace || isWild) ? i : -1
    }).filter(x => x != -1)
}

async function drawCards(state: GameState, n: number): Promise<Card[]> {
    if (state.draw_pile.length < n) {
        console.log("=== RESHUFFLE ===")
        state.draw_pile.push(...shuffle(state.discard_pile.splice(0, state.discard_pile.length - 1)))
    }
    return state.draw_pile.splice(0, n)
}

function logCards(cards: Card[]): string {
    return `(${cards.map(c => c.face + c.color).join(" ")})`
}

async function chooseCard(state: GameState, hand: Card[], playableIndexes: number[]): Promise<number> {
    if (state.cpus.includes(state.active_idx)) {
        return playableIndexes[0]
    } else {
        return playableIndexes[0]
        //await promptUserForCardChoice(hand, playableIndexes)
    }
}

async function promptUserForCardChoice(hand: Card[], choices: number[]) {
    // const options = choices.map(i => i + ": " + logCards([hand[i]]))
    // const answer = await inquirer.prompt([
    //     {
    //         type: 'list',
    //         name: 'choice_idx',
    //         message: 'What card will you play?',
    //         choices: options      
    //     }])
    // return choices[options.findIndex(x => x == answer["choice_idx"])]
}

async function runTurn(hand: Card[], state: GameState) {
    if (state.force_draw > 0) {
        hand.push(...(await drawCards(state, state.force_draw)))
        state.force_draw = 0
        return changeTurn(state)
    }

    const playableCardIndexes = getPlayableCardIndexes(state, hand)
    if (playableCardIndexes.length == 0) {
        hand.push(...(await drawCards(state, 1)))
        return changeTurn(state)
    }

    const chosenIdx: number = await chooseCard(state, hand, playableCardIndexes)
    const chosenCard: Card = hand.splice(chosenIdx, 1)[0]
    if (chosenCard.color == "W") {
        chosenCard.color = "R"
    }

    console.log(state.player_names[state.active_idx], "PLAYS", logCards([chosenCard]))
    state = applyCardEffect(chosenCard, state)
    return changeTurn(state)
}

function changeTurn(state: GameState) {
    const nextActive = state.active_idx + state.order
    if (nextActive < 0) {
        state.active_idx = nextActive + state.n_players
    } else if (nextActive >= state.n_players) {
        state.active_idx = nextActive - state.n_players
    } else {
        state.active_idx = nextActive
    }
    return state
}

function applyCardEffect(card: Card, state: GameState) {
    if (card.face == "R") {
        state.order = state.order == 1 ? -1 : 1
    } else if (card.face == "S") {
        state = changeTurn(state)
    } else if (card.face == "D2") {
        state.force_draw = 2
    } else if (card.face == "WD4") {
        state.force_draw = 4
    } 
    state.discard_pile.push(card)
    return state
}

function shuffle(array: any[]): any[] {
    var copy = [], n = array.length, i;
    while (n) {
      i = Math.floor(Math.random() * array.length);
      if (i in array) {
        copy.push(array[i]);
        delete array[i];
        n--;
      }
    }
    return copy;
}

export { initGame }