
import React from 'react';
import PropTypes from 'prop-types';
import utils from './utils.js';

import Node from './Node';
import Link from './Link';

class Nodes extends React.Component{
    shouldComponentUpdate(props, state){
        return (props.nodes !== this.props.nodes) || (props.selected !== this.props.selected);
    }
    render(){
        let {nodes, diagram, selected, getNodeProps, widgets} = this.props;        
        return nodes.map(node => 
            <Node 
                node={node} 
                key={node.id} 
                diagram={diagram} 
                selected={selected[node.id]}
                widgets={widgets}
                getNodeProps={getNodeProps}
            />
        );
    }
}

class Links extends React.Component{
    shouldComponentUpdate(props, state){
        return (props.links !== this.props.links) || (props.selected !== this.props.selected);
    }
    render(){
        let {links, diagram, selected} = this.props;
        return links.map(link => <Link link={link} key={link.id} diagram={diagram} selected={selected[link.id]}/>);
    }
}

export default class Diagram extends React.Component{
    static propTypes = {
        data: PropTypes.object,
        onEvent: PropTypes.func,
        widgets: PropTypes.object,
        getNodeProps: PropTypes.func,
        style: PropTypes.object,
    };
    static defaultProps = {
        data: {
            diagram: {x:0, y:0,zoom:1},
            nodes: [],
            links: []
        }
    };
    constructor(props){
        super(props);
        this.utils = utils;
        this.updatedNodes = {};
        this.updatedPoints = {};
        let data = {...props.data || {}, links: []}
        this.state = {
            data,
            action: null,
            mouseIsDown: false,
            lastMousePosition: {x:0,y:0},
            selected: {
                nodes: {},
                links: {}
            }
        };
        this.onEvent({
            type: 'nodesWillMount',
            nodes: data.nodes
        });
    }

    componentDidMount(){
        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('mousemove', this.onMouseMove);
        let data = this.props.data || {};
        let links = data.links || [];
        this.setData(['links'], links);
        window.top.diagram = this;
        this.onEvent({
            type: 'nodesDidMount',
            nodes: data.nodes || []
        });
    }

    componentDidUpdate(){
        let nodeKeys = Object.keys(this.updatedNodes);
        let pointKeys = Object.keys(this.updatedPoints);
        let {data} = this.state;
        let linksToUpdate = {};

        // if nodes have updated
        if(nodeKeys.length){ 
            // should any links be updated because of node movement?   
            nodeKeys.map(key => {                
                let node = this.updatedNodes[key];
                (node.ports || []).map(port => {
                    (port.links || []).map(id => linksToUpdate[id] = 1)
                })
            });
            
            
        }

        // if link points have been moved
        if(pointKeys.length){
            // should any links be updated because of point movement?
            pointKeys.map(key => {
                let linkId = key.split(':')[0];
                linksToUpdate[linkId] = 1;
            })
            
        }

        // if any links should be updated
        if(Object.keys(linksToUpdate).length){
            // loop through all existing links
            this.setData(['links'], links => links.map(link => {
                // if a link shoud be re-rendered 
                if(linksToUpdate[link.id]){                    
                    // update the start and end points of the link
                    // to match the position of ports that it connects to
                    let startPoint = this.getPortCenter(...link.fromPort);
                    let endPoint = link.toPort ? this.getPortCenter(...link.toPort) : null;
                    let points = (link.points || []).map(point => {
                        let movedPoint = this.updatedPoints[`${link.id}:${point.id}`];
                        if(movedPoint){
                            return { ...point, x: movedPoint.x, y: movedPoint.y };
                        }
                        return point;
                    });
                    return {
                        ...link, 
                        startPoint,
                        endPoint,
                        points
                    };
                }
                return link;
            }));
        }
        this.updatedNodes = {};
        this.updatedPoints = {};
    }

    componentWillUnmount(){
        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('mousemove', this.onMouseMove);
    }

    onEvent = (...args) => {
        if(this.props.onEvent){
            this.props.onEvent(...args);
        }
    };

    moveItems = (action) => {
        this.setState({
            action: {
                type: 'moveItems',
                ...action
            }
        });
    };

