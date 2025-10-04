import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Upload } from "lucide-react";
import { toast } from "sonner";

interface EditProfileDialogProps {
  currentUser: {
    name: string;
    location: string;
    bio: string;
    avatar: string;
  };
  onSave: (updatedUser: any) => void;
}

const EditProfileDialog = ({ currentUser, onSave }: EditProfileDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [location, setLocation] = useState(currentUser.location);
  const [bio, setBio] = useState(currentUser.bio);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        toast.success("Profile picture updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave({ name, location, bio, avatar: avatarUrl });
    toast.success("Profile updated successfully!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="text-2xl">{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="avatar-upload"
              />
              <Label htmlFor="avatar-upload">
                <Button variant="outline" size="sm" asChild>
                  <span className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Change Picture
                  </span>
                </Button>
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
