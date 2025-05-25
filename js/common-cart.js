
document.addEventListener('DOMContentLoaded', () => {
  const addItemForm = document.getElementById('add-item-form');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const totalItemsEl = document.getElementById('total-items');
  const purchasedItemsEl = document.getElementById('purchased-items');
  const remainingItemsEl = document.getElementById('remaining-items');
  const totalPriceEl = document.getElementById('total-price');
  const clearPurchasedBtn = document.getElementById('clear-purchased');
  const resetCartBtn = document.getElementById('reset-cart');
  const searchItemsInput = document.getElementById('search-items');
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  let currentFilter = 'all';
  let searchTerm = '';
  
  const mockItems = [
    {
      id: 'item-1',
      name: 'Milk',
      quantity: 1,
      price: 3.99,
      category: 'grocery',
      addedBy: 'Alex',
      notes: '2% preferred',
      completed: false,
      createdAt: new Date('2025-05-17T14:30:00')
    },
    {
      id: 'item-2',
      name: 'Toilet Paper',
      quantity: 2,
      price: 5.49,
      category: 'household',
      addedBy: 'Emma',
      notes: 'Get the soft kind',
      completed: false,
      createdAt: new Date('2025-05-17T15:45:00')
    },
    {
      id: 'item-3',
      name: 'Shampoo',
      quantity: 1,
      price: 7.99,
      category: 'personal',
      addedBy: 'Mike',
      notes: 'Any brand is fine',
      completed: true,
      createdAt: new Date('2025-05-16T10:20:00')
    },
    {
      id: 'item-4',
      name: 'Bread',
      quantity: 1,
      price: 2.49,
      category: 'grocery',
      addedBy: 'Sarah',
      notes: 'Whole grain please',
      completed: false,
      createdAt: new Date('2025-05-18T08:15:00')
    }
  ];
  
  let cartItems = getFromLocalStorage(STORAGE_KEYS.CART_ITEMS, mockItems);
  updateCart();
  
  addItemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newItem = {
      id: 'item-' + Date.now(),
      name: document.getElementById('item-name').value,
      quantity: parseInt(document.getElementById('item-quantity').value),
      price: parseFloat(document.getElementById('item-price').value),
      category: document.getElementById('item-category').value,
      addedBy: document.getElementById('item-added-by').value,
      notes: document.getElementById('item-notes').value,
      completed: false,
      createdAt: new Date()
    };
    
    cartItems = [newItem, ...cartItems];
    saveToLocalStorage(STORAGE_KEYS.CART_ITEMS, cartItems);
    updateCart();
    
    addItemForm.reset();
    document.getElementById('item-quantity').value = '1';
    document.getElementById('item-price').value = '0';
    
    showToast(`${newItem.name} added to cart!`, 'success');
  });
  
  clearPurchasedBtn.addEventListener('click', () => {
    const purchasedCount = cartItems.filter(item => item.completed).length;
    
    if (purchasedCount === 0) {
      showToast('No purchased items to clear', 'info');
      return;
    }
    
    cartItems = cartItems.filter(item => !item.completed);
    saveToLocalStorage(STORAGE_KEYS.CART_ITEMS, cartItems);
    updateCart();
    
    showToast('Purchased items cleared', 'success');
  });
  
  resetCartBtn.addEventListener('click', () => {
    cartItems = [...mockItems];
    saveToLocalStorage(STORAGE_KEYS.CART_ITEMS, cartItems);
    updateCart();
    
    searchItemsInput.value = '';
    searchTerm = '';
    
    filterButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-filter') === 'all') {
        btn.classList.add('active');
      }
    });
    currentFilter = 'all';
    
    showToast('Cart reset to default', 'info');
  });
  
  searchItemsInput.addEventListener('input', (e) => {
    searchTerm = e.target.value.toLowerCase();
    updateCart();
  });
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      updateCart();
    });
  });
  
  function updateCart() {
    const filteredItems = cartItems.filter(item => {
      if (currentFilter === 'pending' && item.completed) return false;
      if (currentFilter === 'completed' && !item.completed) return false;
      if (searchTerm && !item.name.toLowerCase().includes(searchTerm) && 
          !item.addedBy.toLowerCase().includes(searchTerm) && 
          !item.notes.toLowerCase().includes(searchTerm) && 
          !getCategoryName(item.category).toLowerCase().includes(searchTerm)) {
        return false;
      }
      
      return true;
    });
    
    displayItems(filteredItems);
    updateSummary();
  }
  
  function displayItems(items) {
    if (items.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-shopping-basket"></i>
          <h3>No items found</h3>
          <p>${searchTerm || currentFilter !== 'all' ? 
            'No items match your search or filter criteria.' : 
            'Your shopping cart is empty. Add some items!'}</p>
        </div>
      `;
      return;
    }
    
    cartItemsContainer.innerHTML = items.map(item => {
      const totalPrice = (item.price * item.quantity).toFixed(2);
      const formattedDate = formatDate(new Date(item.createdAt));
      
      let categoryIcon;
      switch(item.category) {
        case 'grocery':
          categoryIcon = 'fa-apple-alt';
          break;
        case 'household':
          categoryIcon = 'fa-home';
          break;
        case 'personal':
          categoryIcon = 'fa-user';
          break;
        default:
          categoryIcon = 'fa-box';
      }
      
      return `
        <div class="cart-item${item.completed ? ' completed' : ''}">
          <div class="cart-item-check">
            <input type="checkbox" ${item.completed ? 'checked' : ''} data-id="${item.id}">
          </div>
          
          <div class="cart-item-content">
            <div class="cart-item-header">
              <div class="cart-item-name">
                <i class="fas ${categoryIcon}"></i>
                ${item.name}
                ${item.quantity > 1 ? `<span>(${item.quantity})</span>` : ''}
              </div>
              <div class="cart-item-price">$${totalPrice}</div>
            </div>
            
            <div class="cart-item-details">
              <div>Added by ${item.addedBy} • ${formattedDate}</div>
              <div>${getCategoryName(item.category)}</div>
            </div>
            
            ${item.notes ? `
              <div class="cart-item-notes">${item.notes}</div>
            ` : ''}
          </div>
          
          <div class="cart-item-actions">
            <button class="action-btn delete-btn" data-id="${item.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
    
    document.querySelectorAll('.cart-item-check input').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const itemId = checkbox.getAttribute('data-id');
        toggleItemStatus(itemId);
      });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.getAttribute('data-id');
        deleteItem(itemId);
      });
    });
  }
  
  function updateSummary() {
    const totalItems = cartItems.length;
    const purchasedItems = cartItems.filter(item => item.completed).length;
    const remainingItems = totalItems - purchasedItems;
    
    const totalPrice = cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    totalItemsEl.textContent = totalItems;
    purchasedItemsEl.textContent = purchasedItems;
    remainingItemsEl.textContent = remainingItems;
    totalPriceEl.textContent = `$${totalPrice.toFixed(2)}`;
  }
  
  function toggleItemStatus(itemId) {
    cartItems = cartItems.map(item => {
      if (item.id === itemId) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });
    
    saveToLocalStorage(STORAGE_KEYS.CART_ITEMS, cartItems);
    updateCart();
  }
  
  function deleteItem(itemId) {
    const itemToDelete = cartItems.find(item => item.id === itemId);
    
    cartItems = cartItems.filter(item => item.id !== itemId);
    saveToLocalStorage(STORAGE_KEYS.CART_ITEMS, cartItems);
    updateCart();
    
    showToast(`${itemToDelete.name} removed from cart`, 'info');
  }
  
  function formatDate(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }
  
  function getCategoryName(category) {
    switch(category) {
      case 'grocery':
        return 'Grocery';
      case 'household':
        return 'Household';
      case 'personal':
        return 'Personal Care';
      default:
        return 'Other';
    }
  }
});
