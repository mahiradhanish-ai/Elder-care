import React, { useState, useEffect } from 'react';
import { Bell, Check, Clock, AlertTriangle, Calendar, Info, X } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import api from '../services/api';

const NotificationDropdown = ({ onClose }) => {
  const { t } = useAccessibility();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'appointment':
        return <Calendar className="w-4 h-4 text-brand-500" />;
      case 'reminder':
        return <Clock className="w-4 h-4 text-amber-500" />;
      default:
        return <Info className="w-4 h-4 text-teal-500" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-surface-200 z-50 overflow-hidden">
      <div className="p-4 border-b border-surface-100 flex items-center justify-between bg-surface-50">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-slate-600" />
          <h3 className="text-sm font-bold text-slate-800">{t('notifications')}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={markAllAsRead}
            className="text-xs text-brand-600 hover:text-brand-800 font-medium"
          >
            {t('markAllRead')}
          </button>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-surface-100">
        {loading ? (
          <div className="p-6 text-center text-xs text-slate-400">{t('loading')}</div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">{t('noNotifications')}</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.isRead && markAsRead(n._id)}
              className={`p-3.5 flex items-start space-x-3 transition cursor-pointer hover:bg-surface-50 ${
                !n.isRead ? 'bg-brand-50/40' : ''
              }`}
            >
              <div className="p-2 rounded-xl bg-white border border-surface-200 shadow-sm mt-0.5">
                {getIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`text-xs font-semibold ${!n.isRead ? 'text-slate-900 font-bold' : 'text-slate-700'}`}>
                    {n.title}
                  </p>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 ml-2"></span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