    getLocalPosition = ({clientX = 0, clientY = 0}, zoom) => {
        let {diagram} = this.state.data;
        let rect = this.getBoundingRect();
        zoom = zoom || diagram.zoom;
        return {
            x: (clientX - rect.left - diagram.x) / zoom,
            y: (clientY - rect.top - diagram.y) / zoom,
        };
    };

    onKeyDown = (e) => {
        if(e.keyCode === 8){
            let {selected, data} = this.state;
            let linksToDelete = {};
            let deletedNodes = {};
            let deletedLinks = {};
            let nodes = data.nodes.filter(node => {
                if(selected.nodes[node.id]){
                    deletedNodes[node.id] = node;
                    node.ports.map(port => {
                        port.links.map(linkId => linksToDelete[linkId] = 1);
                    })
                    return false;
                }
                return true;
            });
            let links = data.links.filter(link => {
                if(selected.links[link.id] || linksToDelete[link.id]){
                    deletedLinks[link.id] = link;
                    return false;
                }
                return true;
            });
            this.setState({
                data: {
                    ...data,
                    nodes,
                    links
                }
            });
            this.onEvent({
                type: 'delete',
                nodes: deletedNodes,
                links: deletedLinks,
            })
        }
    };

    onMouseDown = (e) => {
        let targets = utils.getTargets(e.target);
        if(targets.ignore){
            return;
        }
        let mousePosition = {x: e.clientX, y: e.clientY};
        let localMousePosition = this.getLocalPosition(e);
        let {selected} = this.state;
        
        // if mouse went down inside a node
        if(targets.nodeId){
            // if mouse went down inside a port
            if(targets.portId){
                // we pull a new link from the port
                let movingPoint = utils.withId(localMousePosition);
                let link = this.addLink({
                    "type": "link",
                    "fromPort": [
                        targets.nodeId,
                        targets.portId
                    ],
                    "toPort": null,
                    "startPoint": movingPoint,
                    "endPoint": null,
                    "curvyness": 5,
                    "points": [movingPoint]
                });
                this.moveItems({
                    subType: 'createLink',
                    targets,
                    points: [
                        [link.id, movingPoint.id]
                    ]
                });
                this.setState({
                    selected: {
                        nodes: {},
                        links: {[link.id]: 1}
                    }
                });
            }
            // if mouse went down on the node
            else{
                // move the node
                this.moveItems({
                    subType: 'moveNode',
                    targets,
                    nodes: [targets.nodeId]
                });
                this.setState({
                    selected: {
                        links: {},
                        nodes: {[targets.nodeId]: 1}
                    }
                });
            }
        }
        else if(targets.linkId){
            // if the mouse went down on a point
            if(targets.pointId){
                // move the point
                this.moveItems({
                    subType: 'movePoint',
                    targets,
                    points: [
                        [targets.linkId, targets.pointId]
                    ]
                });
                this.setState({
                    selected: {
                        nodes: selected.nodes,
                        links: {
                            [targets.linkId] : 1
                        }
                    }
                })
            }
            // if the mouse went down on a link
            else if(targets.linkTo || targets.linkFrom){
                // start dragging the point
                this.moveItems({
                    subType: 'selectLink',
                    targets
                });
                this.setState({
                    selected: {
                        nodes: {},
                        links: {
                            [targets.linkId] : 1
                        }
                    }
                })
            }
            else{
                // a link element was clicked 
                // but not the line or point
                // so just ignore it and pretend 
                // we clicked on the canvas
                this.moveItems({
                    subType: 'moveCanvas'
                });
            }
        }
        else if(targets.canvas){
            this.moveItems({
                subType: 'moveCanvas'
            });
            this.setState({
                selected: {
                    nodes: Object.keys(selected.nodes).length ? {} : selected.nodes, 
                    links: Object.keys(selected.links).length ? {} : selected.links
                }
            })
        }
        this.setState({
            mouseIsDown: true, 
            lastMousePosition: mousePosition,
        });
    };

