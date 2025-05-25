
import { User } from "@/types/user";
import { RoommatePreference } from "@/types/roommate";
import { CartItem } from "@/types/cart";
import { RentItem } from "@/types/rent";
import { AutoShare } from "@/types/auto";
import { GamePartner } from "@/types/game";


export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    age: 28,
    gender: 'Male',
    interests: ['Hiking', 'Cooking', 'Movies'],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    age: 25,
    gender: 'Female',
    interests: ['Reading', 'Yoga', 'Travel'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: '3',
    name: 'Miguel Rodriguez',
    age: 30,
    gender: 'Male',
    interests: ['Gaming', 'Basketball', 'Cooking'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: '4',
    name: 'Emma Chen',
    age: 26,
    gender: 'Female',
    interests: ['Photography', 'Music', 'Travel'],
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: '5',
    name: 'Dave Smith',
    age: 32,
    gender: 'Male',
    interests: ['Movies', 'Cooking', 'Reading'],
    avatar: 'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
];

export const mockRoommatePreferences: RoommatePreference[] = [
  {
    id: '1',
    userId: '1',
    budget: 1200,
    location: 'Downtown',
    prefers: ['Non-smoker', 'Pet-friendly', 'Early riser'],
    about: "I'm a software developer who works remotely. I'm clean and quiet. I enjoy cooking and occasional game nights."
  },
  {
    id: '2',
    userId: '2',
    budget: 1000,
    location: 'University Area',
    prefers: ['Student', 'Quiet', 'Non-smoker'],
    about: "Grad student looking for a quiet place to study. I'm organized and tidy. I enjoy yoga and meditation."
  },
  {
    id: '3',
    userId: '3',
    budget: 1500,
    location: 'Riverside',
    prefers: ['Professional', 'Social', 'Pet-friendly'],
    about: "Marketing executive who loves to socialize. I have a small dog named Max. I'm looking for someone who enjoys occasional dinner parties."
  },
  {
    id: '4',
    userId: '4',
    budget: 900,
    location: 'Suburbs',
    prefers: ['Non-smoker', 'Clean', 'Quiet'],
    about: "Freelance designer who needs a peaceful environment. I keep to myself most of the time but am friendly. I cook daily and keep common areas clean."
  },
  {
    id: '5',
    userId: '5',
    budget: 1300,
    location: 'Downtown',
    prefers: ['Professional', 'Social', 'Night owl'],
    about: "Bartender with late hours. Looking for someone who doesn't mind my schedule. I'm clean, fun, and respectful of shared spaces."
  }
];

export const mockCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Milk',
    quantity: 1,
    price: 3.99,
    addedBy: 'Alex',
    completed: false,
    addedOn: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Bread',
    quantity: 2,
    price: 2.49,
    addedBy: 'Sarah',
    completed: true,
    addedOn: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Eggs (dozen)',
    quantity: 1,
    price: 4.99,
    addedBy: 'Miguel',
    completed: false,
    addedOn: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Toilet Paper',
    quantity: 12,
    price: 8.99,
    addedBy: 'Emma',
    completed: false,
    addedOn: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Dish Soap',
    quantity: 1,
    price: 3.49,
    addedBy: 'Dave',
    completed: true,
    addedOn: new Date().toISOString()
  }
];

export const mockRentItems: RentItem[] = [
  {
    id: '1',
    name: 'Electric Drill',
    ownerId: '1',
    ownerName: 'Alex Johnson',
    category: 'Tools',
    condition: 'Good',
    rentAmount: 5,
    rentDuration: 'Day',
    description: 'Powerful electric drill, perfect for home improvement projects',
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    available: true
  },
  {
    id: '2',
    name: 'Mountain Bike',
    ownerId: '2',
    ownerName: 'Sarah Wilson',
    category: 'Sports',
    condition: 'Excellent',
    rentAmount: 15,
    rentDuration: 'Day',
    description: 'Trek mountain bike, perfect for weekend adventures',
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    available: true
  },
  {
    id: '3',
    name: 'Projector',
    ownerId: '3',
    ownerName: 'Miguel Rodriguez',
    category: 'Electronics',
    condition: 'Very Good',
    rentAmount: 20,
    rentDuration: 'Day',
    description: 'HD Projector for movie nights or presentations',
    imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    available: true
  },
  {
    id: '4',
    name: 'Camping Tent (4-person)',
    ownerId: '4',
    ownerName: 'Emma Chen',
    category: 'Outdoors',
    condition: 'Good',
    rentAmount: 25,
    rentDuration: 'Weekend',
    description: 'Spacious 4-person tent with rain cover, perfect for camping trips',
    imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    available: false
  },
  {
    id: '5',
    name: 'Party Speakers',
    ownerId: '5',
    ownerName: 'Dave Smith',
    category: 'Electronics',
    condition: 'Excellent',
    rentAmount: 30,
    rentDuration: 'Day',
    description: 'Powerful Bluetooth speakers for parties or events',
    imageUrl: 'https://images.unsplash.com/photo-1558537348-c0f8e733989d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    available: true
  }
];

