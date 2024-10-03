import React from 'react';
import './componentStyles/WalinkgMan.css';

const WalkingMan = () => {
    return (
        <div className="walking">
            <div className="head"></div>
            <div className="body"></div>
            {/* <div className="leftArm"></div>
            <div className="rightArm"></div> */}
            <div className="cane"></div> {/* Adding the cane */}
            <div className="firstLeg"></div>
            <div className="secondLeg"></div>
            <div className="shadow"></div>
        </div>
    );
};

export default WalkingMan;
