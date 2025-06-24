export default function SidebarWidget() {
  return (
    <div
      className={`
      mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03]`}
    >
      <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
        SelfScheduling Dashboard
      </h3>
      <p className="mb-4 text-gray-500 text-theme-sm dark:text-gray-400">
        Monitor services and configuration
      </p>
      <a
        href="http://localhost:5006"
        target="_blank"
        rel="nofollow noreferrer"
        className="flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
      >
        Web Status
      </a>
      <a
        href="http://localhost:5340"
        target="_blank"
        rel="nofollow noreferrer"
        className="mt-5 flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
      >
        Logs
      </a>
    </div>
  );
}
