import PropTypes from 'prop-types';

const ProgressBar = ({ current, total, label }) => {
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-xs font-bold text-muted uppercase tracking-wider">
        <span>{label}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  label: PropTypes.string,
};

ProgressBar.defaultProps = {
  label: '',
};

export default ProgressBar;
