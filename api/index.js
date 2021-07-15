import express from 'express'

const app = express()
const port = 4000

app.get('/api', (req, res) => {
    res.send('Hi, you may be in the wrong place.')
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})
