const fetch = require('node-fetch')
const { BOT_TOKEN, CHAT_ID } = require('../config/telegram')

function sendTelegram(text) {
	if (!BOT_TOKEN || BOT_TOKEN.startsWith('ВАШ')) return

	fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ chat_id: CHAT_ID, text }),
	}).catch(console.error)
}

module.exports = sendTelegram
