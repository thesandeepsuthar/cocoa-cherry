'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, updateProfile, logout } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          pincode: user.address?.pincode || '',
          country: user.address?.country || 'India'
        }
      });
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const result = await updateProfile(formData);

    if (result.success) {
      setMessage('Profile updated successfully!');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout();
      router.push('/');
    }
  };

  if (!isAuthenticated) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="min-h-screen bg-noir py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="card-noir rounded-[2rem] border-rose/10 shadow-2xl p-8 relative overflow-hidden glass-strong">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose/5 blur-[50px] -mr-16 -mt-16 rounded-full" />
          <div className="flex justify-between items-end mb-10 border-b border-rose/10 pb-6">
            <div>
              <h1 className="text-3xl font-bold text-cream uppercase tracking-[0.2em]" style={{ fontFamily: 'var(--font-display)' }}>My Profile</h1>
              <p className="text-rose text-[10px] font-bold uppercase tracking-widest mt-1">Member Distinction</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-rose/60 hover:text-rose font-bold text-xs uppercase tracking-widest transition-colors duration-300 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Sign Out
            </button>
          </div>

          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="mb-10">
              <h2 className="text-lg font-bold text-cream mb-6 flex items-center gap-2 uppercase tracking-widest border-l-2 border-rose pl-4">
                Basic Credentials
              </h2>
              
              <div className="mb-4">
                <label className="block text-[10px] font-bold text-cream/40 uppercase tracking-widest mb-3 ml-1">
                  Mobile Identity
                </label>
                <input
                  type="tel"
                  value={user?.mobile || ''}
                  className="w-full input-noir pl-4 border-rose/5 opacity-60 cursor-not-allowed font-bold"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Mobile number cannot be changed</p>
              </div>

              <div className="mb-4">
                <label className="block text-[10px] font-bold text-rose uppercase tracking-widest mb-3 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full input-noir py-3 px-4 font-bold"
                  placeholder="Your Name"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-[10px] font-bold text-rose uppercase tracking-widest mb-3 ml-1">
                  Electronic Mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full input-noir py-3 px-4 font-bold"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="mb-10">
              <h2 className="text-lg font-bold text-cream mb-6 flex items-center gap-2 uppercase tracking-widest border-l-2 border-rose pl-4">
                Arrival Logistics
              </h2>
              
              <div className="mb-4">
                <label className="block text-[10px] font-bold text-rose uppercase tracking-widest mb-3 ml-1">
                  Street Coordinates
                </label>
                <textarea
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full input-noir py-3 px-4 font-bold min-h-[100px]"
                  placeholder="House No, Street, Landmark"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[10px] font-bold text-rose uppercase tracking-widest mb-3 ml-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    className="w-full input-noir py-3 px-4 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-rose uppercase tracking-widest mb-3 ml-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    className="w-full input-noir py-3 px-4 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[10px] font-bold text-rose uppercase tracking_widest mb-3 ml-1">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    name="address.pincode"
                    value={formData.address.pincode}
                    onChange={handleInputChange}
                    className="w-full input-noir py-3 px-4 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-rose uppercase tracking-widest mb-3 ml-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleInputChange}
                    className="w-full input-noir py-3 px-4 font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                type="button"
                onClick={() => router.push('/orders')}
                className="flex-1 px-6 py-4 rounded-xl border border-rose/20 text-cream font-bold uppercase tracking-widest text-xs hover:bg-rose/5 transition-all duration-300"
              >
                Order History
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] btn-primary py-4 shadow-xl shadow-rose/20 uppercase tracking-[0.2em] font-bold text-xs disabled:opacity-50 flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-noir border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Confirm Changes</span>
                    <span className="material-symbols-outlined text-base group-hover:scale-110 transition-transform">verified</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Account Info */}
          <div className="mt-10 pt-8 border-t border-rose/10">
            <h2 className="text-xs font-bold text-cream/30 uppercase tracking-[0.3em] mb-4">Registry Information</h2>
            <div className="grid grid-cols-2 gap-4 text-[10px] text-cream/40 uppercase tracking-widest font-bold">
              <div>
                <p className="mb-1 text-rose/40">Inception Date</p>
                <p className="text-cream/60">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <p className="mb-1 text-rose/40">Distinction ID</p>
                <p className="text-cream/60 truncate">{user?.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}