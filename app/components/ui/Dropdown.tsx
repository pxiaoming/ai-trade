'use client';

import React, { createContext, useContext, useState, useRef } from 'react';

interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

export function Dropdown({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div ref={dropdownRef}>{children}</div>
    </DropdownContext.Provider>
  );
}

interface DropdownTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export function DropdownTrigger({ children, className = '' }: DropdownTriggerProps) {
  const { isOpen, setIsOpen } = useContext(DropdownContext)!;

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className={className}
    >
      {children}
    </button>
  );
}

interface DropdownContentProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
}

export function DropdownContent({ children, className = '', align = 'end' }: DropdownContentProps) {
  const { isOpen } = useContext(DropdownContext)!;

  if (!isOpen) return null;

  const alignments = {
    start: 'left-0',
    center: 'left-1/2 transform -translate-x-1/2',
    end: 'right-0',
  };

  return (
    <div className={`
      absolute z-50 mt-2 w-48 rounded-md bg-white dark:bg-gray-800
      shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700
      transition-all duration-200 ease-out
      ${alignments[align]}
      ${className}
    `}>
      <div className="py-1">
        {children}
      </div>
    </div>
  );
}

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function DropdownItem({ children, onClick, className = '' }: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300
        hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100
        transition-colors duration-150
        ${className}
      `}
    >
      {children}
    </button>
  );
}