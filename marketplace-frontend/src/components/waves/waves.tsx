import './waves.css';

export const Waves = () => {
  return (
    <div className="wave-container">
      <svg
        className="waves-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g className="parallax-layers">
          <use href="#gentle-wave" x="48" y="0" fill="rgba(0, 119, 182, 0.3)" />
          <use href="#gentle-wave" x="48" y="3" fill="rgba(0, 180, 216, 0.5)" />
          <use href="#gentle-wave" x="48" y="5" fill="rgba(144, 224, 239, 0.8)" />
          <use href="#gentle-wave" x="48" y="7" fill="#0077b6" />
        </g>
      </svg>
      <div className="sea-base" />
    </div>
  );
};

export default Waves;