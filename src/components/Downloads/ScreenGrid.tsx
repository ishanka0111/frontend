import { StitchScreen } from '../../types/download';
import { ScreenCard } from './ScreenCard';

interface ScreenGridProps {
  screens: StitchScreen[];
  onPreview: (screen: StitchScreen) => void;
  userRole: number;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
}

export const ScreenGrid: React.FC<ScreenGridProps> = ({
  screens,
  onPreview,
  userRole,
  loading = false,
  empty = false,
  emptyMessage = 'No screens available for your role',
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
          <div
            key={`skeleton-${num}`}
            className="animate-pulse rounded-lg bg-gray-200 aspect-video"
          />
        ))}
      </div>
    );
  }

  if (empty || screens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <svg
          className="w-16 h-16 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No Screens Available
        </h3>
        <p className="text-gray-600 text-center">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {screens.map((screen) => (
        <ScreenCard
          key={screen.id}
          screen={screen}
          onPreview={onPreview}
          userRole={userRole}
        />
      ))}
    </div>
  );
};
