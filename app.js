const express = require('express')
const axios = require('axios')
const app = express()

app.use(express.static('./public'))
app.use(express.text())

let targetWord = '';

function compare(guess, target) {
    const guessArr = guess.split('')
    const targetArr = target.split('')
    const resultArr = new Array(5).fill('grey')
    guessArr.forEach((letter, index) => {
      if (targetArr[index] === letter) {
        resultArr[index] = 'green'
        targetArr[index] = 'green'
      }
    })
    guessArr.forEach((letter, index) => {
      if (targetArr.includes(letter) && resultArr[index] !== 'green') {
        targetArr[targetArr.indexOf(letter)] = 'yellow'
        resultArr[index] = 'yellow'
      }
    })
    return {resultArr, guessArr}
  }

app.post('/guess', async (req, res, next) => {
    const guess = req.body
    try {
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${guess}`)
        const result = compare(guess, targetWord)
        res.json(result)
    } catch(error) {
        console.error(error.status, error.message)
        next(error)
    }
})

const errorHandler = async (err, req, res, next) => {
  res.status(err.status).json({valid: false, message: "Invalid Word"})
}
app.use(errorHandler)

const port = 3000

const start = async() => {
  try {
    const response = await fetch('https://random-word-api.vercel.app/api?words=1&length=5')
    const data = await response.json()
    targetWord = data[0].toUpperCase()
    app.listen(port, () => {
        console.log(`Listening on port ${port}...`, targetWord)
      })
  } catch (error) {
    console.error(error)
  }
}

start()