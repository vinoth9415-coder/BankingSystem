export default function LoadingSpinner({ size = 'md', fullPage = false }) {
  const sizes = { sm: 'h-6 w-6', md: 'h-10 w-10', lg: 'h-16 w-16' };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} animate-spin rounded-full border-4 border-blue-200 border-t-blue-600`} />
      <p className="text-blue-600 dark:text-blue-400 text-sm font-medium animate-pulse">Loading...</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }
  return <div className="flex justify-center items-center py-12">{spinner}</div>;
}
