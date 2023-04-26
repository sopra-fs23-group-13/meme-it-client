import React from 'react';
export const AnimatedBackground =  () => {
        return (<div className={"animationBackground"}>
                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="100%" height="100%" viewBox="0 0 2600 1440" fill="none" preserveAspectRatio="none">
                <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{stopColor: "#F7B44F"}} />
                            <stop offset="100%" style={{stopColor: "#F47A77"}} />
                        </linearGradient>
                        <linearGradient id="background-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
                            <stop offset="0%" style={{stopColor: "#F7B44F"}} />
                            <stop offset="100%" style={{stopColor: "#F47A77"}} />
                        </linearGradient>
                        <linearGradient id="mask-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
                            <stop offset="0%" style={{stopColor: "#F7B44F"}} />
                            <stop offset="100%" style={{stopColor: "#F47A77"}} />
                        </linearGradient>
                    </defs>
                    <rect width="150%" height="100%" fill="url(#background-gradient)" />
                    <ellipse cx="2082" cy="335" rx="650" ry="650" fill="url(#gradient)">
                        <animateTransform attributeName="transform" type="translate" values="0 0; 300 300; 0 0" begin="0s" dur="60s" repeatCount="indefinite" />
                    </ellipse>
                    <circle cx="475" cy="1028" r="475" fill="url(#gradient)">
                        <animateTransform attributeName="transform" type="translate" values="0 0; -326 150; 0 0" begin="0s" dur="47s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="728" cy="536" r="140" fill="url(#gradient)">
                        <animateTransform attributeName="transform" type="translate" values="0 0; 150 -300; 0 0" begin="0s" dur="45s" repeatCount="indefinite" />
                    </circle>
                    <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="553" width="950" height="950">
                        <circle cx="475" cy="1028" r="475" fill="url(#mask-gradient)" />
                    </mask>
                    <g mask="url(#mask0)">
                        <circle cx="728" cy="536" r="140" fill="url(#gradient)">
                            <animateTransform attributeName="transform" type="translate" values="0 0; 150 -300; 0 0" begin="0s" dur="45s" repeatCount="indefinite" />
                        </circle>
                    </g>
                    <circle cx="1527" cy="859" r="226" fill="url(#gradient)">
                        <animateTransform attributeName="transform" type="translate" values="0 0; -300 -300; 0 0" begin="0s" dur="60s" repeatCount="indefinite" />
                    </circle>
                </svg>
            </div>
        );
}