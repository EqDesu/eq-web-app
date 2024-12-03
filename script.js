let cart = JSON.parse(localStorage.getItem('cart')) || {}; // Keranjang berdasarkan pembeli
let buyers = JSON.parse(localStorage.getItem('buyers')) || []; // Daftar pembeli
let transactionHistory = JSON.parse(localStorage.getItem('transactionHistory')) || {}; // Riwayat transaksi per pembeli
let items = JSON.parse(localStorage.getItem('items')) || [
]; // Daftar barang yang diset di halaman manage-items

// Fungsi untuk memperbarui dropdown pembeli
function updateBuyerList() {
    const buyerSelect = document.getElementById("buyerName");
    buyerSelect.innerHTML = ''; // Menghapus semua opsi sebelumnya
    buyers.forEach((buyer) => {
        const option = document.createElement('option');
        option.value = buyer;
        option.textContent = buyer;
        buyerSelect.appendChild(option);
    });
}

// Fungsi untuk memperbarui dropdown barang
function updateItemList() {
    const itemSelect = document.getElementById("itemName");
    itemSelect.innerHTML = ''; // Menghapus barang lama
    items.forEach((item) => {
        const option = document.createElement('option');
        option.value = item.name;
        option.setAttribute('data-price', item.price);
        option.textContent = `${item.name} - Rp ${item.price}`;
        itemSelect.appendChild(option);
    });
}

// Fungsi untuk menambah pembeli
function addBuyer() {
    const newBuyer = prompt("Masukkan nama pembeli baru:");
    if (newBuyer && !buyers.includes(newBuyer)) {
        buyers.push(newBuyer); // Menambahkan pembeli baru
        localStorage.setItem('buyers', JSON.stringify(buyers)); // Menyimpan pembeli
        updateBuyerList(); // Menampilkan pembeli terbaru di dropdown
    } else {
        alert("Nama pembeli sudah ada atau input kosong!");
    }
}

// Fungsi untuk menghapus pembeli
function removeBuyer() {
    const buyerSelect = document.getElementById("buyerName");
    const selectedBuyer = buyerSelect.value;
    if (selectedBuyer) {
        buyers = buyers.filter(buyer => buyer !== selectedBuyer);
        localStorage.setItem('buyers', JSON.stringify(buyers)); // Menyimpan perubahan pembeli
        delete cart[selectedBuyer]; // Hapus keranjang pembeli yang dipilih
        delete transactionHistory[selectedBuyer]; // Hapus riwayat transaksi pembeli
        localStorage.setItem('cart', JSON.stringify(cart)); // Simpan keranjang
        localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory)); // Simpan riwayat transaksi
        updateBuyerList(); // Memperbarui daftar pembeli di dropdown
        updateTransactionHistory(); // Memperbarui riwayat transaksi
        alert(`Pembeli ${selectedBuyer} telah dihapus.`);
    } else {
        alert("Pilih pembeli yang akan dihapus.");
    }
}

// Fungsi untuk menambah barang ke keranjang
function addToCart() {
    const buyer = document.getElementById("buyerName").value;
    const itemName = document.getElementById("itemName").value;
    const itemPrice = parseInt(document.getElementById("itemName").selectedOptions[0].getAttribute("data-price"));
    const itemQuantity = parseInt(document.getElementById("itemQuantity").value);

    if (!buyer) {
        alert("Pilih nama pembeli terlebih dahulu!");
        return;
    }

    if (!itemName || !itemQuantity) {
        alert("Pilih barang dan masukkan jumlah!");
        return;
    }

    const totalItemPrice = itemPrice * itemQuantity;

    // Menambahkan barang ke keranjang pembeli yang dipilih
    if (!cart[buyer]) cart[buyer] = []; // Jika belum ada keranjang untuk pembeli ini
    cart[buyer].push({ name: itemName, price: itemPrice, quantity: itemQuantity, total: totalItemPrice });

    localStorage.setItem('cart', JSON.stringify(cart)); // Menyimpan keranjang
    updateCartDisplay(); // Memperbarui tampilan keranjang
}

// Fungsi untuk memperbarui tampilan keranjang
function updateCartDisplay() {
    const cartItems = document.getElementById("cartItems");
    const buyer = document.getElementById("buyerName").value;
    const selectedCart = cart[buyer] || [];
    
    cartItems.innerHTML = ''; // Clear existing cart items
    let totalPrice = 0;
    selectedCart.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td>${item.quantity}</td>
            <td>${item.total}</td>
            <td><button onclick="removeItem(${index})">Hapus</button></td>
        `;
        cartItems.appendChild(row);
        totalPrice += item.total;
    });
    document.getElementById("total").textContent = totalPrice; // Update total
}

// Fungsi untuk menghapus item dari keranjang
function removeItem(index) {
    const buyer = document.getElementById("buyerName").value;
    cart[buyer].splice(index, 1); // Menghapus item dari keranjang
    localStorage.setItem('cart', JSON.stringify(cart)); // Menyimpan perubahan keranjang
    updateCartDisplay(); // Memperbarui tampilan keranjang
}

// Fungsi untuk checkout dan menyimpan riwayat transaksi
function checkout() {
    const buyer = document.getElementById("buyerName").value;
    const total = parseInt(document.getElementById("total").textContent);

    if (!buyer) {
        alert("Pilih nama pembeli terlebih dahulu!");
        return;
    }

    if (total <= 0) {
        alert("Keranjang kosong!");
        return;
    }

    // Menyimpan transaksi baru
    if (!transactionHistory[buyer]) transactionHistory[buyer] = [];
    transactionHistory[buyer].push({ date: new Date().toLocaleString(), total });
    cart[buyer] = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));
    updateTransactionHistory();
    updateCartDisplay();
    alert("Pembayaran berhasil!");
}
function updateTransactionHistory() {
    const transactionList = document.getElementById("transactionHistory");
    transactionList.innerHTML = '';
    const buyer = document.getElementById("buyerName").value;
    const transactions = transactionHistory[buyer] || [];

    transactions.forEach((transaction) => {
        const li = document.createElement("li");
        li.textContent = `Tanggal: ${transaction.date}, Total: Rp ${transaction.total}`;
        transactionList.appendChild(li);
    });
}
updateBuyerList();
updateItemList();
