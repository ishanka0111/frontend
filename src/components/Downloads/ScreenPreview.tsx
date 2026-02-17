import { useEffect } from 'react';
import { StitchScreen } from '../../types/download';
import { useDownload } from '../../hooks/useDownload';

interface ScreenPreviewProps {
  screen: StitchScreen | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ScreenPreview: React.FC<ScreenPreviewProps> = ({
  screen,
  isOpen,
  onClose,
}) => {
  const { downloadFile } = useDownload();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      globalThis.addEventListener('keydown', handleEscape);
      return () => globalThis.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !screen) {
    return null;
  }

  const handleDownloadHTML = async () => {
    const filename = `${screen.id}-code.html`;
    await downloadFile(screen.htmlUrl, filename);
  };

  const handleDownloadScreenshot = async () => {
    const filename = `${screen.id}-screenshot.png`;
    await downloadFile(screen.screenshotUrl, filename);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col animate-in fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{screen.name}</h2>
            <p className="text-gray-600 mt-1">{screen.title}</p>
            <p className="text-sm text-gray-500 mt-2">{screen.description}</p>
          </div>

          <button
            onClick={onClose}
            className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Close preview"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-full mx-auto bg-white rounded-lg shadow">
            <img
              src={screen.screenshotUrl}
              alt={screen.title}
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Left - Screen Info */}
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Format</span>
                  <p className="font-semibold text-gray-900">
                    {screen.deviceType}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Dimensions</span>
                  <p className="font-semibold text-gray-900">
                    {screen.width}x{screen.height}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Category</span>
                  <p className="font-semibold text-gray-900 capitalize">
                    {screen.category}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">File Sizes</span>
                  <p className="font-semibold text-gray-900">
                    HTML: {screen.estimatedFileSize.html}KB
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-3 flex flex-wrap gap-1">
                {screen.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right - Action Buttons */}
            <div className="flex flex-col gap-2 sm:w-auto">
              <button
                onClick={handleDownloadHTML}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
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
                Download Code
              </button>

              <button
                onClick={handleDownloadScreenshot}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
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
                Download Image
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
