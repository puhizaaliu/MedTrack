// src/hooks/useNotifications.js
import { useContext } from 'react';
import { NotificationsContext } from '../contexts/NotificationsContext';

export const useNotifications = () => useContext(NotificationsContext);  
