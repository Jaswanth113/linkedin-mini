import React from 'react';
import { CreatePost } from '../components/Feed/CreatePost';
import { PostFeed } from '../components/Feed/PostFeed';

export function Home() {
  return (
    <div className="space-y-4">
      <CreatePost />
      <PostFeed />
    </div>
  );
}