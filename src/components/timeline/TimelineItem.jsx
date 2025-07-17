const TimelineItem = ({ data }) => {
  let {
    date,
    text,
    link,
    category: { tag, color, bgColor },
  } = data;

  return (
    <div className="group relative my-[10px] flex w-1/2 justify-end pr-[22px] odd:justify-start odd:self-end odd:pr-0 odd:pl-[22px] sm:pr-[30px] sm:odd:pl-[30px]">
      <div className="relative flex w-[400px] max-w-[95%] flex-col items-center rounded-[5px] bg-white px-4 py-[10px] text-center shadow-[0_0_2px_rgba(0,0,0,0.3)] group-odd:items-center group-odd:text-center after:absolute after:top-[calc(50%-7.5px)] after:right-[-7.5px] after:h-4 after:w-4 after:rotate-45 after:content-normal after:bg-white after:shadow-[1px_-1px_1px_rgba(0,0,0,0.2)] group-odd:after:right-auto group-odd:after:left-[-7.5px] group-odd:after:shadow-[-1px_1px_1px_rgba(0,0,0,0.2)] sm:max-w-[70%] md:items-end md:p-4 md:text-right md:group-odd:items-start md:group-odd:text-left">
        <span
          className="absolute top-[5px] left-[5px] w-[calc(100%-10px)] p-[5px] text-center text-xs font-bold tracking-[1px] uppercase group-odd:right-1 group-odd:left-auto md:w-auto"
          // tailwind does not allow to construct classes dynamically so for colors we have to use inline style...... https://tailwindcss.com/docs/content-configuration#dynamic-class-names
          style={{ backgroundColor: bgColor, color: color ? color : "#4d4d4d" }}
        >
          {tag}
        </span>
        <time className="mt-6 text-xs text-[#777] md:m-0">{date}</time>
        <p className="my-4 max-w-64 text-sm sm:text-base">{text}</p>
        {link && (
          <a
            href={link.url}
            className="text-sm text-[rgb(160,160,160)] underline after:ml-0.5 after:hidden after:text-xs after:content-['►'] md:no-underline md:after:inline-block"
            target="_blank"
            rel=""
          >
            {link.text}
          </a>
        )}
        <span className="absolute top-[calc(50%-10px)] -right-8 z-50 h-5 w-5 rounded-[50%] border-[3px] border-slate-400 bg-white group-odd:right-auto group-odd:-left-8 sm:-right-10 sm:group-odd:-left-10" />
      </div>
    </div>
  );
};

export default TimelineItem;
