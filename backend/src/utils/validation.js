// basic validation helpers used across controllers
// TODO: clean this up later, might add joi eventually

function isValidEmail(email) {
    if (!email) return false
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidPassword(password) {
    return typeof password === 'string' && password.length >= 6
}

function isPositiveNumber(val) {
    const n = Number(val)
    return !isNaN(n) && n > 0
}

function requireFields(obj, fields) {
    for (const f of fields) {
        if (obj[f] == null || obj[f] === '') return f
    }
    return null
}

module.exports = { isValidEmail, isValidPassword, isPositiveNumber, requireFields }
