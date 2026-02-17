import { DownloadHub } from './DownloadHub';

export const AdminDownloads: React.FC = () => {
  return (
    <DownloadHub
      userRole={2}
      title="⚙️ Admin Control Center"
      subtitle="Comprehensive management dashboards and system controls"
    />
  );
};

export default AdminDownloads;

