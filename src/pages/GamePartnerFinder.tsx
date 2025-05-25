import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Gamepad2, Search, Filter, RefreshCw, Plus, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { mockGamePartners } from "@/utils/mockData";
import { saveToLocalStorage, getFromLocalStorage, STORAGE_KEYS } from "@/utils/localStorage";
import { GamePartner } from "@/types/game";

const GamePartnerFinder = () => {
  const [partners, setPartners] = useState<GamePartner[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newPartner, setNewPartner] = useState<Partial<GamePartner>>({
    userId: "user-" + Date.now(),
    userName: "",
    avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`,
    games: [],
    skillLevels: [],
    availability: [],
    bio: ""
  });
  
  const [filters, setFilters] = useState({
    game: "all",
    skillLevel: "any",
    availability: "any"
  });
  
  const [newGame, setNewGame] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  const popularGames = ["Chess", "Poker", "Settlers of Catan", "Monopoly", "Scrabble", "Dungeons & Dragons", "Magic: The Gathering", "FIFA", "Call of Duty", "Mario Kart"];
  const skillLevels = ["Beginner", "Intermediate", "Expert", "Professional"];
  const availabilityOptions = ["Weekday mornings", "Weekday afternoons", "Weekday evenings", "Weekend mornings", "Weekend afternoons", "Weekend evenings"];
  
  useEffect(() => {
    const savedPartners = getFromLocalStorage<GamePartner[]>(STORAGE_KEYS.GAME_PARTNERS, []);
    if (savedPartners.length > 0) {
      setPartners(savedPartners);
    } else {
      setPartners(mockGamePartners);
      saveToLocalStorage(STORAGE_KEYS.GAME_PARTNERS, mockGamePartners);
    }
  }, []);
  
  useEffect(() => {
    if (partners.length > 0) {
      saveToLocalStorage(STORAGE_KEYS.GAME_PARTNERS, partners);
    }
  }, [partners]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPartner(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddGame = () => {
    if (newGame && !newPartner.games?.includes(newGame)) {
      setNewPartner(prev => ({
        ...prev,
        games: [...(prev.games || []), newGame],
        skillLevels: [...(prev.skillLevels || []), "Beginner"]
      }));
      setNewGame("");
    }
  };
  
  const handleRemoveGame = (index: number) => {
    setNewPartner(prev => ({
      ...prev,
      games: prev.games?.filter((_, i) => i !== index),
      skillLevels: prev.skillLevels?.filter((_, i) => i !== index)
    }));
  };
  
  const handleSkillChange = (index: number, skill: string) => {
    setNewPartner(prev => {
      const updatedSkills = [...(prev.skillLevels || [])];
      updatedSkills[index] = skill;
      return { ...prev, skillLevels: updatedSkills };
    });
  };
  
  const handleAvailabilityToggle = (availability: string) => {
    setNewPartner(prev => {
      const currentAvailability = prev.availability || [];
      return {
        ...prev,
        availability: currentAvailability.includes(availability)
          ? currentAvailability.filter(a => a !== availability)
          : [...currentAvailability, availability]
      };
    });
  };
  
  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const resetFilters = () => {
    setFilters({
      game: "all",
      skillLevel: "any",
      availability: "any"
    });
    setSearchTerm("");
  };
  
  const addPartner = () => {
    if (!newPartner.userName || !newPartner.games?.length) {
      toast({
        title: "Error",
        description: "Please fill out all required fields and add at least one game.",
        variant: "destructive"
      });
      return;
    }
    
    const gamePartner: GamePartner = {
      id: Date.now().toString(),
      userId: newPartner.userId || "",
      userName: newPartner.userName || "",
      avatar: newPartner.avatar || "",
      games: newPartner.games || [],
      skillLevels: newPartner.skillLevels || [],
      availability: newPartner.availability || [],
      bio: newPartner.bio || ""
    };
    
    setPartners(prev => [gamePartner, ...prev]);
    
    setNewPartner({
      userId: "user-" + Date.now(),
      userName: "",
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`,
      games: [],
      skillLevels: [],
      availability: [],
      bio: ""
    });
    
    setShowAddForm(false);
    
    toast({
      title: "Profile Added",
      description: `Your game partner profile has been published.`
    });
  };
  
  const filteredPartners = partners.filter(partner => {
    if (searchTerm && 
        !partner.userName.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !partner.bio.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (filters.game && filters.game !== "all" && !partner.games.some(game => game.toLowerCase() === filters.game.toLowerCase())) {
      return false;
    }
    
    if (filters.skillLevel && filters.skillLevel !== "any") {
      const gameIndex = filters.game !== "all" ? partner.games.findIndex(g => g.toLowerCase() === filters.game.toLowerCase()) : -1;
      
      if (gameIndex === -1) {
        if (!partner.skillLevels.some(skill => skill === filters.skillLevel)) {
          return false;
        }
      } else {
        if (partner.skillLevels[gameIndex] !== filters.skillLevel) {
          return false;
        }
      }
    }
    
    if (filters.availability && filters.availability !== "any" && !partner.availability.includes(filters.availability)) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Game Partner Finder</h1>
        <p className="text-gray-600 mt-2">Find people to play your favorite games with</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search by name or bio..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? "Cancel" : "Add Your Profile"}
            </Button>
          </div>
          
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>Create Your Profile</CardTitle>
                <CardDescription>Let others know what games you play</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userName">Your Name</Label>
                  <Input 
                    id="userName" 
                    name="userName" 
                    value={newPartner.userName} 
                    onChange={handleInputChange} 
                    placeholder="Your name" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Games & Skill Levels</Label>
                  
                  <div className="space-y-2">
                    {newPartner.games?.map((game, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="flex-1 flex items-center justify-between bg-muted p-2 rounded-md">
                          <span>{game}</span>
                          <Select 
                            value={newPartner.skillLevels?.[index] || "Beginner"}
                            onValueChange={(value) => handleSkillChange(index, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {skillLevels.map(level => (
                                <SelectItem key={level} value={level}>{level}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveGame(index)}
                          className="p-0 w-8 h-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Select 
                        value={newGame}
                        onValueChange={setNewGame}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a game" />
                        </SelectTrigger>
                        <SelectContent>
                          {popularGames
                            .filter(game => !newPartner.games?.includes(game))
                            .map(game => (
                              <SelectItem key={game} value={game}>{game}</SelectItem>
                            ))}
                          <SelectItem value="other">Other (custom)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAddGame}
                      disabled={!newGame}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {newGame === 'other' && (
                    <Input 
                      placeholder="Enter custom game name" 
                      value={newGame === 'other' ? '' : newGame}
                      onChange={(e) => setNewGame(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddGame()}
                    />
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Availability</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {availabilityOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`availability-${option}`}
                          checked={newPartner.availability?.includes(option) || false}
                          onChange={() => handleAvailabilityToggle(option)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor={`availability-${option}`} className="text-sm">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">About You</Label>
                  <Textarea 
                    id="bio" 
                    name="bio" 
                    value={newPartner.bio} 
                    onChange={handleInputChange} 
                    placeholder="Tell others about your gaming style and preferences" 
                    rows={3} 
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button onClick={addPartner} className="w-full">Create Profile</Button>
              </CardFooter>
            </Card>
          )}
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Filters</CardTitle>
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Game</Label>
                <Select 
                  value={filters.game}
                  onValueChange={(value) => handleFilterChange("game", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any game" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any game</SelectItem>
                    {popularGames.map(game => (
                      <SelectItem key={game} value={game}>{game}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Skill Level</Label>
                <Select 
                  value={filters.skillLevel}
                  onValueChange={(value) => handleFilterChange("skillLevel", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any skill level</SelectItem>
                    {skillLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Availability</Label>
                <Select 
                  value={filters.availability}
                  onValueChange={(value) => handleFilterChange("availability", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any availability</SelectItem>
                    {availabilityOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Game Partners</h2>
            <Badge variant="outline">{filteredPartners.length} found</Badge>
          </div>
          
          {filteredPartners.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-xl p-8">
              <Gamepad2 className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No players found</h3>
              <p className="text-center text-gray-500">
                No players match your search criteria. Try adjusting your filters or create your profile to join the community.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPartners.map((partner) => (
                <Card key={partner.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={partner.avatar} alt={partner.userName} />
                        <AvatarFallback>{partner.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{partner.userName}</CardTitle>
                        <CardDescription>
                          {partner.games.length} {partner.games.length === 1 ? 'game' : 'games'}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Games & Skill Levels</h4>
                      <div className="space-y-1.5">
                        {partner.games.map((game, index) => (
                          <div key={game} className="flex items-center justify-between text-sm">
                            <span>{game}</span>
                            <Badge variant="outline">{partner.skillLevels[index]}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Availability</h4>
                      <div className="flex flex-wrap gap-1">
                        {partner.availability.map((time) => (
                          <span 
                            key={time} 
                            className="text-xs bg-secondary/10 text-secondary-foreground rounded-full px-2 py-0.5"
                          >
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600">{partner.bio}</p>
                  </CardContent>
                  
                  <CardFooter>
                    <Button className="w-full">Connect</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamePartnerFinder;