    onMouseMove = (e) => {
        let { mouseIsDown, lastMousePosition, action, data } = this.state;
        if(!mouseIsDown){ return; }
        if(!action){ return; }
        let zoom = data.diagram.zoom || 1;
        let currentMousePosition = {x:e.clientX, y:e.clientY};
        // if moving something
        if(action.type === 'moveItems'){
            let {nodes, points, subType, targets} = action;
            // if the canvas is being dragged
            if(subType === 'moveCanvas'){
                let diagram = this.state.data.diagram;
                let x = diagram.x - ((lastMousePosition.x - currentMousePosition.x))
                let y = diagram.y - ((lastMousePosition.y - currentMousePosition.y))
                this.setData(['diagram'], {x, y})
            }
            // if a link was just selected and is now dragged
            else if(subType === 'selectLink'){
                // create a new point on the link
                let localMousePosition = this.getLocalPosition(e);
                let point = this.addPoint(targets.linkId, localMousePosition, targets.linkTo);
                // start dragging the point
                this.moveItems({
                    subType: 'movePoint',
                    targets,
                    points: [
                        [targets.linkId, point.id]
                    ]
                });
            }
            else{
                // if any nodes sould move
                if(nodes && nodes.length){
                    // update the position of nodes that should move
                    this.setNode(nodes.map(id => {
                        let node = this.getNode(id);
                        return {
                            id, 
                            x: node.x + (currentMousePosition.x - lastMousePosition.x) / zoom,
                            y: node.y + (currentMousePosition.y - lastMousePosition.y) / zoom,
                        }
                    }), true)
                }
                // if any points on links sould move
                if(points && points.length){
                    // save the position of nodes that should move.
                    // we render them in the next cycle via 'componentDidUpdate'
                    points.map(([linkId, pointId]) => {
                        let point = this.getPoint(linkId, pointId);
                        this.updatedPoints[`${linkId}:${pointId}`] = {
                            id: pointId, 
                            x: point.x + (currentMousePosition.x - lastMousePosition.x) / zoom,
                            y: point.y + (currentMousePosition.y - lastMousePosition.y) / zoom,
                        }
                    });
                }
            }
        }
        this.setState({
            lastMousePosition: currentMousePosition
        });
    };

    onMouseUp = (e) => {
        let {action} = this.state;
        if(action){
            // what is under the mouse?
            let {portId, nodeId} = utils.getTargets(e.target);
            let {type, points, targets, nodes, subType} = action;

            // if it's a port inside a node
            if(portId && nodeId){
                // if the user is dragging something
                if(type === 'moveItems'){
                    // if it's a link that was just created
                    if(subType === 'createLink'){

                        //* A new link connects to a port

                        // get the new link
                        let [linkId, pointId] = points[0];
                        let link = this.getLink(linkId);
                        
                        // if the end port is the start port
                        // delete the link
                        let [fromNode, fromPort] = link.fromPort;
                        if(nodeId === fromNode && portId === fromPort){
                            this.setData(['links'], links => links.filter(l => l.id !== linkId));
                        }
                        // else connect the link to the port
                        else{
                            // set the end port of the link
                            this.setLink({
                                id: linkId,
                                points: [],
                                toPort: [nodeId, portId],
                                endPoint: this.getPortCenter(nodeId, portId)
                            });

                            // add the link to the port's links
                            let port = this.getPort(nodeId, portId);
                            this.setPort(nodeId, {
                                ...port,
                                links: (port.links || []).concat(linkId)
                            });
                            this.onEvent({
                                type: 'nodeDidConnect',
                                nodeId,
                                linkId
                            }, this);
                        }
                    }
                    else if(subType === 'movePoint'){

                        //* A link's point was dropped on a node's port

                        // get the link and it's ports
                        let [linkId, pointId] = points[0];
                        let link = this.getLink(linkId);
                        let [fromNode, fromPort] = link.fromPort;

                        // get the node at the end of the link
                        let toPort = link.toPort;
                        let startNode = this.getNode(fromNode);
                        let endNode = toPort && this.getNode(toPort[0]);
                        let node = this.getNode(nodeId);

                        //? if it's the only point on the link and the link is not connected
                        if(link.points.length === 1 && !toPort){
                            // if the end port is the start port
                            if(nodeId === fromNode && portId === fromPort){
                                // delete the link
                                this.setData(['links'], links => links.filter(l => l.id !== linkId));
                            }
                            else{
                                // connect the link to the node's port
                                // and delete the point
                                this.setLink({
                                    id: linkId,
                                    toPort: [nodeId, portId],
                                    points: [],
                                    endPoint: this.getPortCenter(nodeId, portId)
                                });
                                // connect the node's port to the link
                                let port = this.getPort(nodeId, portId)
                                this.setPort(nodeId, {
                                    ...port,
                                    links: (port.links || []).filter(t => t !== linkId).concat(linkId)
                                })
                            }
                        }
                        //? if the point was dropped on the start port
                        else if((nodeId === fromNode) && (portId === fromPort)){
                            // delete the point
                            this.setData(['links', {id: linkId}, 'points'], points => points.filter(p => p.id !== pointId));
                        }
                        //? if the point was dropped on the end port
                        else if((nodeId === toPort[0]) && (portId === toPort[1])){
                            // delete the point
                            this.setData(['links', {id: linkId}, 'points'], points => points.filter(p => p.id !== pointId));
                        }
                        //? if the point was dropped on different port
                        else{
                            // we split the link into two links
                            // and connect both to the port
                            let newLinkId = utils.uuid();
                            let pointsA = [];
                            let pointsB = [];
                            let isB = false;

                            link.points.map((point, i) => {
                                if(point.id === pointId){
                                    return isB = true;
                                }
                                (isB ? pointsB : pointsA).push(point);
                            });
                            
                            this.setLink({
                                id: linkId,
                                points: pointsA,
                                toPort: [nodeId, portId],
                                endPoint: this.getPortCenter(nodeId, portId)
                            });
                            this.addLink({
                                ...link,
                                id: newLinkId,
                                fromPort: [nodeId, portId],
                                points: pointsB,
                                startPoint: this.getPortCenter(nodeId, portId)
                            });

                            // add both links to the current port
                            let port = this.getPort(nodeId, portId);
                            this.setPort(nodeId, {
                                ...port,
                                links: (port.links || []).filter(t => t !== linkId).concat(pointsB.length ? [linkId, newLinkId] : [linkId])
                            })

                            // if the link is connected at the end
                            // change the link on the port 
                            // at the end of the link
                            if(endNode){
                                let endPort = this.getPort(toPort[0], toPort[1]);
                                this.setPort(toPort[0], {
                                    ...endPort,
                                    links: (endPort.links || []).filter(t => t !== linkId).concat(newLinkId)
                                });
                            }
                            else{

                            }
                        }
                    }
                }
            }
        }
        
        this.setState({mouseIsDown: false, action: null});
    };

