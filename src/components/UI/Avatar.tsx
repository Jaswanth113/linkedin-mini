import React from 'react';

interface AvatarProps {
  name?: string | null;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ name, className = '' }) => {
  const getInitials = (name?: string | null) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  // Using a consistent blue color as requested in the image.
  const avatarColor = 'bg-blue-600';

  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-bold ${avatarColor} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
