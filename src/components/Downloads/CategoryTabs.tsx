import { ScreenCategory } from '../../types/download';

interface CategoryTabsProps {
  categories: ScreenCategory[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  screenCounts?: Record<string, number>;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  screenCounts,
}) => {
  return (
    <div className="border-b border-gray-200 overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          const count = screenCounts?.[category.id] || category.screenCount;

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
                isActive
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="inline-block mr-2">{category.icon}</span>
              {category.name}
              <span
                className={`ml-2 inline-block px-2 py-1 text-xs rounded-full ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
