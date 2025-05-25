
document.addEventListener('DOMContentLoaded', () => {
  const playersContainer = document.getElementById('players-container');
  const playerCount = document.getElementById('player-count');
  const gameSearch = document.getElementById('game-search');
  const gameType = document.getElementById('game-type');
  const skillLevel = document.getElementById('skill-level');
  const availabilityCheckboxes = document.querySelectorAll('input[name="availability"]');
  const applyFiltersBtn = document.getElementById('apply-filters');
  const resetFiltersBtn = document.getElementById('reset-filters');
  const toggleProfileFormBtn = document.getElementById('toggle-profile-form');
  const profileFormContainer = document.getElementById('profile-form-container');
  const gameProfileForm = document.getElementById('game-profile-form');
  
  const mockPlayers = [
    {
      id: 'player-1',
      name: 'Alex Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      games: ['Chess', 'Poker', 'Settlers of Catan'],
      gameTypes: ['board', 'card', 'board'],
      skillLevel: 'advanced',
      availability: ['weekday-evening', 'weekend-day', 'weekend-evening'],
      bio: 'Chess enthusiast with a passion for strategy games. Always looking for worthy opponents!'
    },
    {
      id: 'player-2',
      name: 'Emma Wilson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      games: ['Dungeons & Dragons', 'Magic: The Gathering', 'Pandemic'],
      gameTypes: ['tabletop', 'card', 'board'],
      skillLevel: 'intermediate',
      availability: ['weekend-day', 'weekend-evening'],
      bio: 'Experienced D&D Dungeon Master. I run weekly campaigns and always welcome new players to join our adventures.'
    },
    {
      id: 'player-3',
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
      games: ['FIFA', 'Call of Duty', 'Fortnite'],
      gameTypes: ['video', 'video', 'video'],
      skillLevel: 'expert',
      availability: ['weekday-evening', 'weekend-evening'],
      bio: 'Competitive gamer focusing on FPS and sports games. Looking for teammates for online tournaments.'
    },
    {
      id: 'player-4',
      name: 'Sofia Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      games: ['Scrabble', 'Monopoly', 'Trivial Pursuit'],
      gameTypes: ['board', 'board', 'board'],
      skillLevel: 'beginner',
      availability: ['weekday-day', 'weekend-day'],
      bio: 'Casual board game player looking for fun game nights. I bring snacks!'
    },
    {
      id: 'player-5',
      name: 'Jordan Taylor',
      avatar: 'https://randomuser.me/api/portraits/lego/3.jpg',
      games: ['Mario Kart', 'Minecraft', 'Among Us'],
      gameTypes: ['video', 'video', 'video'],
      skillLevel: 'intermediate',
      availability: ['weekday-evening', 'weekend-day', 'weekend-evening'],
      bio: 'Video game enthusiast who enjoys both competitive and cooperative gameplay. Voice chat preferred.'
    }
  ];

  let players = getFromLocalStorage(STORAGE_KEYS.GAME_PARTNERS, mockPlayers);
  displayPlayers(players);
  
  const userProfile = getFromLocalStorage(STORAGE_KEYS.GAME_PROFILE, null);
  if (userProfile) {
    populateProfileForm(userProfile);
  }
  
  toggleProfileFormBtn.addEventListener('click', () => {
    if (profileFormContainer.style.display === 'none' || !profileFormContainer.style.display) {
      profileFormContainer.style.display = 'block';
      toggleProfileFormBtn.textContent = 'Cancel';
    } else {
      profileFormContainer.style.display = 'none';
      toggleProfileFormBtn.textContent = userProfile ? 'Edit Profile' : 'Create Profile';
    }
  });

  gameProfileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('profile-name').value;
    const games = document.getElementById('profile-games').value.split(',').map(game => game.trim());
    const skill = document.getElementById('profile-skill').value;
    const bio = document.getElementById('profile-bio').value;
    
    const availability = [];
    document.querySelectorAll('input[name="profile-availability"]:checked').forEach(checkbox => {
      availability.push(checkbox.value);
    });
    
    const profile = {
      id: userProfile ? userProfile.id : 'player-' + Date.now(),
      name,
      avatar: 'https://randomuser.me/api/portraits/lego/1.jpg', // Default avatar
      games,
      gameTypes: games.map(() => guessGameType(games[0])),
      skillLevel: skill,
      availability,
      bio
    };
    
    saveToLocalStorage(STORAGE_KEYS.GAME_PROFILE, profile);
    
    if (!userProfile) {
      players = [profile, ...players];
      saveToLocalStorage(STORAGE_KEYS.GAME_PARTNERS, players);
    } else {
      players = players.map(player => player.id === profile.id ? profile : player);
      saveToLocalStorage(STORAGE_KEYS.GAME_PARTNERS, players);
    }
    
    displayPlayers(players);
    profileFormContainer.style.display = 'none';
    toggleProfileFormBtn.textContent = 'Edit Profile';
    
    showToast('Profile saved successfully!', 'success');
  });
  
  applyFiltersBtn.addEventListener('click', () => {
    const searchTerm = gameSearch.value.toLowerCase();
    const selectedType = gameType.value;
    const selectedSkill = skillLevel.value;
    
    const selectedAvailability = [];
    availabilityCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        selectedAvailability.push(checkbox.value);
      }
    });
    
    const filteredPlayers = players.filter(player => {
      const matchesSearch = searchTerm === '' || 
        player.name.toLowerCase().includes(searchTerm) ||
        player.games.some(game => game.toLowerCase().includes(searchTerm)) ||
        player.bio.toLowerCase().includes(searchTerm);
      
      const matchesType = selectedType === 'all' || 
        player.gameTypes.some(type => type === selectedType);
      
      const matchesSkill = selectedSkill === 'all' || 
        player.skillLevel === selectedSkill;
      
      const matchesAvailability = selectedAvailability.length === 0 ||
        player.availability.some(avail => selectedAvailability.includes(avail));
      
      return matchesSearch && matchesType && matchesSkill && matchesAvailability;
    });
    
    displayPlayers(filteredPlayers);
  });
  
  resetFiltersBtn.addEventListener('click', () => {
    gameSearch.value = '';
    gameType.value = 'all';
    skillLevel.value = 'all';
    
    availabilityCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    
    displayPlayers(players);
  });
  
  function displayPlayers(playersToDisplay) {
    playerCount.textContent = `${playersToDisplay.length} ${playersToDisplay.length === 1 ? 'Player' : 'Players'}`;
    
    if (playersToDisplay.length === 0) {
      playersContainer.innerHTML = `
        <div class="empty-players">
          <i class="fas fa-gamepad"></i>
          <h3>No players found</h3>
          <p>No game partners match your criteria. Try adjusting your filters or add your own profile.</p>
        </div>
      `;
      return;
    }
    
    playersContainer.innerHTML = playersToDisplay.map(player => {
      const availabilityIcons = {
        'weekday-day': 'sun',
        'weekday-evening': 'moon',
        'weekend-day': 'calendar-day',
        'weekend-evening': 'calendar-week'
      };
      
      const availabilityLabels = {
        'weekday-day': 'Weekday Daytime',
        'weekday-evening': 'Weekday Evening',
        'weekend-day': 'Weekend Daytime',
        'weekend-evening': 'Weekend Evening'
      };
      
      const skillColors = {
        'beginner': '#10b981',
        'intermediate': '#3b82f6',
        'advanced': '#f59e0b',
        'expert': '#ef4444'
      };
      
      return `
        <div class="player-card">
          <div class="player-header">
            <div class="player-avatar">
              <img src="${player.avatar}" alt="${player.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
              <div style="display: none; width: 100%; height: 100%; background: var(--gradient-primary); border-radius: 50%; align-items: center; justify-content: center; color: white; font-weight: 600;">
                ${player.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div class="player-info">
              <h3>${player.name}</h3>
              <span class="player-skill" style="background-color: ${skillColors[player.skillLevel]}; color: white;">
                ${player.skillLevel.charAt(0).toUpperCase() + player.skillLevel.slice(1)}
              </span>
            </div>
          </div>
          
          <div class="player-content">
            <div class="player-games">
              <h4>Favorite Games</h4>
              <div class="game-tags">
                ${player.games.map(game => `<span class="game-tag">${game}</span>`).join('')}
              </div>
            </div>
            
            <div class="player-availability">
              <h4>Available</h4>
              <div class="availability-tags">
                ${player.availability.map(avail => `
                  <span class="availability-tag">
                    <i class="fas fa-${availabilityIcons[avail]}"></i>
                    ${availabilityLabels[avail]}
                  </span>
                `).join('')}
              </div>
            </div>
            
            ${player.bio ? `<div class="player-bio">${player.bio}</div>` : ''}
          </div>
          
          <div class="player-footer">
            <button class="btn btn-primary" onclick="connectWithPlayer('${player.id}')">
              <i class="fas fa-user-plus"></i> Connect
            </button>
            <button class="btn btn-secondary" onclick="messagePlayer('${player.id}')">
              <i class="fas fa-envelope"></i> Message
            </button>
          </div>
        </div>
      `;
    }).join('');
  }
  
  window.connectWithPlayer = function(playerId) {
    const player = players.find(p => p.id === playerId);
    if (player) {
      showToast(`Connection request sent to ${player.name}!`, 'success');
    }
  };
  
  window.messagePlayer = function(playerId) {
    const player = players.find(p => p.id === playerId);
    if (player) {
      showToast(`Opening chat with ${player.name}...`, 'info');
    }
  };
  
  function populateProfileForm(profile) {
    document.getElementById('profile-name').value = profile.name || '';
    document.getElementById('profile-games').value = profile.games ? profile.games.join(', ') : '';
    document.getElementById('profile-skill').value = profile.skillLevel || 'beginner';
    document.getElementById('profile-bio').value = profile.bio || '';
    
    document.querySelectorAll('input[name="profile-availability"]').forEach(checkbox => {
      checkbox.checked = profile.availability ? profile.availability.includes(checkbox.value) : false;
    });
  }
  
  function guessGameType(game) {
    const videoGames = ['fifa', 'call of duty', 'fortnite', 'mario kart', 'minecraft', 'among us'];
    const boardGames = ['chess', 'monopoly', 'scrabble', 'settlers of catan', 'pandemic'];
    const cardGames = ['poker', 'magic: the gathering'];
    const tabletopGames = ['dungeons & dragons', 'd&d'];
    
    const gameLower = game.toLowerCase();
    
    if (videoGames.some(vg => gameLower.includes(vg))) return 'video';
    if (boardGames.some(bg => gameLower.includes(bg))) return 'board';
    if (cardGames.some(cg => gameLower.includes(cg))) return 'card';
    if (tabletopGames.some(tg => gameLower.includes(tg))) return 'tabletop';
    
    return 'other';
  }
});
