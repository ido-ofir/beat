
import React from 'react';

export default class Link extends React.Component{
    shouldComponentUpdate(props, state){
        return (props.link !== this.props.link) || (props.selected !== this.props.selected);
    }
    render(){
        let {diagram, link, selected} = this.props;
        let { id, startPoint, endPoint, points = [], className, strokeWidth = "3", stroke = "#222", curvyness = 0 } = link;
        if(selected){
            stroke = "#222"
        }
        let pointsToRender = [startPoint, ...points, endPoint];
        let lines = [];
        let circles = [];
        pointsToRender.map((point, i) => {
            if(!point){ return; }
            if(pointsToRender[i+1]){
                lines.push(
                    <path
                        key={`back-${i}`}
                        className={className}
                        strokeWidth={16}
                        stroke={stroke}
                        strokeLinecap="round"
                        data-link-from={pointsToRender[i].id || '__start'}
                        data-link-to={pointsToRender[i+1].id}
                        style={{pointerEvents: 'all', opacity: selected ? 0.4 : 0.1}}
                        d={diagram.utils.generateLinkPath(point, pointsToRender[i+1], 0)}
                    />,
                    <path
                        key={i}
                        className={className}
                        strokeWidth={strokeWidth}
                        stroke={stroke}
                        strokeLinecap="round"                        
                        d={diagram.utils.generateLinkPath(point, pointsToRender[i+1], 0)}
                    />
                )
            }
            if(i > 0){
                circles.push(
                    <circle 
                        key={`back-${i}`} 
                        data-point-id={point.id} 
                        cx={point.x} 
                        cy={point.y} 
                        r="12" 
                        style={{fill: "rgba(255,255,255,0.05)", pointerEvents: 'all', cursor: 'grabbing'}}>
                    </circle>,
                    <circle 
                        key={i} 
                        cx={point.x} 
                        cy={point.y} 
                        r="5" 
                        style={{fill: "rgba(255,255,255,0.5)"}}>
                    </circle>
                )
            }
        })
        return (
            <div 
                style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none'}}
                data-link-id={id}>
                <svg 
                    style={{ overflow: 'visible' }}
                >
                    <g>
                        {lines}
                        {circles}
                    </g>
                </svg>
            </div>
        );
    }
}