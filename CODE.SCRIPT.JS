
window.jsPDF = window.jspdf.jsPDF;


let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

const inventoryForm = document.getElementById('inventoryForm');
const inventoryBody = document.getElementById('inventoryBody');
const searchInput = document.getElementById('searchInput');


inventoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const itemName = document.getElementById('itemName').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;
    const category = document.getElementById('category').value;
    
    const item = {
        id: Date.now(),
        itemName,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        category
    };
    
    inventory.push(item);
    saveToLocalStorage();
    displayInventory();
    inventoryForm.reset();
});


function saveToLocalStorage() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

function displayInventory(items = inventory) {
    inventoryBody.innerHTML = '';
    
    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.itemName}</td>
            <td>${item.quantity}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>${item.category}</td>
            <td>
                <button class="delete-btn" onclick="deleteItem(${item.id})">Delete</button>
            </td>
        `;
        inventoryBody.appendChild(row);
    });
}


function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        inventory = inventory.filter(item => item.id !== id);
        saveToLocalStorage();
        displayInventory();
    }
}


searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredItems = inventory.filter(item => 
        item.itemName.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
    );
    displayInventory(filteredItems);
});


function exportToPDF() {
    const doc = new jsPDF();
    
  
    doc.setFontSize(18);
    doc.text('Inventory Report', 14, 20);
    
   
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
   
    const tableColumn = ["Item Name", "Quantity", "Price", "Category"];
    const tableRows = inventory.map(item => [
        item.itemName,
        item.quantity,
        `${item.price.toFixed(2)}`,
        item.category
    ]);

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        styles: {
            fontSize: 10,
            cellPadding: 3,
            overflow: 'linebreak'
        },
        columnStyles: {
            0: { cellWidth: 50 },
            1: { cellWidth: 30 },
            2: { cellWidth: 30 },
            3: { cellWidth: 40 }
        }
    });

   
    const totalValue = inventory.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    doc.text(`Total Inventory Value: $${totalValue.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
    
   
    doc.save('inventory-report.pdf');
}


displayInventory();
