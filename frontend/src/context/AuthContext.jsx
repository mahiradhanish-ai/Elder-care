import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('eldercare_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('eldercare_token') || null);
  const [profile, setProfile] = useState(null);
  const [managedProfiles, setManagedProfiles] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch full user profile details on load
  const loadUserDetails = async () => {
    const storedToken = localStorage.getItem('eldercare_token');
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        setProfile(res.data.profile);
        setManagedProfiles(res.data.managedProfiles || []);

        // Default activeProfile to elderly user's own profile or first managed profile
        if (res.data.user.role === 'elderly') {
          setActiveProfile(res.data.profile);
        } else if (res.data.managedProfiles && res.data.managedProfiles.length > 0) {
          setActiveProfile(res.data.managedProfiles[0]);
        }
      }
    } catch (err) {
      console.warn('Session verification note:', err.message);
      if (err.response && err.response.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserDetails();
  }, [token]);

  const login = async (email, password) => {
    try {
      const cleanEmail = email ? email.trim().toLowerCase() : '';
      if (!cleanEmail || !password) {
        return { success: false, message: 'Please enter both email and password.' };
      }

      const res = await api.post('/auth/login', {
        email: cleanEmail,
        password,
      });

      if (res.data.success) {
        const { token: newToken, user: newUser, profile: newProfile, managedProfiles: managed } = res.data;
        localStorage.setItem('eldercare_token', newToken);
        localStorage.setItem('eldercare_user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        setProfile(newProfile);
        setManagedProfiles(managed || []);

        if (newUser.role === 'elderly') {
          setActiveProfile(newProfile);
        } else if (managed && managed.length > 0) {
          setActiveProfile(managed[0]);
        }
        return { success: true, role: newUser.role };
      }
      return { success: false, message: res.data.message || 'Login failed.' };
    } catch (err) {
      let message = 'Login failed. Please check your credentials.';
      if (err.friendlyMessage) {
        message = err.friendlyMessage;
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.code === 'ERR_NETWORK') {
        message = 'Could not reach server. Please ensure backend is running on port 5000.';
      }
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const cleanEmail = userData.email ? userData.email.trim().toLowerCase() : '';
      const cleanName = userData.name ? userData.name.trim() : '';

      if (!cleanName) {
        return { success: false, message: 'Please provide your full name.' };
      }
      if (!cleanEmail) {
        return { success: false, message: 'Please provide a valid email address.' };
      }
      if (!userData.password || userData.password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters long.' };
      }

      const payload = {
        name: cleanName,
        email: cleanEmail,
        password: userData.password,
        role: userData.role || 'elderly',
        phone: userData.phone ? userData.phone.trim() : '',
        languagePreference: userData.languagePreference || 'en',
      };

      const res = await api.post('/auth/register', payload);

      if (res.data.success) {
        const { token: newToken, user: newUser, profile: newProfile } = res.data;
        localStorage.setItem('eldercare_token', newToken);
        localStorage.setItem('eldercare_user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        setProfile(newProfile);
        setActiveProfile(newProfile);
        return { success: true, role: newUser.role, message: 'Registration successful!' };
      }
      return { success: false, message: res.data.message || 'Registration failed.' };
    } catch (err) {
      let message = 'Registration failed. Please check the provided information.';
      if (err.friendlyMessage) {
        message = err.friendlyMessage;
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.code === 'ERR_NETWORK') {
        message = 'Could not reach server. Please ensure backend is running on port 5000.';
      }
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('eldercare_token');
    localStorage.removeItem('eldercare_user');
    setToken(null);
    setUser(null);
    setProfile(null);
    setActiveProfile(null);
    setManagedProfiles([]);
  };

  const switchActiveProfile = (profileId) => {
    const selected = managedProfiles.find((p) => p._id === profileId);
    if (selected) {
      setActiveProfile(selected);
    }
  };

  const refreshProfile = async () => {
    await loadUserDetails();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        profile,
        managedProfiles,
        activeProfile,
        loading,
        login,
        register,
        logout,
        switchActiveProfile,
        refreshProfile,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