export const mockAutoShares: AutoShare[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Alex Johnson',
    startLocation: 'Downtown',
    destination: 'Tech Park',
    departureTime: '08:00',
    returnTime: '17:30',
    vehicleType: 'Car',
    seatsAvailable: 3,
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    notes: 'I drive to work every weekday. Happy to share the ride!'
  },
  {
    id: '2',
    userId: '2',
    userName: 'Sarah Wilson',
    startLocation: 'University Area',
    destination: 'City Library',
    departureTime: '09:30',
    returnTime: '16:00',
    vehicleType: 'Bike',
    seatsAvailable: 0,
    days: ['Monday', 'Wednesday', 'Friday'],
    notes: 'I have an extra bike you can borrow if you need to go my route.'
  },
  {
    id: '3',
    userId: '3',
    userName: 'Miguel Rodriguez',
    startLocation: 'Riverside',
    destination: 'Shopping Mall',
    departureTime: '10:00',
    returnTime: '14:00',
    vehicleType: 'Car',
    seatsAvailable: 4,
    days: ['Saturday', 'Sunday'],
    notes: 'Weekend shopping trips. Can pick up along the route.'
  },
  {
    id: '4',
    userId: '4',
    userName: 'Emma Chen',
    startLocation: 'Suburbs',
    destination: 'Downtown',
    departureTime: '07:45',
    returnTime: '18:30',
    vehicleType: 'Car',
    seatsAvailable: 2,
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    notes: 'Daily commute to work downtown. Parking is available.'
  },
  {
    id: '5',
    userId: '5',
    userName: 'Dave Smith',
    startLocation: 'Downtown',
    destination: 'Concert Hall',
    departureTime: '19:00',
    returnTime: '23:00',
    vehicleType: 'Car',
    seatsAvailable: 3,
    days: ['Friday', 'Saturday'],
    notes: 'Going to concerts most weekends. Happy to give rides!'
  }
];

export const mockGamePartners: GamePartner[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Alex Johnson',
    avatar: mockUsers[0].avatar,
    games: ['Chess', 'Settlers of Catan', 'Poker'],
    skillLevels: ['Expert', 'Intermediate', 'Beginner'],
    availability: ['Weekday evenings', 'Weekend afternoons'],
    bio: 'Looking for chess opponents and board game enthusiasts!'
  },
  {
    id: '2',
    userId: '2',
    userName: 'Sarah Wilson',
    avatar: mockUsers[1].avatar,
    games: ['Scrabble', 'Monopoly', 'Chess'],
    skillLevels: ['Expert', 'Intermediate', 'Beginner'],
    availability: ['Weekend mornings', 'Weekend evenings'],
    bio: 'Word game champion looking for worthy opponents!'
  },
  {
    id: '3',
    userId: '3',
    userName: 'Miguel Rodriguez',
    avatar: mockUsers[2].avatar,
    games: ['FIFA', 'Call of Duty', 'Mario Kart'],
    skillLevels: ['Expert', 'Expert', 'Intermediate'],
    availability: ['Daily after 6pm', 'Weekends anytime'],
    bio: 'Competitive gamer looking for teammates and rivals!'
  },
  {
    id: '4',
    userId: '4',
    userName: 'Emma Chen',
    avatar: mockUsers[3].avatar,
    games: ['Dungeons & Dragons', 'Magic: The Gathering', 'Pandemic'],
    skillLevels: ['Intermediate', 'Expert', 'Beginner'],
    availability: ['Thursday evenings', 'Weekend afternoons'],
    bio: 'Looking for a D&D group and MTG players!'
  },
  {
    id: '5',
    userId: '5',
    userName: 'Dave Smith',
    avatar: mockUsers[4].avatar,
    games: ['Poker', 'Blackjack', 'Darts'],
    skillLevels: ['Expert', 'Expert', 'Intermediate'],
    availability: ['Friday nights', 'Saturday nights'],
    bio: 'Love card games and bar games. Always up for a friendly match!'
  }
];

