import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Shield, Save, Camera } from 'lucide-react';
import { toast } from 'sonner';

export function ProfilePage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Placeholder user data - will be connected to auth context later
  const [userData, setUserData] = useState({
    name: 'User Name',
    email: 'user@example.com',
    role: 'Admin',
    avatar: '',
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Connect to actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="bg-[#111111] border-b border-white/10 px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">
            Profile Settings
          </h1>
          <p className="text-gray-400 mt-2">Manage your account settings and preferences</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Profile Card */}
        <div className="bg-[#111111] border border-white/10 rounded-[2rem] overflow-hidden">
          {/* Avatar Section */}
          <div className="relative h-48 bg-gradient-to-br from-[#F6C453]/20 to-[#CBA34E]/10">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="w-32 h-32 bg-[#111111] border-4 border-[#0A0A0A] rounded-full flex items-center justify-center">
                  {userData.avatar ? (
                    <img
                      src={userData.avatar}
                      alt={userData.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-gray-600" />
                  )}
                </div>
                <button
                  className="absolute bottom-0 right-0 w-10 h-10 bg-[#F6C453] rounded-full flex items-center justify-center hover:bg-[#f6d16f] transition-colors"
                  title="Change avatar"
                >
                  <Camera className="w-5 h-5 text-black" />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                  {userData.name}
                </h2>
                <p className="text-gray-400 mt-1">{userData.email}</p>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black rounded-xl transition-all uppercase text-sm tracking-wider"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black rounded-xl transition-all uppercase text-sm tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-3 bg-[#F6C453] text-black font-black rounded-xl hover:bg-[#f6d16f] transition-all uppercase text-sm tracking-wider disabled:opacity-50 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#F6C453]/30 transition-colors ${
                    !isEditing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#F6C453]/30 transition-colors ${
                    !isEditing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              {/* Role (Read-only) */}
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                  <Shield className="w-4 h-4 inline mr-2" />
                  Role
                </label>
                <input
                  type="text"
                  value={userData.role}
                  disabled
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-600 mt-2">
                  Your role is managed by your organization admin
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sections - Coming Soon */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-[#111111]/40 border border-white/5 rounded-[2rem] p-6 opacity-50">
            <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">
              Security
            </h3>
            <p className="text-sm text-gray-500">
              Password & 2FA settings coming soon
            </p>
          </div>
          <div className="bg-[#111111]/40 border border-white/5 rounded-[2rem] p-6 opacity-50">
            <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">
              Preferences
            </h3>
            <p className="text-sm text-gray-500">
              Theme & notification settings coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
