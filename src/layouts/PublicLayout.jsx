import React from 'react';
import PublicNavbar from '../components/common/PublicNavbar';
import PublicFooter from '../components/common/PublicFooter';

const PublicLayout = ({ children, isDarkHero = false }) => {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <PublicNavbar isDarkTheme={isDarkHero} />
            <main className="flex-1">
                {children}
            </main>
            <PublicFooter />
        </div>
    );
};

export default PublicLayout;
