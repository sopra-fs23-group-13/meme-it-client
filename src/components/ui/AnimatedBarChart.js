import { useSpring, animated} from 'react-spring'
import { useMeasure } from 'react-use'
import React, {useEffect, useRef, useState} from "react";
import styles from '../../styles/ui/animatedbarchart.module.css'
import {api} from "../../helpers/api";
import {lobby} from "../../helpers/endpoints";
import {Container, Row} from "react-bootstrap";
import {GrTrophy} from "react-icons/gr";

const AnimatedBarChart = ({highScore, player, rank, meme}) => {
    const [trophyIsHovered, setTrophyIsHovered] = useState(false)
    const rankColors = ["#FFD700", "#C0C0C0", "#CD7F32"];
    const [ref, { height }] = useMeasure()
    const props = useSpring(
        {
            height: height*(player.score/highScore),
            background: rankColors[rank-1],
            delay: 250
        }
    )

    const trophyProps = useSpring({
        display: 'inline-block',
        backfaceVisibility: 'hidden',
        transform: trophyIsHovered
            ? `rotate(45deg)`
            : `rotate(0deg)`,
        config: {
            tension: 300,
            friction: 10,
        },
        transition: "transform 150ms"
    });

    React.useEffect(() => {
        if (!trophyIsHovered) {
            return;
        }
        const timeoutId = window.setTimeout(() => {
            setTrophyIsHovered(false);
        }, 150);
        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [trophyIsHovered, 150]);
    const triggerTrophyShake = () => {
        setTrophyIsHovered(true);
    };
    console.log(4 - player.name.length/20 + "vh")

    //            <img  style={{width:100, cursor:"pointer"}} src={meme.imageUrl}/>
    return (
        <div className={styles.container}>
            <div ref={ref} className={styles.main}>
                <animated.div className={styles.fill} style={props}/>
                <animated.div className={styles.content} onMouseEnter={triggerTrophyShake}>
                    <Container>
                        {rank === 1 ?
                            <Row style={{fontSize:"30px", textAlign:"center", marginBottom:"0.5em"}}>
                                <animated.span style={trophyProps}>
                                    <GrTrophy size={"5vh"}/>
                                </animated.span>
                            </Row> : null}
                        <Row style={{fontSize:"30px", textAlign:"center", marginBottom:"0.3em"}}>
                            <b>{rank === 1 ? "1st" : rank === 2 ? "2nd" : "3rd"
                            }</b>
                        </Row>
                        <Row>
                            <p style={{fontSize:"2vh", textAlign:"center"}}>
                                {player.score} Points
                            </p>
                        </Row>
                        <Row>
                            <b style={{fontSize: 4 - player.name.length/5 + "vh", textAlign:"center", marginBottom:"0.5em", marginTop:"-0.5em"}}>
                                {player.name}
                            </b>
                        </Row>
                    </Container>
                </animated.div>
            </div>
        </div>
    )

}

export default AnimatedBarChart;