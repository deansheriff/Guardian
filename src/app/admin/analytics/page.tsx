import AnalyticsDashboard from '@/components/admin/analytics-dashboard';

export default function AnalyticsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
        Analytics Dashboard
      </h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        An overview of your security operations.
      </p>
      <div className="mt-8">
        <AnalyticsDashboard />
      </div>
    </div>
  );
}