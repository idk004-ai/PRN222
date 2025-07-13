import React from 'react';
import type { Banner as BannerType } from '../../types/user';

interface BannerProps {
    banner: BannerType;
}

export const Banner: React.FC<BannerProps> = ({ banner }) => {
    return (
        <section className="relative">
            <div className="relative h-96 bg-gradient-to-r from-indigo-500 to-purple-600 overflow-hidden">
                {banner.imageUrl && (
                    <img
                        src={banner.imageUrl}
                        alt={banner.altText}
                        className="w-full h-full object-cover opacity-40"
                    />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                        {banner.offerTag && (
                            <span className="inline-block bg-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                                {banner.offerTag}
                            </span>
                        )}
                        {banner.title && (
                            <h2 className="text-4xl md:text-6xl font-bold mb-4">
                                {banner.title}
                            </h2>
                        )}
                        {banner.description && (
                            <p className="text-lg md:text-xl mb-8 max-w-2xl">
                                {banner.description}
                            </p>
                        )}
                        {banner.btnText && (
                            <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                                {banner.btnText}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
