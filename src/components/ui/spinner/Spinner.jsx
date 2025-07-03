const Spinner = ({ description = "", fullscreen = false }) => {
  const spinner = (
    <div className="flex dark:text-gray-500 text-sm items-baseline">
      <div
        className="animate-spin inline-block w-10 h-10 border-[3px] border-current border-t-transparent text-brand-500 rounded-full dark:text-brand-500"
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">{description || "Loading..."}</span>
      </div>
      {description && <div className="ml-6">{description}...</div>}
    </div>
  );
  const fullscreenSpinner = (
    <div className="z-999999 flex h-full w-full items-center justify-center">
      {spinner}
    </div>
  );
  return fullscreen ? fullscreenSpinner : spinner;
};
export default Spinner;
