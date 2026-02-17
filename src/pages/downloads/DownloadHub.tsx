import { useState, useMemo } from 'react';
import { StitchScreen } from '../../types/download';
import { STITCH_SCREENS, SCREEN_CATEGORIES } from '../../constants/stitchScreens';
import { ScreenGrid } from '../../components/Downloads/ScreenGrid';
import { CategoryTabs } from '../../components/Downloads/CategoryTabs';
import { DownloadProgressComponent } from '../../components/Downloads/DownloadProgress';
import { ScreenPreview } from '../../components/Downloads/ScreenPreview';
import { useDownload } from '../../hooks/useDownload';

interface DownloadHubProps {
  userRole: number;
  title?: string;
  subtitle?: string;
}

export const DownloadHub: React.FC<DownloadHubProps> = ({
  userRole,
  title = 'Design Screen Library',
  subtitle = 'Download responsive screen designs for your application',
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(
    SCREEN_CATEGORIES[0]?.id || 'customer'
  );
  const [previewScreen, setPreviewScreen] = useState<StitchScreen | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { progress, isDownloading, cancel } = useDownload();

  // Filter screens by role and category
  const filteredScreens = useMemo(() => {
    return STITCH_SCREENS.filter(
      (screen) =>
        screen.roles.includes(userRole) &&
        screen.category === activeCategory &&
        (screen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          screen.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          screen.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          ))
    );
  }, [userRole, activeCategory, searchQuery]);

  // Count accessible screens per category
  const screenCountsByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    SCREEN_CATEGORIES.forEach((category) => {
      counts[category.id] = STITCH_SCREENS.filter(
        (screen) =>
          screen.roles.includes(userRole) && screen.category === category.id
      ).length;
    });
    return counts;
  }, [userRole]);

  // Get accessible categories
  const accessibleCategories = useMemo(() => {
    return SCREEN_CATEGORIES.filter(
      (category) => screenCountsByCategory[category.id] > 0
    );
  }, [screenCountsByCategory]);

  const handlePreview = (screen: StitchScreen) => {
    setPreviewScreen(screen);
    setShowPreview(true);
  };

  const { downloadMultiple } = useDownload();

  const handleDownloadAll = async () => {
    const files = filteredScreens.flatMap((screen) => [
      { url: screen.htmlUrl, filename: `${screen.id}-code.html` },
      { url: screen.screenshotUrl, filename: `${screen.id}-screenshot.png` },
    ]);

    if (files.length === 0) {
      alert('No files to download');
      return;
    }

    await downloadMultiple(files);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-2">{subtitle}</p>

          {/* Search Bar */}
          <div className="mt-6 flex gap-3 flex-col sm:flex-row">
            <input
              type="text"
              placeholder="Search screens by name, description, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <button
              onClick={handleDownloadAll}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
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
              Download All
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Tabs */}
        {accessibleCategories.length > 0 && (
          <div className="mb-8 bg-white rounded-lg border border-gray-200">
            <CategoryTabs
              categories={accessibleCategories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              screenCounts={screenCountsByCategory}
            />
          </div>
        )}

        {/* Stats Bar */}
        <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Total Screens</p>
            <p className="text-2xl font-bold text-gray-900">
              {STITCH_SCREENS.filter((s) => s.roles.includes(userRole)).length}
            </p>
          </div>

          <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Accessible Categories</p>
            <p className="text-2xl font-bold text-gray-900">
              {accessibleCategories.length}
            </p>
          </div>

          <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Visible in Category</p>
            <p className="text-2xl font-bold text-gray-900">
              {filteredScreens.length}
            </p>
          </div>

          <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Total Files Available</p>
            <p className="text-2xl font-bold text-gray-900">
              {STITCH_SCREENS.filter((s) => s.roles.includes(userRole)).length *
                2}
            </p>
          </div>
        </div>

        {/* Screen Grid */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <ScreenGrid
            screens={filteredScreens}
            onPreview={handlePreview}
            userRole={userRole}
            emptyMessage={
              searchQuery
                ? `No screens match "${searchQuery}"`
                : 'No screens available in this category'
            }
          />
        </div>
      </div>

      {/* Preview Modal */}
      <ScreenPreview
        screen={previewScreen}
        isOpen={showPreview}
        onClose={() => {
          setShowPreview(false);
          setPreviewScreen(null);
        }}
      />

      {/* Download Progress */}
      <DownloadProgressComponent
        progress={progress}
        visible={isDownloading}
        onCancel={cancel}
      />
    </div>
  );
};

export default DownloadHub;

