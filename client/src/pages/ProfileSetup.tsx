import { useState } from 'react';
import { useLocation } from 'wouter';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/hooks/useAuth';
import { db, storage } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Camera, Loader2 } from 'lucide-react';

export default function ProfileSetup() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    bio: '',
    phoneNumber: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(user?.profilePicture || '');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let profilePictureUrl = user.profilePicture;

      // Upload profile image if selected
      if (profileImage) {
        const imageRef = ref(storage, `profile-pictures/${user.uid}`);
        await uploadBytes(imageRef, profileImage);
        profilePictureUrl = await getDownloadURL(imageRef);
      }

      // Update user document
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName: formData.displayName,
        bio: formData.bio,
        phoneNumber: formData.phoneNumber,
        profilePicture: profilePictureUrl,
      });

      setLocation('/home');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-whatsapp-bg dark:bg-whatsapp-dark-bg">
      <div className="max-w-md mx-auto p-6">
        <Card className="bg-white dark:bg-whatsapp-dark-surface rounded-2xl shadow-lg p-6 mt-8">
          <CardContent className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Setup Your Profile
              </h2>
              <p className="text-whatsapp-text dark:text-whatsapp-text-secondary">
                Let's personalize your XChat experience
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture Upload */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <i className="fas fa-user text-gray-400 text-2xl"></i>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-whatsapp-green text-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-whatsapp-dark-green transition-colors">
                    <Camera className="w-4 h-4" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-whatsapp-text-secondary mt-2">Add profile photo</p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="displayName" className="text-gray-700 dark:text-gray-300">
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    placeholder="Enter your name"
                    className="mt-2 bg-white dark:bg-whatsapp-dark-elevated border-gray-300 dark:border-gray-600 focus:ring-whatsapp-green focus:border-whatsapp-green"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="bio" className="text-gray-700 dark:text-gray-300">
                    Bio (Optional)
                  </Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell others about yourself"
                    rows={3}
                    className="mt-2 bg-white dark:bg-whatsapp-dark-elevated border-gray-300 dark:border-gray-600 focus:ring-whatsapp-green focus:border-whatsapp-green resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="phoneNumber" className="text-gray-700 dark:text-gray-300">
                    Phone Number (Optional)
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="+977 XXXXXXXXXX"
                    className="mt-2 bg-white dark:bg-whatsapp-dark-elevated border-gray-300 dark:border-gray-600 focus:ring-whatsapp-green focus:border-whatsapp-green"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !formData.displayName.trim()}
                className="w-full bg-whatsapp-green text-white rounded-xl py-3 font-medium hover:bg-whatsapp-dark-green transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  'Complete Setup'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
