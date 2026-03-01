'use client';

import React, { useState, useEffect } from 'react';
import { getAllTags } from '@/lib/utils/favorites';

interface TagFilterProps {
  selectedTag: string;
  onTagSelect: (tag: string) => void;
}

export function TagFilter({ selectedTag, onTagSelect }: TagFilterProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    setIsLoading(true);
    try {
      const allTags = getAllTags();
      setTags(allTags);
    } catch (error) {
      console.error('Error loading tags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-sm text-gray-500">加载标签中...</div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onTagSelect('')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          selectedTag === ''
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
      >
        全部
      </button>

      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagSelect(tag)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            selectedTag === tag
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}