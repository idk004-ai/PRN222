import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export const SessionTimer: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        const checkSession = () => {
            const sessionExpiry = localStorage.getItem('sessionExpiry');
            if (sessionExpiry) {
                const expiryTime = parseInt(sessionExpiry);
                const now = Date.now();
                const remaining = Math.max(0, expiryTime - now);

                setTimeLeft(remaining);

                // Show warning when less than 5 minutes left
                setShowWarning(remaining > 0 && remaining <= 5 * 60 * 1000);

                // Auto logout when session expires
                if (remaining <= 0) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userRole');
                    localStorage.removeItem('sessionExpiry');
                    window.location.href = '/login';
                }
            }
        };

        checkSession();
        const interval = setInterval(checkSession, 60000); // Check every minute

        return () => clearInterval(interval);
    }, []);

    const formatTime = (milliseconds: number): string => {
        const totalMinutes = Math.floor(milliseconds / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    const extendSession = () => {
        const newExpiry = Date.now() + (24 * 60 * 60 * 1000); // Extend 24 hours
        localStorage.setItem('sessionExpiry', newExpiry.toString());
        setShowWarning(false);
    };

    if (!timeLeft || timeLeft <= 0) {
        return null;
    }

    if (!showWarning) {
        return null;
    }

    return (
        <div className="fixed top-20 right-4 z-50">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md shadow-lg max-w-sm">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3 flex-1">
                        <p className="text-sm text-yellow-700">
                            <span className="font-medium">Phiên đăng nhập sắp hết hạn!</span>
                        </p>
                        <div className="flex items-center mt-2 text-xs text-yellow-600">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>Còn lại: {formatTime(timeLeft)}</span>
                        </div>
                    </div>
                </div>
                <div className="mt-3">
                    <button
                        onClick={extendSession}
                        className="bg-yellow-400 hover:bg-yellow-500 text-yellow-800 text-xs font-medium py-1 px-2 rounded transition-colors"
                    >
                        Gia hạn phiên
                    </button>
                </div>
            </div>
        </div>
    );
};
