
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, ShoppingCart, Package, Car, Gamepad2, Settings } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const features = [
    {
      title: "Roommate Finder",
      description: "Find your perfect roommate based on lifestyle, budget, and interests.",
      icon: <Home className="h-12 w-12 mb-4 text-primary" />,
      path: "/roommate-finder",
      color: "bg-gradient-to-br from-blue-50 to-blue-100"
    },
    {
      title: "Common Cart",
      description: "Create and manage shared shopping lists with your roommates.",
      icon: <ShoppingCart className="h-12 w-12 mb-4 text-primary" />,
      path: "/common-cart",
      color: "bg-gradient-to-br from-green-50 to-green-100"
    },
    {
      title: "Item Renting",
      description: "Borrow and lend items within your community.",
      icon: <Package className="h-12 w-12 mb-4 text-primary" />,
      path: "/item-renting",
      color: "bg-gradient-to-br from-yellow-50 to-yellow-100"
    },
    {
      title: "Auto Sharing",
      description: "Coordinate carpools and bike sharing with neighbors.",
      icon: <Car className="h-12 w-12 mb-4 text-primary" />,
      path: "/auto-sharing",
      color: "bg-gradient-to-br from-purple-50 to-purple-100"
    },
    {
      title: "Game Partner Finder",
      description: "Find people to play your favorite games with.",
      icon: <Gamepad2 className="h-12 w-12 mb-4 text-primary" />,
      path: "/game-partner",
      color: "bg-gradient-to-br from-pink-50 to-pink-100"
    },
    {
      title: "Settings",
      description: "Update your profile and account settings.",
      icon: <Settings className="h-12 w-12 mb-4 text-primary" />,
      path: "/settings",
      color: "bg-gradient-to-br from-orange-50 to-orange-100"
    }
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to HIVE</h1>
        <p className="text-xl text-gray-600">Your Community Hub for Sharing, Connecting, and Collaborating</p>
        
        {!user && (
          <div className="mt-6">
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="mx-auto"
            >
              Login / Sign up
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card 
            key={index}
            className={`h-full transition-all hover:shadow-lg ${feature.color} hover:-translate-y-1 cursor-pointer`}
            onClick={() => handleNavigate(feature.path)}
          >
            <CardHeader className="flex flex-col items-center">
              {feature.icon}
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription className="text-center">{feature.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <Button variant="default">Open {feature.title}</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;
