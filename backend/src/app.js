const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const app = express()

app.use(helmet())

// allow vercel + local dev
const allowed = Array.from(new Set([
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.CLIENT_URL
].filter(Boolean)))

app.use(cors({
    origin: function(origin, cb) {
        if (!origin) return cb(null, true)
        if (allowed.some(o => origin === o) || origin.endsWith('.vercel.app')) {
            return cb(null, true)
        }
        cb(new Error('CORS blocked: ' + origin))
    },
    credentials: true
}))

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/groups', require('./routes/groupRoutes'))
app.use('/api/members', require('./routes/memberRoutes'))
app.use('/api/contributions', require('./routes/contributionRoutes'))
app.use('/api/loans', require('./routes/loanRoutes'))
app.use('/api/reports', require('./routes/reportRoutes'))

app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() })
})

app.get('/', (req, res) => {
    res.json({ message: 'Re-Mmogo API' })
})

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' })
})

app.use((err, req, res) => {
    console.log(err.stack)
    res.status(500).json({ success: false, message: 'Something went wrong!' })
})

module.exports = app
