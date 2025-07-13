import { Bell, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
    title?: string;
    className?: string;
}

export const Header = ({ title = 'Dashboard', className = '' }: HeaderProps) => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <header className={`bg-white shadow-sm border-b border-gray-200 ${className}`}>
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Title */}
                    <div className="flex items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center space-x-4">
                        {/* Search */}
                        <div className="relative hidden md:block">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                        </div>

                        {/* Notifications */}
                        <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                3
                            </span>
                        </button>

                        {/* User menu */}
                        <div className="relative flex items-center space-x-2">
                            <div className="flex items-center space-x-2 p-2 text-gray-600">
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4" />
                                </div>
                                <span className="hidden md:block text-sm font-medium">
                                    {user?.firstName} {user?.lastName}
                                </span>
                            </div>
                            
                            {/* Logout button */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-1 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                                title="Đăng xuất"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden md:block text-sm font-medium">Đăng xuất</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
