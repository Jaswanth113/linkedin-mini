import React from 'react';
import { TrendingUp, Users, Clock } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  timeAgo: string;
  readers: number;
  category: 'trending' | 'tech' | 'business' | 'career';
}

export function NewsSection() {
  // Mock news data
  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: 'AI revolution transforms software development industry',
      timeAgo: '2h',
      readers: 12500,
      category: 'tech'
    },
    {
      id: '2',
      title: 'Remote work policies evolve as companies adapt',
      timeAgo: '4h',
      readers: 8900,
      category: 'career'
    },
    {
      id: '3',
      title: 'Startup funding reaches new heights in Q4',
      timeAgo: '6h',
      readers: 15200,
      category: 'business'
    },
    {
      id: '4',
      title: 'LinkedIn launches new networking features',
      timeAgo: '8h',
      readers: 22100,
      category: 'trending'
    },
    {
      id: '5',
      title: 'Tech layoffs continue across major companies',
      timeAgo: '12h',
      readers: 18700,
      category: 'tech'
    },
    {
      id: '6',
      title: 'Skills-based hiring gains momentum in 2024',
      timeAgo: '1d',
      readers: 9800,
      category: 'career'
    },
    {
      id: '7',
      title: 'Green technology investments surge globally',
      timeAgo: '1d',
      readers: 11400,
      category: 'business'
    },
    {
      id: '8',
      title: 'Cybersecurity threats increase in remote work era',
      timeAgo: '2d',
      readers: 7600,
      category: 'tech'
    }
  ];

  const formatReaders = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'trending':
        return 'text-[#e16745]';
      case 'tech':
        return 'text-[#378fe9]';
      case 'business':
        return 'text-[#5f9b41]';
      case 'career':
        return 'text-[#c37d16]';
      default:
        return 'text-[#666666]';
    }
  };

  return (
    <div className="linkedin-card">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-[#0a66c2]" />
          <h3 className="text-lg font-semibold text-[#000000]">LinkedIn News</h3>
        </div>
        
        <div className="space-y-3">
          {newsItems.slice(0, 5).map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <h4 className="font-medium text-[#000000] text-sm leading-tight mb-1 group-hover:text-[#0a66c2] group-hover:underline">
                {item.title}
              </h4>
              
              <div className="flex items-center space-x-3 text-xs text-[#666666]">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{item.timeAgo}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{formatReaders(item.readers)} readers</span>
                </div>
                
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(item.category)} bg-gray-100`}>
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t border-[#d9d9d9]">
          <button className="text-sm text-[#666666] hover:text-[#0a66c2] font-medium">
            Show more news
          </button>
        </div>
      </div>
    </div>
  );
}
