import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, ImageIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import type { Profile } from "@/components/dashboard/types";

type FormData = {
  username: string;
  full_name: string;
  bio: string;
  website: string;
};

const SettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  const { register, handleSubmit, setValue } = useForm<FormData>();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setProfile(profile);
        setValue("username", profile.username || "");
        setValue("full_name", profile.full_name || "");
        setValue("bio", profile.bio || "");
        setValue("website", profile.website || "");
      }
      setLoading(false);
    };

    fetchProfile();
  }, [navigate, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          username: data.username,
          full_name: data.full_name,
          bio: data.bio,
          website: data.website,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated successfully",
        description: "Your profile information has been updated.",
      });

      navigate(`/profile/${data.username}`);
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      setUploading(true);

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${profile?.id}/${type}_${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile_images')
        .getPublicUrl(filePath);

      const updateData = type === 'avatar' 
        ? { avatar_url: publicUrl }
        : { banner_url: publicUrl };

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', profile?.id);

      if (updateError) throw updateError;

      setProfile(prev => prev ? { ...prev, ...updateData } : null);

      toast({
        title: `${type === 'avatar' ? 'Profile picture' : 'Banner'} updated`,
        description: `Your ${type === 'avatar' ? 'profile picture' : 'banner'} has been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error uploading image",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", profile?.id);

      if (error) throw error;

      await supabase.auth.signOut();
      navigate("/");

      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error deleting account",
        description: "There was an error deleting your account. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="container max-w-2xl mx-auto py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-gray-800 rounded-lg"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-800 rounded w-1/4"></div>
              <div className="h-8 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-4">Account Settings</h1>
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">Profile Images</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <Label htmlFor="avatar" className="text-white">Profile Picture</Label>
                    <div className="relative group cursor-pointer">
                      <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-800 border-2 border-dashed border-gray-600 hover:border-primary transition-colors">
                        {profile?.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Camera className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <div className="text-white text-sm text-center px-2">
                            <Camera className="w-6 h-6 mx-auto mb-1" />
                            Click to change
                          </div>
                        </div>
                      </div>
                      <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'avatar')}
                        disabled={uploading}
                        className="absolute inset-0 opacity-0 cursor-pointer w-32 h-32"
                      />
                    </div>
                    <p className="text-sm text-gray-400">
                      Recommended: Square image, at least 400x400px
                    </p>
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="banner" className="text-white">Banner Image</Label>
                    <div className="relative group cursor-pointer">
                      <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-800 border-2 border-dashed border-gray-600 hover:border-primary transition-colors">
                        {profile?.banner_url ? (
                          <img
                            src={profile.banner_url}
                            alt="Banner"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <div className="text-white text-sm text-center px-2">
                            <ImageIcon className="w-6 h-6 mx-auto mb-1" />
                            Click to change
                          </div>
                        </div>
                      </div>
                      <Input
                        id="banner"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'banner')}
                        disabled={uploading}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                    <p className="text-sm text-gray-400">
                      Recommended: 1200x400px image for best display
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username" className="text-white">Username</Label>
                    <Input
                      id="username"
                      {...register("username")}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="full_name" className="text-white">Full Name</Label>
                    <Input
                      id="full_name"
                      {...register("full_name")}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio" className="text-white">Bio</Label>
                    <Textarea
                      id="bio"
                      {...register("bio")}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website" className="text-white">Website</Label>
                    <Input
                      id="website"
                      {...register("website")}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Save Changes
                </Button>
              </form>

              <div className="pt-6 border-t border-gray-800">
                <h2 className="text-lg font-semibold text-white mb-4">Danger Zone</h2>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-gray-800 border-gray-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-400">
                        This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;