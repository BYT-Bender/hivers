
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { Package, Search, Filter, RefreshCw } from "lucide-react";
import { mockRentItems } from "@/utils/mockData";
import { saveToLocalStorage, getFromLocalStorage, STORAGE_KEYS } from "@/utils/localStorage";
import { RentItem } from "@/types/rent";

const ItemRenting = () => {
  const [items, setItems] = useState<RentItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newItem, setNewItem] = useState<Omit<RentItem, "id">>({
    name: "",
    ownerId: "user-" + Date.now(),
    ownerName: "",
    category: "",
    condition: "Good",
    rentAmount: 5,
    rentDuration: "Day",
    description: "",
    imageUrl: "",
    available: true
  });
  
  const [filters, setFilters] = useState({
    category: "all",
    minPrice: 0,
    maxPrice: 100,
    condition: "any",
    available: true
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  
  const categories = ["Electronics", "Tools", "Sports", "Outdoors", "Kitchen", "Furniture", "Books", "Other"];
  const conditions = ["Excellent", "Very Good", "Good", "Fair", "Poor"];
  const durations = ["Hour", "Day", "Weekend", "Week", "Month"];
  
  useEffect(() => {
    const savedItems = getFromLocalStorage<RentItem[]>(STORAGE_KEYS.RENT_ITEMS, []);
    if (savedItems.length > 0) {
      setItems(savedItems);
    } else {
      setItems(mockRentItems);
      saveToLocalStorage(STORAGE_KEYS.RENT_ITEMS, mockRentItems);
    }
  }, []);
  
  useEffect(() => {
    if (items.length > 0) {
      saveToLocalStorage(STORAGE_KEYS.RENT_ITEMS, items);
    }
  }, [items]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: name === 'rentAmount' ? Number(value) : value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewItem(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFilterChange = (name: string, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePriceRangeChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1] || prev.maxPrice
    }));
  };
  
  const resetFilters = () => {
    setFilters({
      category: "all",
      minPrice: 0,
      maxPrice: 100,
      condition: "any",
      available: true
    });
    setSearchTerm("");
  };
  
  const addItem = () => {
    if (!newItem.name || !newItem.ownerName || !newItem.category) {
      toast({
        title: "Error",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const imageUrl = newItem.imageUrl || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80`;
    
    const rentItem: RentItem = {
      id: Date.now().toString(),
      ...newItem,
      imageUrl
    };
    
    setItems(prev => [rentItem, ...prev]);
    
    setNewItem({
      name: "",
      ownerId: "user-" + Date.now(),
      ownerName: "",
      category: "",
      condition: "Good",
      rentAmount: 5,
      rentDuration: "Day",
      description: "",
      imageUrl: "",
      available: true
    });
    
    setShowAddForm(false);
    
    toast({
      title: "Item Added",
      description: `${rentItem.name} has been added to the rental marketplace.`
    });
  };
  
  const toggleItemAvailability = (id: string) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  };
  
  const filteredItems = items.filter(item => {
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !item.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (filters.category && filters.category !== "all" && item.category !== filters.category) {
      return false;
    }
    
    if (item.rentAmount < filters.minPrice || item.rentAmount > filters.maxPrice) {
      return false;
    }
    
    if (filters.condition && filters.condition !== "any" && item.condition !== filters.condition) {
      return false;
    }
    
    if (filters.available && !item.available) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Item Renting</h1>
        <p className="text-gray-600 mt-2">Borrow and lend items within your community</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search items..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? "Cancel" : "Add New Item"}
            </Button>
          </div>
          
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Item</CardTitle>
                <CardDescription>Share an item with your community</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={newItem.name} 
                    onChange={handleInputChange} 
                    placeholder="Electric Drill, Mountain Bike, etc." 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Your Name</Label>
                  <Input 
                    id="ownerName" 
                    name="ownerName" 
                    value={newItem.ownerName} 
                    onChange={handleInputChange} 
                    placeholder="Your name" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={newItem.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select 
                      value={newItem.condition}
                      onValueChange={(value) => handleSelectChange("condition", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.map(condition => (
                          <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rentDuration">Duration</Label>
                    <Select 
                      value={newItem.rentDuration}
                      onValueChange={(value) => handleSelectChange("rentDuration", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {durations.map(duration => (
                          <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rentAmount">Rent Amount ($)</Label>
                  <Input 
                    id="rentAmount" 
                    name="rentAmount" 
                    type="number"
                    min={0}
                    step="0.01"
                    value={newItem.rentAmount} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={newItem.description} 
                    onChange={handleInputChange} 
                    placeholder="Describe your item" 
                    rows={3} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL (optional)</Label>
                  <Input 
                    id="imageUrl" 
                    name="imageUrl" 
                    value={newItem.imageUrl} 
                    onChange={handleInputChange} 
                    placeholder="https://..." 
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button onClick={addItem} className="w-full">Add Item</Button>
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
                <Label>Category</Label>
                <Select 
                  value={filters.category}
                  onValueChange={(value) => handleFilterChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Price Range</Label>
                  <span className="text-sm text-gray-500">
                    ${filters.minPrice} - ${filters.maxPrice}
                  </span>
                </div>
                <Slider
                  defaultValue={[filters.minPrice, filters.maxPrice]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={handlePriceRangeChange}
                  className="mt-2"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Condition</Label>
                <Select 
                  value={filters.condition}
                  onValueChange={(value) => handleFilterChange("condition", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any condition</SelectItem>
                    {conditions.map(condition => (
                      <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={filters.available}
                  onChange={() => handleFilterChange("available", !filters.available)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="available" className="text-sm">Available items only</Label>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Available Items</h2>
            <Badge variant="outline" className="flex gap-1 items-center">
              <Filter className="h-3 w-3" /> {filteredItems.length} items
            </Badge>
          </div>
          
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-xl p-8">
              <Package className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No items found</h3>
              <p className="text-center text-gray-500">
                No items match your search criteria. Try adjusting your filters or add a new item.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative h-48 bg-gray-100">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                    {!item.available && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge className="text-lg font-bold bg-red-500 border-red-500">Currently Rented</Badge>
                      </div>
                    )}
                    <Badge className="absolute top-2 left-2">{item.category}</Badge>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{item.name}</CardTitle>
                        <CardDescription>${item.rentAmount} per {item.rentDuration}</CardDescription>
                      </div>
                      <Badge variant="outline">{item.condition}</Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                    <p className="text-sm mt-2">Owner: <span className="font-medium">{item.ownerName}</span></p>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant={item.available ? "default" : "outline"} 
                      size="sm"
                      onClick={() => {
                        if (item.available) {
                          toast({
                            title: "Request Sent",
                            description: `Your request to rent ${item.name} has been sent to ${item.ownerName}.`
                          });
                          toggleItemAvailability(item.id);
                        } else {
                          toast({
                            title: "Item Returned",
                            description: `${item.name} is now available for others to rent.`
                          });
                          toggleItemAvailability(item.id);
                        }
                      }}
                    >
                      {item.available ? "Rent Now" : "Mark as Returned"}
                    </Button>
                    <Button variant="ghost" size="sm">Contact Owner</Button>
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

export default ItemRenting;
