import { Link, useLocation } from 'react-router-dom';
import {
    Home,
    ShoppingBag,
    Users,
    Package,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
    className?: string;
}

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export const Sidebar = ({ className = '' }: SidebarProps) => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (href: string) => {
        return location.pathname === href ||
            (href !== '/admin' && location.pathname.startsWith(href));
    };

    return (
        <>
            {/* Mobile menu button */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow-md"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? (
                    <X className="w-6 h-6 text-gray-600" />
                ) : (
                    <Menu className="w-6 h-6 text-gray-600" />
                )}
            </button>

            {/* Sidebar */}
            <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        ${className}
      `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center px-6 py-4 border-b border-gray-200">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-white" />
                        </div>
                        <span className="ml-3 text-xl font-semibold text-gray-900">
                            ECommerce Admin
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-2">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive(item.href)
                                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }
                  `}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Icon className="w-5 h-5 mr-3" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User section */}
                    <div className="px-4 py-4 border-t border-gray-200">
                        <div className="flex items-center px-3 py-2">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">A</span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">Admin User</p>
                                <p className="text-xs text-gray-500">admin@example.com</p>
                            </div>
                        </div>

                        <button className="w-full flex items-center px-3 py-2 mt-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors">
                            <LogOut className="w-5 h-5 mr-3" />
                            Sign out
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
};
