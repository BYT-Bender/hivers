
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles" as any)
          .select("username, avatar_url")
          .eq("id", user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        if (data) {
          setUsername(data.username || "");
          setAvatarUrl(data.avatar_url || "");
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error fetching profile",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, toast]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from("profiles" as any)
        .upsert({
          id: user.id,
          username,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        });
        
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Manage your profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input 
              id="email" 
              value={user?.email || ""} 
              disabled 
              className="bg-muted"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">Username</label>
            <Input 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="avatarUrl" className="text-sm font-medium">Avatar URL</label>
            <Input 
              id="avatarUrl" 
              value={avatarUrl} 
              onChange={(e) => setAvatarUrl(e.target.value)} 
              disabled={loading}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          
          {avatarUrl && (
            <div className="mt-4 flex justify-center">
              <img 
                src={avatarUrl} 
                alt="Avatar preview" 
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/150";
                }}
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleUpdateProfile} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium text-red-600 mb-2">Danger Zone</h3>
            <p className="text-sm text-gray-500 mb-4">
              Signing out will end your current session
            </p>
            <Button variant="destructive" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
