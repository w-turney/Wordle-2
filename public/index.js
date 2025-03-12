let squares = Array.from(document.querySelectorAll('.square')) //when guess successfully entered, remove blank class from squares, and redefine squares array as quaeryselector(.blank)
squares.forEach(square => square.classList.add('blank'))
let guessLength = 0
const guessList = []

const letterInput = letterValue => {
    if (guessLength === 5) {
        return
    }
    squares[guessLength].innerHTML = letterValue
    guessLength++
}

const del = () => {
    squares[guessLength - 1].innerHTML = '';
    guessLength--
}

const showPopUp = (message, duration) => {
    const popUp = document.getElementById('popup')
    document.getElementById('popup-message').textContent = message
    popUp.classList.toggle('hidden')
    setTimeout(() => {
        popUp.classList.toggle('hidden')
    }, duration)
}

const win = () => {
    showPopUp('Nice!', 2000)
    document.removeEventListener('click', handleClick)
}

const lose = () => {
    showPopUp('Nice try, better luck next time!', 3000)
    document.removeEventListener('click', handleClick)
}

const validWord = ({resultArr, guessArr}) => {
    resultArr.forEach((color, index) => {
        setTimeout(() => {
            const key = document.querySelector(`[data-key=${guessArr[index]}]`)
            key.classList.remove('grey', 'yellow', 'green')
            key.classList.add(color)
            squares[index].classList.add(color)
            squares[index].classList.remove('blank')
            if (resultArr.every(elem => elem === 'green') && index === 4) {
              setTimeout(win, 500)
            } else
            if (index === 4) {
                squares = Array.from(document.querySelectorAll('.blank'))
                guessLength = 0
                if (squares.length === 0) {
                    setTimeout(lose, 500)
                }
            }
        }, index*500)
    })
}

const enter = async (word) => {
    if (guessList.includes(word)) {
        return setTimeout(showPopUp('Already guessed', 1000), 1000)
    }
    try {
        const response = await fetch('/guess', {
                                                method: 'POST',
                                                headers: {'Content-Type': 'text/plain'},
                                                body: word
                                                })     
        if (!response.ok) {
            throw new Error('Invalid Word')
        }                                                                          
        const data = await response.json()
        validWord(data) 
        guessList.push(word)
    } catch(error) {
        console.error(error)
        setTimeout(showPopUp('Not in word list', 1000), 600)
    }
}


const handleClick = (event) => {
    if (event.target.matches('[data-key]')) {
        letterInput(event.target.textContent)
    }
    if (event.target.textContent === 'ENTER' && guessLength === 5) {
        const word = squares.map((square, index) => square.textContent).join('')
        enter(word)
    }
    if (event.target.textContent === 'DEL' && guessLength > 0) {
        del()
    }
}

const handleKeyPress = (event) => {
    if (event.code === 'Enter' && guessLength === 5) {
        const word = squares.map((square, index) => square.textContent).join('')
        enter(word)
    } else
    if (event.code === 'Backspace' && guessLength > 0) {
        del()
    } else
    if (event.code === `Key${event.key.toUpperCase()}`) {
        letterInput(event.key.toUpperCase())
    }
}

document.addEventListener('click', handleClick)
document.addEventListener('keydown', handleKeyPress)

//win page?
//css square animations? (flip reveal, invalid word shake)