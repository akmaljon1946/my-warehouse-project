const db = require('../config/db')
const sendTelegram = require('../services/telegramService')

module.exports = {
	add(req, res) {
		const { name, quantity, unit, price, category, expiryDate } = req.body

		db.run(
			`INSERT INTO products (name, quantity, unit, price, category, expiryDate)
       VALUES (?, ?, ?, ?, ?, ?)`,
			[name, quantity, unit, price, category, expiryDate],
			function () {
				sendTelegram(
					`➕ Добавлен товар:\n${name}, ${quantity} ${unit}\nСрок: ${expiryDate}`,
				)
				res.json({ success: true, id: this.lastID })
			},
		)
	},

	all(req, res) {
		db.all(`SELECT * FROM products`, (err, rows) => {
			res.json(rows)
		})
	},

	delete(req, res) {
		const id = req.params.id

		db.run(`DELETE FROM products WHERE id = ?`, [id], () => {
			sendTelegram(`🗑️ Товар удалён (ID ${id})`)
			res.json({ success: true })
		})
	},

	update(req, res) {
		const id = req.params.id
		const { name, quantity, unit, price } = req.body

		db.run(
			`UPDATE products SET name=?, quantity=?, unit=?, price=? WHERE id=?`,
			[name, quantity, unit, price, id],
			() => {
				sendTelegram(`✏️ Товар изменён:\n${name}, ${quantity} ${unit}`)
				res.json({ success: true })
			},
		)
	},

	expiring(req, res) {
		const today = new Date()

		db.all(`SELECT * FROM products`, (err, rows) => {
			const expiring = rows.filter(p => {
				const daysLeft = Math.ceil((new Date(p.expiryDate) - today) / 86400000)
				return daysLeft <= 30
			})

			if (expiring.length > 0) {
				const text =
					'⚠️ Скоро испортится:\n' +
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

			res.json(expiring)
		})
	},
}