    onMouseWheel = (e) => {
        // zoom in or out when the mouse wheel is turned
        let { diagram } = this.state.data;
        let oldZoom = diagram.zoom || 1;
        // increase or decrease the zoom
        let diff = e.deltaY / 1000;
        let zoom = oldZoom * (1 + diff);
        // this makes the zooming point the mouse position
        let position = this.getLocalPosition(e);
        let nextPosition = this.getLocalPosition(e, zoom);
        let x = diagram.x + (nextPosition.x - position.x) * zoom; // - diagram.x * diff;
        let y = diagram.y + (nextPosition.y - position.y) * zoom; // - diagram.y * diff;
        if(e.deltaY){
            this.setData(['diagram'], {zoom, x, y})
        }
    };
    
    getBoundingRect = () => {
        return this.refs.root.getBoundingClientRect();
    };

    updateData = (data) => {
        this.setState({
            data: {
                ...this.state.data,
                ...data
            }
        });
    };

    setData = (selector, data) => {
        let newData = utils.set(this.state.data, selector, data);
        this.setState({
            data: newData
        });
        return newData;
    };

    getData = (selector) => {
        return utils.get(this.state.data, selector);
    };
    
    setNode = (node, updateLinks) => {
        if(!node){return;}
        // accepts an array of nodes
        let nodes = Array.isArray(node) ? node : [node];
        if(!nodes.length){return;}
        let updatedNodes = {};
        this.setData(['nodes'], existingNodes => existingNodes.map(n => {
            node = nodes.find(n2 => n.id === n2.id);
            if(node){
                n = { ...n, ...node };
                updatedNodes[n.id] = n;
                if(updateLinks){
                    this.updatedNodes[n.id] = n;
                }
            }
            return n
        }));
        this.onEvent({
            type: 'nodesUpdated',
            nodes: updatedNodes
        })
    };
    
    setLink = (link) => {
        this.setData(['links', {id: link.id}], link)
    };

