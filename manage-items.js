let items = JSON.parse(localStorage.getItem('items')) || [];

function addNewItem() {
    const name = document.getElementById('newItemName').value;
    const price = parseInt(document.getElementById('newItemPrice').value);

    if (name && price) {
        items.push({ name, price });
        localStorage.setItem('items', JSON.stringify(items));
        updateItemList();
        document.getElementById('newItemName').value = '';
        document.getElementById('newItemPrice').value = '';
    } else {
        alert("Nama barang dan harga harus diisi!");
    }
}

function updateItemList() {
    const itemList = document.getElementById("itemList");
    itemList.innerHTML = '';
    items.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td><button onclick="removeItem(${index})">Hapus</button></td>
        `;
        itemList.appendChild(row);
    });
}

function removeItem(index) {
    items.splice(index, 1);
    localStorage.setItem('items', JSON.stringify(items));
    updateItemList();
}

updateItemList();
