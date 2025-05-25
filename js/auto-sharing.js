
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const rideForm = document.getElementById('ride-form');
  const ridesContainer = document.getElementById('rides-container');
  const filterType = document.getElementById('filter-type');
  const resetRidesBtn = document.getElementById('reset-rides');
  
  // Sample data for rides
  const mockRides = [
    {
      id: 'ride-1',
      type: 'car',
      fromLocation: 'Downtown Apartments',
      toLocation: 'University Campus',
      date: '2025-05-20',
      time: '08:30',
      seats: 3,
      notes: 'I drive to campus every weekday morning. Happy to take passengers along the route.',
      offeredBy: 'Mike Johnson',
      createdAt: new Date('2025-05-18T10:30:00')
    },
    {
      id: 'ride-2',
      type: 'bike',
      fromLocation: 'Riverside Housing',
      toLocation: 'City Park',
      date: '2025-05-21',
      time: '17:00',
      seats: 0,
      notes: 'I have an extra bike that I can lend for rides around the park area.',
      offeredBy: 'Emma Wilson',
      createdAt: new Date('2025-05-18T12:15:00')
    },
    {
      id: 'ride-3',
      type: 'car',
      fromLocation: 'College Heights',
      toLocation: 'Shopping Mall',
      date: '2025-05-22',
      time: '14:00',
      seats: 2,
      notes: 'Going to the mall for about 2 hours. Can give a ride there and back.',
      offeredBy: 'Sarah Lee',
      createdAt: new Date('2025-05-18T09:45:00')
    },
    {
      id: 'ride-4',
      type: 'scooter',
      fromLocation: 'Student Housing',
      toLocation: 'Downtown',
      date: '2025-05-19',
      time: '19:00',
      seats: 1,
      notes: 'I have an electric scooter available for sharing on weekday evenings.',
      offeredBy: 'Alex Chen',
      createdAt: new Date('2025-05-17T16:20:00')
    }
  ];
  
  // Load rides from localStorage or use mock data
  let rides = getFromLocalStorage(STORAGE_KEYS.AUTO_SHARES, mockRides);
  
  // Display all rides on page load
  displayRides(rides);
  
  // Form submission
  rideForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newRide = {
      id: 'ride-' + Date.now(),
      type: document.getElementById('ride-type').value,
      fromLocation: document.getElementById('from-location').value,
      toLocation: document.getElementById('to-location').value,
      date: document.getElementById('date').value,
      time: document.getElementById('time').value,
      seats: parseInt(document.getElementById('seats').value),
      notes: document.getElementById('notes').value,
      offeredBy: document.getElementById('offer-name').value,
      createdAt: new Date()
    };
    
    // Add to rides array
    rides = [newRide, ...rides];
    
    // Save to localStorage
    saveToLocalStorage(STORAGE_KEYS.AUTO_SHARES, rides);
    
    // Display updated rides
    displayRides(rides);
    
    // Reset form
    rideForm.reset();
    
    // Show success message
    showToast('Ride offered successfully!', 'success');
  });
  
  // Filter rides by type
  filterType.addEventListener('change', () => {
    const selectedType = filterType.value;
    
    if (selectedType === 'all') {
      displayRides(rides);
    } else {
      const filteredRides = rides.filter(ride => ride.type === selectedType);
      displayRides(filteredRides);
    }
  });
  
  // Reset rides to default
  resetRidesBtn.addEventListener('click', () => {
    rides = [...mockRides];
    saveToLocalStorage(STORAGE_KEYS.AUTO_SHARES, rides);
    displayRides(rides);
    filterType.value = 'all';
    showToast('Rides reset to default', 'info');
  });
  
  // Display rides function
  function displayRides(ridesToDisplay) {
    if (ridesToDisplay.length === 0) {
      ridesContainer.innerHTML = `
        <div class="empty-rides">
          <i class="fas fa-car"></i>
          <h3>No rides available</h3>
          <p>No rides match your criteria or none have been offered yet.</p>
          <button class="btn btn-primary" id="offer-ride-btn">Offer a Ride</button>
        </div>
      `;
      
      document.getElementById('offer-ride-btn').addEventListener('click', () => {
        document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth' });
      });
      
      return;
    }
    
    ridesContainer.innerHTML = ridesToDisplay.map(ride => {
      const rideDate = new Date(ride.date + 'T' + ride.time);
      const isPast = rideDate < new Date();
      const formattedDate = formatDate(rideDate);
      
      let vehicleIcon;
      switch(ride.type) {
        case 'car':
          vehicleIcon = 'fa-car';
          break;
        case 'bike':
          vehicleIcon = 'fa-bicycle';
          break;
        case 'scooter':
          vehicleIcon = 'fa-motorcycle';
          break;
        default:
          vehicleIcon = 'fa-car';
      }
      
      return `
        <div class="ride-card${isPast ? ' past-ride' : ''}">
          <span class="vehicle-type"><i class="fas ${vehicleIcon}"></i></span>
          <h3>
            <i class="fas ${vehicleIcon}"></i>
            ${capitalize(ride.type)} Share
          </h3>
          
          <div class="ride-details">
            <div class="ride-detail">
              <i class="fas fa-map-marker-alt"></i>
              <span>From: ${ride.fromLocation}</span>
            </div>
            
            <div class="ride-detail">
              <i class="fas fa-map-pin"></i>
              <span>To: ${ride.toLocation}</span>
            </div>
            
            <div class="ride-detail">
              <i class="fas fa-calendar"></i>
              <span>${formatDate(new Date(ride.date))}</span>
            </div>
            
            <div class="ride-detail">
              <i class="fas fa-clock"></i>
              <span>${formatTime(ride.time)}</span>
            </div>
            
            ${ride.type === 'car' ? `
              <div class="ride-detail">
                <i class="fas fa-users"></i>
                <span>${ride.seats} seat${ride.seats !== 1 ? 's' : ''} available</span>
              </div>
            ` : ''}
          </div>
          
          ${ride.notes ? `
            <div class="ride-notes">
              <p>${ride.notes}</p>
            </div>
          ` : ''}
          
          <div class="ride-footer">
            <span class="date-info">Posted by ${ride.offeredBy}</span>
            <button class="btn btn-sm ${isPast ? 'btn-secondary disabled' : 'btn-primary'}" ${isPast ? 'disabled' : ''}>
              ${isPast ? 'Expired' : 'Request Ride'}
            </button>
          </div>
        </div>
      `;
    }).join('');
    
    // Add event listeners to request buttons
    document.querySelectorAll('.ride-card .btn:not(.disabled)').forEach(btn => {
      btn.addEventListener('click', () => {
        showToast('Ride request sent! The ride provider will contact you soon.', 'success');
      });
    });
  }
  
  // Helper function to format date
  function formatDate(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }
  
  // Helper function to format time
  function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  }
  
  // Helper function to capitalize first letter
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
});
