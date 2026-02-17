import { DownloadHub } from './DownloadHub';

export const CustomerDownloads: React.FC = () => {
  return (
    <DownloadHub
      userRole={1}
      title="📱 Customer App Designs"
      subtitle="Explore mobile-first designs for your dining experience"
    />
  );
};

export default CustomerDownloads;
