const PageHeader = ({ icon: Icon, title, count, description }) => {
  return (
    <div>
      <h2 className="text-2xl font-medium text-slate-900 tracking-tight flex items-center gap-2">
        {Icon && <Icon className="size-6 text-cyan-600" />}
        {title}

        {count > 0 && (
          <span className="text-sm font-medium text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </h2>

      <p className="text-xs text-slate-500 mt-0.5">{description}</p>
    </div>
  );
};

export default PageHeader;
