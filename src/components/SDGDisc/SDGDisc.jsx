import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./SDGDisc.scss";

import { SDGs } from "../../assets/goalsData";

const SDGDisc = () => {
    const [rotation, setRotation] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (!isPaused) {
            const interval = setInterval(() => {
                setRotation(prevRotation => prevRotation + 1);
            }, 100);
            return () => clearInterval(interval);
        }

    }, [isPaused]);

    return (
        <div className="sdg-disc">
            <div className="sdg-disc__container" style={{ transform: `rotate(${rotation}deg)` }} onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
                {SDGs.map((goal, index) => {
                    const angle = index * (360 / SDGs.length);
                    return (
                        <Link to={`/goal/${goal.id}`}
                            key={goal.id}
                            className="sdg-disc__segment"
                            style={{
                                transform: `rotate(${angle}deg) translate(300px) rotate(-${angle + rotation}deg)`,
                            }}
                        >
                            <img
                                src={goal.image}
                                alt={goal.name}
                                className="sdg-disc__image"
                            />
                        </Link>
                    );
                })}
                <div className="sdg-disc__inner" style={{
                    transform: `rotate(-${rotation}deg)`,
                }}>
                    <img
                        src="/images/other/sustainableDevelopmentGoalsTextSmall.png"
                        alt="SDG Text" />
                </div>
            </div>
        </div>
    );
};

export default SDGDisc;
