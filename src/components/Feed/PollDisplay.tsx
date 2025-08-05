import { useAuth } from '../../hooks/useAuth';
import { usePosts, Post, PollOption } from '../../hooks/usePosts';

interface PollDisplayProps {
  post: Post;
}

export function PollDisplay({ post }: PollDisplayProps) {
  const { currentUser } = useAuth();
  const { voteOnPoll } = usePosts();

  if (!post.poll) return null;

  const totalVotes = post.poll.options.reduce((sum, option) => sum + option.votes.length, 0);
  const userVote = post.poll.options.find(option => option.votes.includes(currentUser?.id || ''));

  const handleVote = (optionId: string) => {
    if (!currentUser) {
      // Or show a message to log in
      return;
    }
    voteOnPoll(post.id, optionId);
  };

  return (
    <div className="my-3 px-3">
      <h4 className="font-semibold text-gray-800 mb-3">{post.poll.question}</h4>
      <div className="space-y-2">
        {post.poll.options.map((option: PollOption) => {
          const percentage = totalVotes > 0 ? (option.votes.length / totalVotes) * 100 : 0;
          const isUserChoice = userVote?.id === option.id;

          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              className={`w-full text-left p-2 border rounded-md transition-all duration-200 ease-in-out ${isUserChoice ? 'border-blue-500 bg-blue-50 font-semibold' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
              disabled={!currentUser}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{option.text}</span>
                {userVote && <span className="text-sm font-bold text-gray-800">{percentage.toFixed(0)}%</span>}
              </div>
              {userVote && (
                <div className="mt-1 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              )}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 mt-2">{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</p>
    </div>
  );
}
