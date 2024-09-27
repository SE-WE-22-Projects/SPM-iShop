import './componentStyles/Footer.css'

const Footer = () => {
  return (
    <div className="hero_area">
      <svg
        className="waves"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shapeRendering="auto"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g className="parallax">
          <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(27, 89, 158,0.6)" />
          <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(27, 89, 158,0.4)" />
          <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(27, 89, 158,0.2)" />
          <use xlinkHref="#gentle-wave" x="48" y="7" fill="rgba(27, 89, 158)" />
        </g>
      </svg>
    </div>
  )
}

export default Footer