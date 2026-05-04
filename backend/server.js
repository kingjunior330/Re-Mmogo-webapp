const app = require('./src/app')
const { testConnection } = require('./src/config/database')

const PORT = process.env.PORT || 5000

async function start() {
    const ok = await testConnection()
    if (!ok) {
        console.log('warning: db not connected, starting anyway')
    }

    app.listen(PORT, () => {
        console.log('server running on port ' + PORT)
    })
}

start().catch(err => {
    console.log('failed to start:', err)
    process.exit(1)
})
