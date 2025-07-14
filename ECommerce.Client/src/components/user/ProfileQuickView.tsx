import React from 'react';
import { User, Edit3, Clock } from 'lucide-react';

interface ProfileData {
  customerId: number;
  fullName: string;
  email: string;
  joinDate: string;
  totalOrders: number;
  avatar?: string;
}

interface ProfileQuickViewProps {
  profile: ProfileData | null;
  loading?: boolean;
}

export const ProfileQuickView: React.FC<ProfileQuickViewProps> = ({ profile, loading }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4 mb-6">
            <div className="rounded-full bg-gray-200 h-16 w-16"></div>
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Thông tin tài khoản</h2>
        <button className="flex items-center text-indigo-600 hover:text-indigo-700 text-sm font-medium">
          <Edit3 className="w-4 h-4 mr-1" />
          Chỉnh sửa
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.fullName}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-indigo-600" />
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900">{profile.fullName}</h3>
          <p className="text-gray-600">{profile.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-gray-900">{profile.totalOrders}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Tham gia từ:</span> {formatDate(profile.joinDate)}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
          Xem hồ sơ đầy đủ
        </button>
      </div>
    </div>
  );
};
