import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { mockUsers, mockRoommatePreferences } from "@/utils/mockData";
import { saveToLocalStorage, getFromLocalStorage, STORAGE_KEYS } from "@/utils/localStorage";
import { RoommatePreference, RoommateFormData } from "@/types/roommate";
import { User } from "@/types/user";

const RoommateFinder = () => {
  const [formData, setFormData] = useState<RoommateFormData>({
    name: "",
    age: 25,
    gender: "",
    budget: 1000,
    location: "",
    interests: "",
    about: "",
  });

  const [filters, setFilters] = useState({
    location: "all",
    minBudget: 500,
    maxBudget: 2000,
    gender: "any"
  });
  
  const [roommates, setRoommates] = useState<Array<User & RoommatePreference>>([]);
  const [matches, setMatches] = useState<Array<User & RoommatePreference>>([]);
  const [showForm, setShowForm] = useState(true);
  
  useEffect(() => {
    const combinedData = mockUsers.map(user => {
      const preference = mockRoommatePreferences.find(pref => pref.userId === user.id);
      return { ...user, ...preference };
    }) as Array<User & RoommatePreference>;
    
    setRoommates(combinedData);
    
    const savedProfile = getFromLocalStorage<RoommateFormData | null>(STORAGE_KEYS.USER_PROFILE, null);
    if (savedProfile) {
      setFormData(savedProfile);
      setShowForm(false);
      findMatches(savedProfile);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'age' || name === 'budget' ? Number(value) : value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (name: string, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    applyFilters({ ...filters, [name]: value });
  };

  const handleBudgetChange = (value: number[]) => {
    setFilters(prev => ({ ...prev, minBudget: value[0], maxBudget: value[1] || prev.maxBudget }));
    applyFilters({ ...filters, minBudget: value[0], maxBudget: value[1] || filters.maxBudget });
  };

  const applyFilters = (currentFilters: typeof filters) => {
    const filtered = roommates.filter(roommate => {
      if (!roommate.budget || !roommate.location) return false;
      
      const locationMatch = !currentFilters.location || currentFilters.location === "all" || roommate.location.toLowerCase().includes(currentFilters.location.toLowerCase());
      const budgetMatch = roommate.budget >= currentFilters.minBudget && roommate.budget <= currentFilters.maxBudget;
      const genderMatch = !currentFilters.gender || currentFilters.gender === "any" || roommate.gender === currentFilters.gender;
      
      return locationMatch && budgetMatch && genderMatch;
    });
    
    setMatches(filtered);
  };

  const findMatches = (profile: RoommateFormData) => {
    const matched = roommates.filter(roommate => {
      if (!roommate.budget || !roommate.location) return false;
      const budgetMatch = Math.abs(roommate.budget - profile.budget) / profile.budget <= 0.2;
      const locationMatch = roommate.location.toLowerCase() === profile.location.toLowerCase();
      const userInterests = profile.interests.toLowerCase().split(',').map(i => i.trim());
      const commonInterests = roommate.interests.some(interest => 
        userInterests.some(userInterest => interest.toLowerCase().includes(userInterest))
      );
      
      return budgetMatch && locationMatch && commonInterests;
    });
    
    setMatches(matched);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveToLocalStorage(STORAGE_KEYS.USER_PROFILE, formData);
    findMatches(formData);
    setShowForm(false);
    toast({
      title: "Profile Saved",
      description: "Your roommate preferences have been saved and matches have been found!",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Roommate Finder</h1>
        <p className="text-gray-600 mt-2">Find your perfect roommate based on location, budget, and interests</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            {showForm ? (
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Your Information</CardTitle>
                  <CardDescription>Tell us about yourself to find compatible roommates</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      placeholder="Your name" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input 
                      id="age" 
                      name="age" 
                      type="number" 
                      min={18} 
                      max={100} 
                      value={formData.age} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select 
                      value={formData.gender} 
                      onValueChange={(value) => handleSelectChange("gender", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Non-binary">Non-binary</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget ($/month)</Label>
                    <Input 
                      id="budget" 
                      name="budget" 
                      type="number" 
                      min={0} 
                      step={50} 
                      value={formData.budget} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Preferred Location</Label>
                    <Select 
                      value={formData.location} 
                      onValueChange={(value) => handleSelectChange("location", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Downtown">Downtown</SelectItem>
                        <SelectItem value="Suburbs">Suburbs</SelectItem>
                        <SelectItem value="University Area">University Area</SelectItem>
                        <SelectItem value="Riverside">Riverside</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="interests">Interests (comma-separated)</Label>
                    <Input 
                      id="interests" 
                      name="interests" 
                      value={formData.interests} 
                      onChange={handleInputChange} 
                      placeholder="Reading, Cooking, Hiking..." 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="about">About You</Label>
                    <Textarea 
                      id="about" 
                      name="about" 
                      value={formData.about} 
                      onChange={handleInputChange} 
                      placeholder="Tell potential roommates about yourself" 
                      rows={4} 
                      required 
                    />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button type="submit" className="w-full">Find Matches</Button>
                </CardFooter>
              </form>
            ) : (
              <>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>Your roommate preferences</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold">Name</p>
                    <p>{formData.name}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold">Age</p>
                      <p>{formData.age}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-semibold">Gender</p>
                      <p>{formData.gender}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold">Budget</p>
                      <p>${formData.budget}/month</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-semibold">Location</p>
                      <p>{formData.location}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold">Interests</p>
                    <p>{formData.interests}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold">About</p>
                    <p className="text-sm text-gray-600">{formData.about}</p>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowForm(true)} 
                    className="w-full"
                  >
                    Edit Profile
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
          
          {!showForm && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Filter Matches</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select 
                    value={filters.location} 
                    onValueChange={(value) => handleFilterChange("location", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any location</SelectItem>
                      <SelectItem value="Downtown">Downtown</SelectItem>
                      <SelectItem value="Suburbs">Suburbs</SelectItem>
                      <SelectItem value="University Area">University Area</SelectItem>
                      <SelectItem value="Riverside">Riverside</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Budget Range</Label>
                    <span className="text-sm text-gray-500">
                      ${filters.minBudget} - ${filters.maxBudget}
                    </span>
                  </div>
                  <Slider
                    defaultValue={[filters.minBudget, filters.maxBudget]}
                    min={500}
                    max={2000}
                    step={100}
                    onValueChange={handleBudgetChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select 
                    value={filters.gender} 
                    onValueChange={(value) => handleFilterChange("gender", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any gender</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Non-binary">Non-binary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="lg:col-span-2">
          {!showForm ? (
            <>
              <h2 className="text-2xl font-bold mb-4">Your Matches ({matches.length})</h2>
              
              {matches.length === 0 ? (
                <p className="text-gray-500">No matches found with your current criteria.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matches.map((match) => (
                    <Card key={match.id} className="overflow-hidden">
                      <div className="relative h-48 bg-gray-100">
                        <img 
                          src={match.avatar} 
                          alt={match.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{match.name}, {match.age}</CardTitle>
                            <CardDescription>{match.location} · ${match.budget}/month</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-2">
                        <div>
                          <p className="text-sm font-medium">Interests</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {match.interests.map((interest, index) => (
                              <span 
                                key={index} 
                                className="text-xs bg-primary/10 text-primary rounded-full px-2 py-1"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium">Preferences</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {match.prefers?.map((pref, index) => (
                              <span 
                                key={index} 
                                className="text-xs bg-secondary/10 text-secondary-foreground rounded-full px-2 py-1"
                              >
                                {pref}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 line-clamp-2">{match.about}</p>
                      </CardContent>
                      
                      <CardFooter>
                        <Button variant="secondary" className="w-full">
                          Contact {match.name.split(' ')[0]}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-gray-200 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-2">Fill out your profile</h2>
              <p className="text-center text-gray-500 mb-4">
                Complete your profile information to find compatible roommates based on location, 
                budget, and shared interests.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-4">
                <Card className="p-4 text-center">
                  <h3 className="font-bold">Enter your preferences</h3>
                  <p className="text-xs text-gray-500">Tell us what you're looking for</p>
                </Card>
                <Card className="p-4 text-center">
                  <h3 className="font-bold">Find matches</h3>
                  <p className="text-xs text-gray-500">We'll match you with compatible roommates</p>
                </Card>
                <Card className="p-4 text-center">
                  <h3 className="font-bold">Connect</h3>
                  <p className="text-xs text-gray-500">Contact potential roommates directly</p>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoommateFinder;
