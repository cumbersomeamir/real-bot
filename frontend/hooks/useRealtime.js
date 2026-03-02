'use client';

import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { WS_URL } from '@/lib/constants';

export function useRealtime({ orgId, userId, onEvent }) {
  useEffect(() => {
    const socket = io(WS_URL, { transports: ['websocket'] });
    if (orgId) socket.emit('join:org', orgId);
    if (userId) socket.emit('join:user', userId);

    const events = ['lead:new', 'lead:assigned', 'lead:updated', 'agent:activity', 'kpi:update'];
    events.forEach((eventName) => {
      socket.on(eventName, (payload) => onEvent?.(eventName, payload));
    });

    return () => {
      events.forEach((eventName) => socket.off(eventName));
      socket.disconnect();
    };
  }, [orgId, userId, onEvent]);
}
