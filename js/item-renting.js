
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const addItemBtn = document.getElementById('add-item-btn');
  const addItemForm = document.getElementById('add-item-form');
  const cancelAddItemBtn = document.getElementById('cancel-add-item');
  const itemForm = document.getElementById('item-form');
  const itemsContainer = document.getElementById('items-container');
  const itemsCount = document.getElementById('items-count');
  const resetFiltersBtn = document.getElementById('reset-filters');
  
  const filterCategory = document.getElementById('filter-category');
  const filterCondition = document.getElementById('filter-condition');
  const priceMinSlider = document.getElementById('price-min');
  const priceMaxSlider = document.getElementById('price-max');
  const minPriceEl = document.getElementById('min-price');
  const maxPriceEl = document.getElementById('max-price');
  const availableOnlyCheckbox = document.getElementById('available-only');
  
  const mockItems = [
    {
      id: 'item-1',
      name: 'Electric Drill',
      owner: 'Mike Johnson',
      category: 'Tools',
      condition: 'Excellent',
      rentAmount: 10,
      duration: 'Day',
      description: 'Powerful cordless drill with multiple bits included. Perfect for home improvement projects.',
      imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400',
      available: true,
      createdAt: new Date('2025-05-15T10:30:00')
    },
    {
      id: 'item-2',
      name: 'Mountain Bike',
      owner: 'Sarah Wilson',
      category: 'Sports',
      condition: 'Very Good',
      rentAmount: 25,
      duration: 'Day',
      description: '21-speed mountain bike, great for trail riding and city commuting.',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      available: true,
      createdAt: new Date('2025-05-16T14:20:00')
    },
    {
      id: 'item-3',
      name: 'Stand Mixer',
      owner: 'Emma Davis',
      category: 'Kitchen',
      condition: 'Good',
      rentAmount: 15,
      duration: 'Weekend',
      description: 'Professional stand mixer with multiple attachments. Great for baking projects.',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      available: false,
      createdAt: new Date('2025-05-14T09:45:00')
    },
    {
      id: 'item-4',
      name: 'Camping Tent',
      owner: 'Alex Chen',
      category: 'Outdoors',
      condition: 'Excellent',
      rentAmount: 30,
      duration: 'Weekend',
      description: '4-person waterproof tent, perfect for camping trips.',
      imageUrl: 'https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=400',
      available: true,
      createdAt: new Date('2025-05-17T16:10:00')
    }
  ];
  
  let items = getFromLocalStorage(STORAGE_KEYS.RENT_ITEMS, mockItems);
  
  displayItems(items);
  
  addItemBtn.addEventListener('click', () => {
    addItemForm.style.display = 'block';
    addItemBtn.style.display = 'none';
  });
  
  cancelAddItemBtn.addEventListener('click', () => {
    addItemForm.style.display = 'none';
    addItemBtn.style.display = 'block';
    itemForm.reset();
  });
  
  itemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newItem = {
      id: 'item-' + Date.now(),
      name: document.getElementById('item-name').value,
      owner: document.getElementById('owner-name').value,
      category: document.getElementById('category').value,
      condition: document.getElementById('condition').value,
      rentAmount: parseFloat(document.getElementById('rent-amount').value),
      duration: document.getElementById('duration').value,
      description: document.getElementById('description').value,
      imageUrl: document.getElementById('image-url').value || 'https://via.placeholder.com/400x200?text=No+Image',
      available: true,
      createdAt: new Date()
    };
    
    items = [newItem, ...items];
    
    saveToLocalStorage(STORAGE_KEYS.RENT_ITEMS, items);
    
    displayItems(items);
    
    addItemForm.style.display = 'none';
    addItemBtn.style.display = 'block';
    itemForm.reset();
    
    showToast(`${newItem.name} added successfully!`, 'success');
  });
  
  searchInput.addEventListener('input', (e) => {
    filterItems();
  });
  
  filterCategory.addEventListener('change', filterItems);
  filterCondition.addEventListener('change', filterItems);
  availableOnlyCheckbox.addEventListener('change', filterItems);
  
  priceMinSlider.addEventListener('input', updatePriceRange);
  priceMaxSlider.addEventListener('input', updatePriceRange);
  
  function updatePriceRange() {
    const minVal = parseInt(priceMinSlider.value);
    const maxVal = parseInt(priceMaxSlider.value);
    
    if (minVal > maxVal) {
      priceMinSlider.value = maxVal;
    }
    
    minPriceEl.textContent = `$${priceMinSlider.value}`;
    maxPriceEl.textContent = `$${priceMaxSlider.value}`;
    
    filterItems();
  }
  
  resetFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    filterCategory.value = 'all';
    filterCondition.value = 'any';
    priceMinSlider.value = 0;
    priceMaxSlider.value = 100;
    availableOnlyCheckbox.checked = true;
    updatePriceRange();
    displayItems(items);
  });
  
  function filterItems() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = filterCategory.value;
    const selectedCondition = filterCondition.value;
    const minPrice = parseInt(priceMinSlider.value);
    const maxPrice = parseInt(priceMaxSlider.value);
    const availableOnly = availableOnlyCheckbox.checked;
    
    const filteredItems = items.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.name.toLowerCase().includes(searchTerm) ||
        item.owner.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm);

      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesCondition = selectedCondition === 'any' || item.condition === selectedCondition;
      
      const matchesPrice = item.rentAmount >= minPrice && item.rentAmount <= maxPrice;
      
      const matchesAvailability = !availableOnly || item.available;
      
      return matchesSearch && matchesCategory && matchesCondition && matchesPrice && matchesAvailability;
    });
    
    displayItems(filteredItems);
  }
  
  function displayItems(itemsToDisplay) {
    itemsCount.querySelector('span').textContent = itemsToDisplay.length;
    
    if (itemsToDisplay.length === 0) {
      itemsContainer.innerHTML = `
        <div class="empty-container">
          <i class="fas fa-box empty-icon"></i>
          <h3>No items found</h3>
          <p>No items match your search criteria. Try adjusting your filters or add a new item.</p>
        </div>
      `;
      return;
    }
    
    itemsContainer.innerHTML = itemsToDisplay.map(item => {
      const conditionColors = {
        'Excellent': '#10b981',
        'Very Good': '#3b82f6',
        'Good': '#f59e0b',
        'Fair': '#f97316',
        'Poor': '#ef4444'
      };
      
      return `
        <div class="card item-card">
          <div class="item-image">
            <img src="${item.imageUrl}" alt="${item.name}" loading="lazy">
            <span class="item-category">${item.category}</span>
            ${!item.available ? `
              <div class="item-unavailable">
                <span class="unavailable-badge">Unavailable</span>
              </div>
            ` : ''}
          </div>
          
          <div class="item-details">
            <div class="item-header">
              <h3 class="item-title">${item.name}</h3>
              <span class="badge" style="background-color: ${conditionColors[item.condition]}; color: white; font-size: 0.75rem;">
                ${item.condition}
              </span>
            </div>
            
            <p class="item-price">$${item.rentAmount} per ${item.duration.toLowerCase()}</p>
            <p class="item-description">${item.description}</p>
            <p class="item-owner"><i class="fas fa-user"></i> Owned by ${item.owner}</p>
          </div>
          
          <div class="item-footer">
            <span class="text-muted">Added ${formatDate(new Date(item.createdAt))}</span>
            <button class="btn ${item.available ? 'btn-primary' : 'btn-secondary'}" 
                    ${!item.available ? 'disabled' : ''} 
                    onclick="requestItem('${item.id}')">
              ${item.available ? 'Request' : 'Unavailable'}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }
  
  window.requestItem = function(itemId) {
    const item = items.find(i => i.id === itemId);
    if (item && item.available) {
      showToast(`Request sent for ${item.name}! ${item.owner} will contact you soon.`, 'success');
    }
  };
  
  function formatDate(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }
  
  // Initialize price range display
  updatePriceRange();
});
