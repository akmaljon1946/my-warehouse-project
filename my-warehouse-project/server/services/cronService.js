const db = require('../config/db')
const sendTelegram = require('./telegramService')

function dailyCheck() {
	const today = new Date()

	db.all(`SELECT * FROM products`, (err, rows) => {
		const expiring = rows.filter(p => {
			const daysLeft = Math.ceil((new Date(p.expiryDate) - today) / 86400000)
			return daysLeft <= 30
		})

		if (expiring.length > 0) {
			const text =
				'⏰ Ежедневная проверка склада:\n' +
				expiring
					.map(p => {
						const daysLeft = Math.ceil(
							(new Date(p.expiryDate) - today) / 86400000,
						)
						return `• ${p.name} — через ${daysLeft} дней`
					})
					.join('\n')

			sendTelegram(text)
		}
	})
}

// запуск каждые 24 часа
setInterval(dailyCheck, 86400000)

module.exports = dailyCheck
