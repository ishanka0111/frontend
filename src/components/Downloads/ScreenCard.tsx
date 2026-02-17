import { useState } from 'react';
import { StitchScreen } from '../../types/download';
import { useDownload } from '../../hooks/useDownload';

const getDeviceIcon = (deviceType: string): string => {
  switch (deviceType) {
    case 'MOBILE':
      return '📱';
    case 'TABLET':
      return '📲';
    case 'DESKTOP':
      return '🖥️';
    default:
      return '📱';
  }
};

interface ScreenCardProps {
  screen: StitchScreen;
  onPreview: (screen: StitchScreen) => void;
  userRole: number;
}

export const ScreenCard: React.FC<ScreenCardProps> = ({
  screen,
  onPreview,
  userRole,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { downloadFile, error } = useDownload();

  const canAccess = screen.roles.includes(userRole);

  if (!canAccess) {
    return (
      <div className="relative overflow-hidden rounded-lg bg-gray-100 border border-gray-300 p-4 opacity-50 cursor-not-allowed">
        <div className="aspect-video bg-gray-200 rounded mb-3 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Restricted Access</span>
        </div>
        <h3 className="font-semibold text-gray-600 mb-1">{screen.name}</h3>
        <p className="text-xs text-gray-500">Not available for your role</p>
      </div>
    );
  }

  const handleDownloadHTML = async () => {
    setIsDownloading(true);
    try {
      const filename = `${screen.id}-code.html`;
      await downloadFile(screen.htmlUrl, filename);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadScreenshot = async () => {
    setIsDownloading(true);
    try {
      const filename = `${screen.id}-screenshot.png`;
      await downloadFile(screen.screenshotUrl, filename);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Card Image */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        <img
          src={screen.screenshotUrl}
          alt={screen.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
          <button
            onClick={() => onPreview(screen)}
            className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
            title="Preview fullscreen"
            aria-label="Preview screen"
          >
            <svg
              className="w-5 h-5 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>

          <button
            onClick={handleDownloadHTML}
            disabled={isDownloading}
            className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            title="Download HTML code"
            aria-label="Download HTML"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </button>

          <button
            onClick={handleDownloadScreenshot}
            disabled={isDownloading}
            className="p-2 bg-green-500 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            title="Download screenshot"
            aria-label="Download screenshot"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>

        {/* Device Type Badge */}
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
          {getDeviceIcon(screen.deviceType)} {screen.deviceType}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3">
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">
          {screen.name}
        </h3>
        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
          {screen.description}
        </p>

        {/* Tags */}
        <div className="mt-2 flex flex-wrap gap-1">
          {screen.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-block px-2 py-0.5 bg-gray-100 text-xs text-gray-700 rounded"
            >
              {tag}
            </span>
          ))}
          {screen.tags.length > 2 && (
            <span className="inline-block px-2 py-0.5 bg-gray-100 text-xs text-gray-700 rounded">
              +{screen.tags.length - 2}
            </span>
          )}
        </div>

        {/* File Size Info */}
        <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
          <p>
            HTML: {screen.estimatedFileSize.html}KB | Screenshot:{' '}
            {screen.estimatedFileSize.screenshot}KB
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            {error}
          </div>
        )}

        {/* Download Status */}
        {isDownloading && (
          <div className="mt-2 text-center text-xs text-blue-600">
            ⏳ Downloading...
          </div>
        )}
      </div>
    </div>
  );
};
