import { useEffect, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';

const useSocketUpdate = (callback, resources = []) => {
  const socket = useSocket();
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!socket) return;

    const handler = (payload) => {
      if (!resources || resources.length === 0 || resources.includes(payload.resource)) {
        callbackRef.current(payload);
      }
    };

    socket.on('data_updated', handler);
    return () => {
      socket.off('data_updated', handler);
    };
  }, [socket, resources?.join(',')]);
};

export default useSocketUpdate;
