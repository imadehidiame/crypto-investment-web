
export const CIFullLogo = ()=>{
    return (
        <svg
          width="230" // Wider for "CoinInvest"
          height="100"
          viewBox="0 0 230 100" // Wider viewBox
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-48 h-24 md:w-64 md:h-32" // Larger height and width
        >
          <text
            x="115" // Center of 200-width viewBox
            y="60" // Slightly lower for balance
            fontFamily="'Source Serif 4', Georgia, serif"
            fontSize="35" // Larger for boldness like CILogo
            fontWeight="bold"
            fill="#FFD700"
            textAnchor="middle"
          >
            CoinInvest
          </text>
        </svg>
      );
}

export const CIFullLogoDashboard = () => {
  return (
    <div className="w-36 h-18 md:w-44 md:h-22 flex-shrink-0 flex-grow-0 mt-[16px]">
      <svg
        viewBox="0 0 160 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full min-h-full"
        preserveAspectRatio="xMidYMid meet"
        style={{ position: 'relative' }}
      >
        <text
          x="80"
          y="45"
          fontFamily="'Source Serif 4', Georgia, serif"
          fontSize="26"
          fontWeight="bold"
          fill="#FFD700"
          textAnchor="middle"
        >
          CoinInvest
        </text>
      </svg>
    </div>
  );
};

export const CIShortLogo = () =>{
    return (
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-16 h-16 md:w-24 md:h-24"
        >
          <text
            x="50"
            y="40"
            fontFamily="'Source Serif 4', Georgia, serif"
            fontSize="48"
            fontWeight="bold"
            fill="#FFD700"
            textAnchor="middle"
          >
            CI
          </text>
        </svg>
      );
}