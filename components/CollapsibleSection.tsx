import React, { ReactNode } from 'react';

interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, isOpen, onToggle, children }) => {
  return (
    <section className="bg-white shadow-lg rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
        aria-expanded={isOpen}
        aria-controls={`section-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <h2 className="text-xl font-semibold text-slate-700">{title}</h2>
        <svg
          className={`w-6 h-6 text-slate-600 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {isOpen && (
        <div id={`section-content-${title.replace(/\s+/g, '-').toLowerCase()}`} className="p-4 border-t border-slate-200">
          {children}
        </div>
      )}
    </section>
  );
};

export default CollapsibleSection;