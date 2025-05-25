
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart, Trash2, X, Check, Plus, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { mockCartItems } from "@/utils/mockData";
import { saveToLocalStorage, getFromLocalStorage, STORAGE_KEYS } from "@/utils/localStorage";
import { CartItem } from "@/types/cart";

const CommonCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    price: 0,
    addedBy: ""
  });
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const savedItems = getFromLocalStorage<CartItem[]>(STORAGE_KEYS.CART_ITEMS, []);
    if (savedItems.length > 0) {
      setItems(savedItems);
    } else {
      setItems(mockCartItems);
      saveToLocalStorage(STORAGE_KEYS.CART_ITEMS, mockCartItems);
    }
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      saveToLocalStorage(STORAGE_KEYS.CART_ITEMS, items);
    }
  }, [items]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'quantity' && Number(value) < 1) return;
    if (name === 'price' && Number(value) < 0) return;
    
    setNewItem(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? Number(value) : value
    }));
  };

  const addItem = () => {
    if (!newItem.name || !newItem.addedBy) {
      toast({
        title: "Error",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newCartItem: CartItem = {
      id: Date.now().toString(),
      name: newItem.name,
      quantity: newItem.quantity,
      price: newItem.price,
      addedBy: newItem.addedBy,
      completed: false,
      addedOn: new Date().toISOString()
    };

    setItems(prev => [newCartItem, ...prev]);
    setNewItem({ name: "", quantity: 1, price: 0, addedBy: newItem.addedBy });

    toast({
      title: "Item Added",
      description: `${newItem.name} has been added to the cart.`
    });
  };

  const toggleItemStatus = (id: string) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    
    toast({
      title: "Item Removed",
      description: "The item has been removed from the cart."
    });
  };

  const clearCompletedItems = () => {
    setItems(prev => prev.filter(item => !item.completed));
    
    toast({
      title: "Cleared",
      description: "All completed items have been removed."
    });
  };

  const filteredItems = items.filter(item => {
    if (filter === "all") return true;
    if (filter === "pending") return !item.completed;
    if (filter === "completed") return item.completed;
    return true;
  });

  const calculateTotal = () => {
    return filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  const pendingCount = items.filter(item => !item.completed).length;
  const completedCount = items.filter(item => item.completed).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Common Cart</h1>
        <p className="text-gray-600 mt-2">Add and manage shared shopping items with your roommates</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Add New Item</CardTitle>
              <CardDescription>Add items to your shared shopping list</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={newItem.name} 
                  onChange={handleInputChange} 
                  placeholder="Milk, Bread, etc." 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input 
                    id="quantity" 
                    name="quantity" 
                    type="number"
                    min={1}
                    value={newItem.quantity} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input 
                    id="price" 
                    name="price" 
                    type="number"
                    step="0.01"
                    min={0}
                    value={newItem.price} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="addedBy">Added By</Label>
                <Input 
                  id="addedBy" 
                  name="addedBy" 
                  value={newItem.addedBy} 
                  onChange={handleInputChange} 
                  placeholder="Your name" 
                  required 
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button onClick={addItem} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Shopping Summary</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending Items</span>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">{pendingCount}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Completed Items</span>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">{completedCount}</span>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-medium">Total Amount</span>
                <span className="font-bold">${calculateTotal()}</span>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                variant="outline" 
                onClick={clearCompletedItems} 
                className="w-full"
                disabled={completedCount === 0}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Clear Completed Items
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Shopping List</h2>
            
            <div className="flex space-x-2">
              <Button 
                variant={filter === "all" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button 
                variant={filter === "pending" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setFilter("pending")}
              >
                Pending
              </Button>
              <Button 
                variant={filter === "completed" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setFilter("completed")}
              >
                Completed
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setItems(mockCartItems);
                  toast({ title: "Reset", description: "Shopping list has been reset to default items." });
                }}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-xl p-8">
              <ShoppingCart className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No items found</h3>
              <p className="text-center text-gray-500">
                {filter === "all" 
                  ? "Your shopping list is empty. Add some items to get started!" 
                  : filter === "pending" 
                    ? "No pending items. All items have been purchased!" 
                    : "No completed items yet. Mark items as purchased when done."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <Card 
                  key={item.id} 
                  className={`transition-colors ${item.completed ? 'bg-muted' : ''}`}
                >
                  <div className="flex items-center p-4">
                    <div className="flex items-center mr-4">
                      <Checkbox 
                        checked={item.completed} 
                        onCheckedChange={() => toggleItemStatus(item.id)}
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {item.name} {item.quantity > 1 && `(${item.quantity})`}
                        </p>
                        <span className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <span>Added by {item.addedBy}</span>
                        <span className="mx-2">•</span>
                        <span>
                          {new Date(item.addedOn).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex items-center space-x-2">
                      {item.completed ? (
                        <Check className="h-5 w-5 text-green-600" />
                      ) : null}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommonCart;
