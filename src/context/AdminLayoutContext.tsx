// src/context/AdminLayoutContext.tsx
'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Define the shape of the context data
interface AdminLayoutContextType {
    isMobileMenuOpen: boolean;
    toggleMobileMenu: () => void;
    closeMobileMenu: () => void;
}

// Create the context with a default undefined value
const AdminLayoutContext = createContext<AdminLayoutContextType | undefined>(undefined);

// Create a custom hook for easy access to the context
export function useAdminLayout() {
    const context = useContext(AdminLayoutContext);
    if (context === undefined) {
        throw new Error('useAdminLayout must be used within an AdminLayoutProvider');
    }
    return context;
}

// Create the provider component that will wrap our layout
export function AdminLayoutProvider({ children }: { children: ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Use useCallback to memoize functions so they don't cause unnecessary re-renders
    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(prev => !prev);
    }, []);

    const closeMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(false);
    }, []);

    const value = {
        isMobileMenuOpen,
        toggleMobileMenu,
        closeMobileMenu,
    };

    return (
        <AdminLayoutContext.Provider value={value}>
            {children}
        </AdminLayoutContext.Provider>
    );
}