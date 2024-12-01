import React from 'react';
import { NewsArticleList } from './NewsArticleList';
import { DomainSuggestions } from './DomainSuggestions';
import { DomainSuggestion } from '../types';

interface MainContentProps {
  suggestions: DomainSuggestion[];
}

export function MainContent({ suggestions }: MainContentProps) {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Latest News</h2>
          <NewsArticleList />
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4">Domain Suggestions</h2>
          <DomainSuggestions suggestions={suggestions} />
        </section>
      </div>
    </main>
  );
}