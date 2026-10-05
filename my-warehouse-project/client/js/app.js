const API_URL = 'http://localhost:3000/product'

// ПЕРЕКЛЮЧЕНИЕ СТРАНИЦ
function showPage(page) {
	document.getElementById('addPage').classList.add('hidden')
	document.getElementById('basePage').classList.add('hidden')

	document.getElementById(page).classList.remove('hidden')

	if (page === 'basePage') loadProducts()
}

// ДОБАВЛЕНИЕ ТОВАРА
async function addProduct() {
	const name = document.getElementById('name').value.trim()
	const quantity = parseFloat(document.getElementById('quantity').value)
	const unit = document.getElementById('unit').value.trim()
	const price = parseFloat(document.getElementById('price').value)
	const expiryDate = document.getElementById('expiryDate').value
	const category = document.getElementById('category').value

	if (!name || !expiryDate || isNaN(quantity) || isNaN(price)) {
		alert('Заполни все поля.')
		return
	}

	const product = { name, quantity, unit, price, category, expiryDate }

	await fetch(`${API_URL}/add`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(product),
	})

	alert('Товар добавлен!')
}

// ЗАГРУЗКА ВСЕХ ТОВАРОВ
async function loadProducts() {
	const res = await fetch(`${API_URL}/all`)
	const products = await res.json()

	const tbody = document.querySelector('#productsTable tbody')
	tbody.innerHTML = ''

	const today = new Date()

	products.forEach(p => {
		const daysLeft = Math.ceil((new Date(p.expiryDate) - today) / 86400000)

		const tr = document.createElement('tr')
		if (daysLeft <= 30) tr.classList.add('expiring')

		tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>${p.quantity}</td>
      <td>${p.unit}</td>
      <td>${p.price}</td>
      <td>${new Date(p.expiryDate).toLocaleDateString()}</td>
      <td>${daysLeft}</td>
      <td>
        <button class="btn btn-sm btn-info" onclick="editProduct(${p.id})">✏️</button>
        <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.id})">🗑️</button>
      </td>
    `
		tbody.appendChild(tr)
	})
}

// УДАЛЕНИЕ ТОВАРА
async function deleteProduct(id) {
	await fetch(`${API_URL}/delete/${id}`, { method: 'DELETE' })
	loadProducts()
}

// РЕДАКТИРОВАНИЕ ТОВАРА
async function editProduct(id) {
	const newName = prompt('Новое название:')
	const newQty = prompt('Новое количество:')
	const newPrice = prompt('Новая цена:')

	const body = {
		name: newName,
		quantity: parseFloat(newQty),
		unit: '',
		price: parseFloat(newPrice),
	}

	await fetch(`${API_URL}/update/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	})

	loadProducts()
}

// СКОРО ИСПОРТИТСЯ
async function loadExpiring() {
	const res = await fetch(`${API_URL}/expiring`)
	const expiring = await res.json()

	let html = '<h4>⚠️ Скоро испортится:</h4>'

	if (expiring.length === 0) {
		html += 'Нет товаров.'
	} else {
		expiring.forEach(p => {
			const daysLeft = Math.ceil(
				(new Date(p.expiryDate) - new Date()) / 86400000,
			)
			html += `• ${p.name} — через ${daysLeft} дней<br>`
		})
	}

	document.getElementById('expiringOutput').innerHTML = html
}
