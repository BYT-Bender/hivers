import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Car, Calendar, Clock, Map, User, ArrowRight, Filter } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { mockAutoShares } from "@/utils/mockData";
import { saveToLocalStorage, getFromLocalStorage, STORAGE_KEYS } from "@/utils/localStorage";
import { AutoShare } from "@/types/auto";

const AutoSharing = () => {
  const [shares, setShares] = useState<AutoShare[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const vehicleTypes = ["Car", "Bike", "Scooter", "Public Transport"];
  
  const [newShare, setNewShare] = useState<Omit<AutoShare, "id">>({
    userId: "user-" + Date.now(),
    userName: "",
    startLocation: "",
    destination: "",
    departureTime: "",
    returnTime: "",
    vehicleType: "Car",
    seatsAvailable: 1,
    days: [],
    notes: ""
  });
  
  const [filters, setFilters] = useState({
    startLocation: "",
    destination: "",
    vehicleType: "all",
    day: "any"
  });
  
  useEffect(() => {
    const savedShares = getFromLocalStorage<AutoShare[]>(STORAGE_KEYS.AUTO_SHARES, []);
    if (savedShares.length > 0) {
      setShares(savedShares);
    } else {
      setShares(mockAutoShares);
      saveToLocalStorage(STORAGE_KEYS.AUTO_SHARES, mockAutoShares);
    }
  }, []);
  
  useEffect(() => {
    if (shares.length > 0) {
      saveToLocalStorage(STORAGE_KEYS.AUTO_SHARES, shares);
    }
  }, [shares]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewShare(prev => ({ 
      ...prev, 
      [name]: name === 'seatsAvailable' ? Number(value) : value 
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewShare(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDayToggle = (day: string) => {
    setNewShare(prev => {
      const days = prev.days.includes(day) 
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day];
      return { ...prev, days };
    });
  };
  
  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const resetFilters = () => {
    setFilters({
      startLocation: "",
      destination: "",
      vehicleType: "all",
      day: "any"
    });
  };
  
  const addShare = () => {
    if (!newShare.userName || !newShare.startLocation || !newShare.destination || !newShare.departureTime || newShare.days.length === 0) {
      toast({
        title: "Error",
        description: "Please fill out all required fields and select at least one day.",
        variant: "destructive"
      });
      return;
    }
    
    const autoShare: AutoShare = {
      id: Date.now().toString(),
      ...newShare
    };
    
    setShares(prev => [autoShare, ...prev]);
    
    setNewShare({
      userId: "user-" + Date.now(),
      userName: "",
      startLocation: "",
      destination: "",
      departureTime: "",
      returnTime: "",
      vehicleType: "Car",
      seatsAvailable: 1,
      days: [],
      notes: ""
    });
    
    setShowAddForm(false);
    
    toast({
      title: "Route Added",
      description: `Your ${autoShare.vehicleType.toLowerCase()} sharing route has been published.`
    });
  };
  
  const filteredShares = shares.filter(share => {
    if (filters.startLocation && !share.startLocation.toLowerCase().includes(filters.startLocation.toLowerCase())) {
      return false;
    }
    
    if (filters.destination && !share.destination.toLowerCase().includes(filters.destination.toLowerCase())) {
      return false;
    }
    
    if (filters.vehicleType && filters.vehicleType !== "all" && share.vehicleType !== filters.vehicleType) {
      return false;
    }
    
    if (filters.day && filters.day !== "any" && !share.days.includes(filters.day)) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Auto Sharing</h1>
        <p className="text-gray-600 mt-2">Coordinate carpools and bike sharing with neighbors</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Button 
            onClick={() => setShowAddForm(!showAddForm)} 
            className="w-full"
          >
            {showAddForm ? "Cancel" : "Add New Route"}
          </Button>
          
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Route</CardTitle>
                <CardDescription>Share your regular commute with others</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userName">Your Name</Label>
                  <Input 
                    id="userName" 
                    name="userName" 
                    value={newShare.userName} 
                    onChange={handleInputChange} 
                    placeholder="Your name" 
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startLocation">Start Location</Label>
                    <Input 
                      id="startLocation" 
                      name="startLocation" 
                      value={newShare.startLocation} 
                      onChange={handleInputChange} 
                      placeholder="Downtown" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination</Label>
                    <Input 
                      id="destination" 
                      name="destination" 
                      value={newShare.destination} 
                      onChange={handleInputChange} 
                      placeholder="University" 
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="departureTime">Departure Time</Label>
                    <Input 
                      id="departureTime" 
                      name="departureTime" 
                      type="time"
                      value={newShare.departureTime} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="returnTime">Return Time (optional)</Label>
                    <Input 
                      id="returnTime" 
                      name="returnTime" 
                      type="time"
                      value={newShare.returnTime} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">Vehicle Type</Label>
                    <Select 
                      value={newShare.vehicleType}
                      onValueChange={(value) => handleSelectChange("vehicleType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="seatsAvailable">Seats Available</Label>
                    <Input 
                      id="seatsAvailable" 
                      name="seatsAvailable" 
                      type="number"
                      min={0}
                      value={newShare.seatsAvailable} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Days Available</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {weekdays.map(day => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={`day-${day}`}
                          checked={newShare.days.includes(day)}
                          onCheckedChange={() => handleDayToggle(day)}
                        />
                        <Label htmlFor={`day-${day}`} className="text-sm">
                          {day.slice(0, 3)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea 
                    id="notes" 
                    name="notes" 
                    value={newShare.notes} 
                    onChange={handleInputChange} 
                    placeholder="Any additional information" 
                    rows={3} 
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button onClick={addShare} className="w-full">Add Route</Button>
              </CardFooter>
            </Card>
          )}
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Filters</CardTitle>
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <Filter className="h-4 w-4" />
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Start Location</Label>
                <Input 
                  placeholder="Filter by start location" 
                  value={filters.startLocation} 
                  onChange={(e) => handleFilterChange("startLocation", e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label>Destination</Label>
                <Input 
                  placeholder="Filter by destination" 
                  value={filters.destination} 
                  onChange={(e) => handleFilterChange("destination", e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label>Vehicle Type</Label>
                <Select 
                  value={filters.vehicleType}
                  onValueChange={(value) => handleFilterChange("vehicleType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any vehicle</SelectItem>
                    {vehicleTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Day</Label>
                <Select 
                  value={filters.day}
                  onValueChange={(value) => handleFilterChange("day", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any day</SelectItem>
                    {weekdays.map(day => (
                      <SelectItem key={day} value={day}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Available Routes</h2>
            <Badge variant="outline">{filteredShares.length} routes found</Badge>
          </div>
          
          {filteredShares.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-xl p-8">
              <Car className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No routes found</h3>
              <p className="text-center text-gray-500">
                No routes match your search criteria. Try adjusting your filters or add a new route.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredShares.map((share) => (
                <Card key={share.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-4">
                          <Badge variant={share.vehicleType === 'Car' ? 'default' : 'secondary'}>
                            {share.vehicleType}
                          </Badge>
                          {share.vehicleType === 'Car' && share.seatsAvailable > 0 && (
                            <Badge variant="outline">
                              {share.seatsAvailable} seat{share.seatsAvailable > 1 ? 's' : ''} available
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <Map className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                            <div>
                              <div className="flex items-center">
                                <span className="font-medium">{share.startLocation}</span>
                                <ArrowRight className="h-3 w-3 mx-2" />
                                <span className="font-medium">{share.destination}</span>
                              </div>
                              
                              <div className="text-sm text-gray-600 mt-1">
                                <div className="flex items-center">
                                  <Clock className="h-3.5 w-3.5 mr-1" /> 
                                  <span>
                                    Departure: {share.departureTime}
                                    {share.returnTime && ` • Return: ${share.returnTime}`}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <Calendar className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                            <div>
                              <div className="flex flex-wrap gap-1">
                                {share.days.map((day) => (
                                  <span 
                                    key={day} 
                                    className="text-xs bg-secondary/20 text-secondary-foreground rounded-full px-2 py-0.5"
                                  >
                                    {day}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <User className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                            <div>
                              <div className="font-medium">{share.userName}</div>
                              {share.notes && (
                                <p className="text-sm text-gray-600 mt-1">{share.notes}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-row md:flex-col justify-center md:justify-start gap-2">
                        <Button className="w-full">Contact</Button>
                        <Button variant="outline" className="w-full">Join Route</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoSharing;
