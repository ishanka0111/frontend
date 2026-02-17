import { DownloadProgress } from '../../types/download';

interface DownloadProgressProps {
  progress: DownloadProgress;
  visible: boolean;
  onCancel?: () => void;
}

export const DownloadProgressComponent: React.FC<DownloadProgressProps> = ({
  progress,
  visible,
  onCancel,
}) => {
  if (!visible || !progress.isDownloading) {
    return null;
  }

  const percentage =
    progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;
  const failureRate =
    progress.total > 0 ? (progress.failed / progress.total) * 100 : 0;

  return (
    <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm z-50 animate-in slide-in-from-bottom">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
          <h3 className="font-semibold text-gray-900">Downloading...</h3>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-lg"
            aria-label="Cancel download"
          >
            ×
          </button>
        )}
      </div>

      {/* Progress Stats */}
      <div className="space-y-2 mb-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Progress</span>
          <span className="font-medium text-gray-900">
            {progress.completed} / {progress.total} files
          </span>
        </div>

        {progress.failed > 0 && (
          <div className="flex justify-between text-red-600">
            <span>Failed</span>
            <span className="font-medium">{progress.failed} files</span>
          </div>
        )}
      </div>

      {/* Progress Bars */}
      <div className="space-y-2 mb-3">
        {/* Completed Progress */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Failed Progress */}
        {failureRate > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${failureRate}%` }}
            />
          </div>
        )}
      </div>

      {/* Percentage Display */}
      <div className="text-center text-xs text-gray-600">
        {Math.round(percentage)}% Complete
      </div>

      {/* Action Buttons */}
      {onCancel && (
        <button
          onClick={onCancel}
          className="w-full mt-3 py-1.5 px-3 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition-colors border border-red-200"
        >
          Cancel
        </button>
      )}
    </div>
  );
};

export default DownloadProgressComponent;