    setPort = (nodeId, port) => {
        let node = this.getNode(nodeId);
        let ports = [...node.ports];
        let portIndex = ports.findIndex(p => p.id === port.id);
        ports[portIndex] = port;
        this.setNode([
            { id: nodeId, ports }
        ], true);
    };

    addLink = (link) => {
        let { links = [], nodes = [] } = this.state.data;
        link = utils.withId(link);
        let [nodeId, portId] = link.fromPort;
        // this.setData(['links'], links => links.concat(link));
        // this.setData(['nodes', {id: nodeId}, 'ports', {id: portId}, 'links'], links => links.concat(link.id));
        this.updateData({
            links: links.concat(link),
            nodes: nodes.map(node => {
                if(node.id === nodeId){
                    return {
                        ...node,
                        ports: node.ports.map(port => {
                            if(port.id === portId){
                                return {
                                    ...port,
                                    links: (port.links || []).concat(link.id)
                                }
                            }
                            return port;
                        })
                    }
                }
                return node;
            })
        });
        return link;
    };
    addPoint = (linkId, point, linkTo) => {
        point = utils.withId(point);
        let link = this.getLink(linkId);
        if(link){
            this.setData(['links', {id: linkId}, 'points'], (points) => {
                points = [...points];
                if(linkTo){
                    let index = points.findIndex(p => p.id === linkTo);
                    if(index !== -1){
                        points.splice(index, 0, point);
                    }
                }
                else{
                    points.push(point);
                }
                return points;
            });
        }
        return point;
    };

    removeLink = (linkId) => {

    };

    removeNode = (nodeId) => {

    };

    getNode = (nodeId) => {
        return this.getData(['nodes', {id: nodeId}]);
    };

    getLink = (linkId) => {
        return this.getData(['links', {id: linkId}]);
    };

    getPort = (nodeId, portId) => {
        return this.getData(['nodes', {id: nodeId}, 'ports', {id: portId}]);
    };

    getPoint = (linkId, pointId) => {
        return this.getData(['links', {id: linkId}, 'points', {id: pointId}]);
    };

    getPortCenter = (nodeId, portId) => {
        let {data} = this.state;
        let portElement = this.refs.root.querySelector(`[data-node-id=${nodeId}] [data-port-id=${portId}]`);
        let position = utils.getElementCenter(portElement);
        let zoom = data.diagram.zoom;
        let x = (position.x - data.diagram.x) / zoom;
        let y = (position.y - data.diagram.y) / zoom;
        return {x, y};
    };
    render(){
        let {data, selected} = this.state;
        let {widgets, getNodeProps, style} = this.props;
        let {nodes = [], links = [], diagram} = data;
        let {x,y,zoom} = diagram;
        let transform = `translate(${x}px,${y}px) scale(${zoom})`;
        return (
            <div 
                ref="root"
                data-canvas
                style={{
                    width: '100%', 
                    height: '100%', 
                    flex: 1, 
                    position: 'relative',
                    overflow: 'hidden',
                    ...style                  
                }}
                onMouseDown={this.onMouseDown}
                onKeyDown={this.onKeyDown}
                onWheel={this.onMouseWheel}
                tabIndex="0"
            >
                <div style={{ position: 'absolute', transform }}>
                    {links.length ? <Links ref="links" links={links} selected={selected.links} diagram={this}/> : null}
                </div>
                <div style={{ position: 'absolute', transform }}>
                    <Nodes 
                        ref="nodes" 
                        nodes={nodes} 
                        selected={selected.nodes}
                        getNodeProps={getNodeProps}
                        widgets={widgets.nodes}
                        diagram={this}/>
                </div>
                {/* <div style={{position: 'absolute', top: 0, left: 100}}>
                    x: <input type="number" style={{width: 40 }}value={x} onChange={e => this.setData(['diagram', 'x'], parseInt(e.target.value))}/>
                    y: <input type="number" style={{width: 40 }}value={y} onChange={e => this.setData(['diagram', 'y'], parseInt(e.target.value))}/>
                    z: <input type="number" style={{width: 40 }}value={zoom} onChange={e => this.setData(['diagram', 'zoom'], parseFloat(e.target.value))}/>
                </div> */}
            </div>
        );
    }
}