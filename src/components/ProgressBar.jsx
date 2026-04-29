const ProgressBar = ({ progress, label }) => {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-xs font-bold text-muted uppercase tracking-wider">
        <span>{label}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
};

export default ProgressBar;
