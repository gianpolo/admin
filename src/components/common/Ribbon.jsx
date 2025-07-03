export default function Ribbon({ children }) {
  return (
    <span className="absolute -right-[23px] inline-block rounded-l-full bg-success-500 px-4 py-1.5 text-sm font-medium text-white">
      {children}
    </span>
  );
}
