import React, { useState, useEffect } from 'react';
import { Row, Col, Button  } from 'antd';
import { connect } from 'umi';
import * as go from 'gojs';

import './index.scss'

let myDiagram;

const index = (props) => {

  const [savedModelValue, setSavedModelValue] = useState(`
    { "class": "go.GraphLinksModel",
      "linkFromPortIdProperty": "fromPort",
      "linkToPortIdProperty": "toPort",
      "nodeDataArray": [],
      "linkDataArray": []
    }
  `)
  
  

  const loadDiagramProperties = (e) => {
    // set Diagram.initialPosition, not Diagram.position, to handle initialization side-effects
    var pos = myDiagram.model.modelData.position;
    if (pos) myDiagram.initialPosition = go.Point.parse(pos);
  }
  const load = () => {
    myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
    loadDiagramProperties();  // do this after the Model.modelData has been brought into memory
  }

  
  const saveDiagramProperties = () => {
    if(myDiagram.position){
      myDiagram.model.modelData.position = go.Point.stringify(myDiagram.position);
    }
    
  }

  const save = () => {
    debugger
    saveDiagramProperties();  // do this first, before writing to JSON
debugger
    console.log(myDiagram.model.toJson())
    let value = myDiagram.model.toJson();
    setSavedModelValue(value)
    myDiagram.isModified = false;
  }


  const initDiagram = () => {
    const $ = go.GraphObject.make;
    myDiagram = $(go.Diagram, "myDiagramDiv", // must name or refer to the DIV HTML element
      {
        grid: $(go.Panel, "Grid", $(go.Shape, "LineH", {
          stroke: "lightgray",
          strokeWidth: 0.5
        }), $(go.Shape, "LineH", {
          stroke: "gray",
          strokeWidth: 0.5,
          interval: 10
        }), $(go.Shape, "LineV", {
          stroke: "lightgray",
          strokeWidth: 0.5
        }), $(go.Shape, "LineV", {
          stroke: "gray",
          strokeWidth: 0.5,
          interval: 10
        })),
        "draggingTool.dragsLink": true,
        "draggingTool.isGridSnapEnabled": true,
        "linkingTool.isUnconnectedLinkValid": true,
        "linkingTool.portGravity": 20,
        "relinkingTool.isUnconnectedLinkValid": true,
        "relinkingTool.portGravity": 20,
        "relinkingTool.fromHandleArchetype": $(go.Shape, "Diamond", {
          segmentIndex: 0,
          cursor: "pointer",
          desiredSize: new go.Size(8, 8),
          fill: "tomato",
          stroke: "darkred"
        }),
        "relinkingTool.toHandleArchetype": $(go.Shape, "Diamond", {
          segmentIndex: -1,
          cursor: "pointer",
          desiredSize: new go.Size(8, 8),
          fill: "darkred",
          stroke: "tomato"
        }),
        "linkReshapingTool.handleArchetype": $(go.Shape, "Diamond", {
          desiredSize: new go.Size(7, 7),
          fill: "lightblue",
          stroke: "deepskyblue"
        }),
        "rotatingTool.handleAngle": 270,
        "rotatingTool.handleDistance": 30,
        "rotatingTool.snapAngleMultiple": 15,
        "rotatingTool.snapAngleEpsilon": 15,
        "undoManager.isEnabled": true
      });

    // when the document is modified, add a "*" to the title and enable the "Save" button
    myDiagram.addDiagramListener("Modified", function (e) {
      var button = document.getElementById("SaveButton");
      if (button) button.disabled = !myDiagram.isModified;
      var idx = document.title.indexOf("*");
      if (myDiagram.isModified) {
        if (idx < 0) document.title += "*";
      } else {
        if (idx >= 0) document.title = document.title.substr(0, idx);
      }
    });

    // Define a function for creating a "port" that is normally transparent.
    // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
    // and where the port is positioned on the node, and the boolean "output" and "input" arguments
    // control whether the user can draw links from or to the port.
    function makePort(name, spot, output, input) {
      // the port is basically just a small transparent square
      return $(go.Shape, "Circle", {
        fill: null, // not seen, by default; set to a translucent gray by showSmallPorts, defined below
        stroke: null,
        desiredSize: new go.Size(7, 7),
        alignment: spot, // align the port on the main Shape
        alignmentFocus: spot, // just inside the Shape
        portId: name, // declare this object to be a "port"
        fromSpot: spot,
        toSpot: spot, // declare where links may connect at this port
        fromLinkable: output,
        toLinkable: input, // declare whether the user may draw links to/from here
        cursor: "pointer" // show a different cursor to indicate potential link point
      });
    }

    const nodeSelectionAdornmentTemplate = $(go.Adornment, "Auto", $(go.Shape, {
      fill: null,
      stroke: "deepskyblue",
      strokeWidth: 1.5,
      strokeDashArray: [4, 2]
    }), $(go.Placeholder));

    const nodeResizeAdornmentTemplate = $(go.Adornment, "Spot", {
      locationSpot: go.Spot.Right
    }, $(go.Placeholder), $(go.Shape, {
      alignment: go.Spot.TopLeft,
      cursor: "nw-resize",
      desiredSize: new go.Size(6, 6),
      fill: "lightblue",
      stroke: "deepskyblue"
    }), $(go.Shape, {
      alignment: go.Spot.Top,
      cursor: "n-resize",
      desiredSize: new go.Size(6, 6),
      fill: "lightblue",
      stroke: "deepskyblue"
    }), $(go.Shape, {
      alignment: go.Spot.TopRight,
      cursor: "ne-resize",
      desiredSize: new go.Size(6, 6),
      fill: "lightblue",
      stroke: "deepskyblue"
    }), $(go.Shape, {
      alignment: go.Spot.Left,
      cursor: "w-resize",
      desiredSize: new go.Size(6, 6),
      fill: "lightblue",
      stroke: "deepskyblue"
    }), $(go.Shape, {
      alignment: go.Spot.Right,
      cursor: "e-resize",
      desiredSize: new go.Size(6, 6),
      fill: "lightblue",
      stroke: "deepskyblue"
    }), $(go.Shape, {
      alignment: go.Spot.BottomLeft,
      cursor: "se-resize",
      desiredSize: new go.Size(6, 6),
      fill: "lightblue",
      stroke: "deepskyblue"
    }), $(go.Shape, {
      alignment: go.Spot.Bottom,
      cursor: "s-resize",
      desiredSize: new go.Size(6, 6),
      fill: "lightblue",
      stroke: "deepskyblue"
    }), $(go.Shape, {
      alignment: go.Spot.BottomRight,
      cursor: "sw-resize",
      desiredSize: new go.Size(6, 6),
      fill: "lightblue",
      stroke: "deepskyblue"
    }));

    const nodeRotateAdornmentTemplate = $(go.Adornment, {
      locationSpot: go.Spot.Center,
      locationObjectName: "CIRCLE"
    }, $(go.Shape, "Circle", {
      name: "CIRCLE",
      cursor: "pointer",
      desiredSize: new go.Size(7, 7),
      fill: "lightblue",
      stroke: "deepskyblue"
    }), $(go.Shape, {
      geometryString: "M3.5 7 L3.5 30",
      isGeometryPositioned: true,
      stroke: "deepskyblue",
      strokeWidth: 1.5,
      strokeDashArray: [4, 2]
    }));

    myDiagram.nodeTemplate = $(go.Node, "Spot", {
      locationSpot: go.Spot.Center
    }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), {
      selectable: true,
      selectionAdornmentTemplate: nodeSelectionAdornmentTemplate
    }, {
      resizable: true,
      resizeObjectName: "PANEL",
      resizeAdornmentTemplate: nodeResizeAdornmentTemplate
    }, {
      rotatable: true,
      rotateAdornmentTemplate: nodeRotateAdornmentTemplate
    }, new go.Binding("angle").makeTwoWay(),
      // the main object is a Panel that surrounds a TextBlock with a Shape
      $(go.Panel, "Auto", {
        name: "PANEL"
      }, new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify), $(go.Shape, "Rectangle", // default figure
        {
          portId: "", // the default port: if no spot on link data, use closest side
          fromLinkable: true,
          toLinkable: true,
          cursor: "pointer",
          fill: "white", // default color
          strokeWidth: 2
        }, new go.Binding("figure"), new go.Binding("fill")), $(go.TextBlock, {
          font: "bold 11pt Helvetica, Arial, sans-serif",
          margin: 8,
          maxSize: new go.Size(160, NaN),
          wrap: go.TextBlock.WrapFit,
          editable: true
        }, new go.Binding("text").makeTwoWay())),
      // four small named ports, one on each side:
      makePort("T", go.Spot.Top, false, true), makePort("L", go.Spot.Left, true, true), makePort("R", go.Spot.Right, true, true), makePort("B", go.Spot.Bottom, true, false), { // handle mouse enter/leave events to show/hide the ports
      mouseEnter: function (e, node) {
        showSmallPorts(node, true);
      },
      mouseLeave: function (e, node) {
        showSmallPorts(node, false);
      }
    });

    function showSmallPorts(node, show) {
      node.ports.each(function (port) {
        if (port.portId !== "") { // don't change the default port, which is the big shape
          port.fill = show ? "rgba(0,0,0,.3)" : null;
        }
      });
    }

    const linkSelectionAdornmentTemplate = $(go.Adornment, "Link", $(go.Shape,
      // isPanelMain declares that this Shape shares the Link.geometry
      {
        isPanelMain: true,
        fill: null,
        stroke: "deepskyblue",
        strokeWidth: 0
      }) // use selection object's strokeWidth
    );

    myDiagram.linkTemplate = $(go.Link, // the whole link panel
      {
        selectable: true,
        selectionAdornmentTemplate: linkSelectionAdornmentTemplate
      }, {
      relinkableFrom: true,
      relinkableTo: true,
      reshapable: true
    }, {
      routing: go.Link.AvoidsNodes,
      curve: go.Link.JumpOver,
      corner: 5,
      toShortLength: 4
    }, new go.Binding("points").makeTwoWay(), $(go.Shape, // the link path shape
      {
        isPanelMain: true,
        strokeWidth: 2
      }), $(go.Shape, // the arrowhead
        {
          toArrow: "Standard",
          stroke: null
        }), $(go.Panel, "Auto", new go.Binding("visible", "isSelected").ofObject(), $(go.Shape, "RoundedRectangle", // the link shape
          {
            fill: "#F8F8F8",
            stroke: null
          }), $(go.TextBlock, {
            textAlign: "center",
            font: "10pt helvetica, arial, sans-serif",
            stroke: "#919191",
            margin: 2,
            minSize: new go.Size(10, NaN),
            editable: true
          }, new go.Binding("text").makeTwoWay())));

    load(); // load an initial diagram from some JSON text


    debugger
    // initialize the Palette that is on the left side of the page
    const initMyPalette = $(go.Palette, "myPaletteDiv", // must name or refer to the DIV HTML element
      {
        maxSelectionCount: 1,
        nodeTemplateMap: myDiagram.nodeTemplateMap, // share the templates used by myDiagram
        linkTemplate: // simplify the link template, just in this Palette
          $(go.Link, { // because the GridLayout.alignment is Location and the nodes have locationSpot == Spot.Center,
            // to line up the Link in the same manner we have to pretend the Link has the same location spot
            locationSpot: go.Spot.Center,
            selectionAdornmentTemplate: $(go.Adornment, "Link", {
              locationSpot: go.Spot.Center
            }, $(go.Shape, {
              isPanelMain: true,
              fill: null,
              stroke: "deepskyblue",
              strokeWidth: 0
            }), $(go.Shape, // the arrowhead
              {
                toArrow: "Standard",
                stroke: null
              }))
          }, {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpOver,
            corner: 5,
            toShortLength: 4
          }, new go.Binding("points"), $(go.Shape, // the link path shape
            {
              isPanelMain: true,
              strokeWidth: 2
            }), $(go.Shape, // the arrowhead
              {
                toArrow: "Standard",
                stroke: null
              })),
        model: new go.GraphLinksModel([ // specify the contents of the Palette
          {
            text: "Start",
            figure: "Circle",
            fill: "#00AD5F"
          }, {
            text: "Step"
          }, {
            text: "DB",
            figure: "Database",
            fill: "lightgray"
          }, {
            text: "???",
            figure: "Diamond",
            fill: "lightskyblue"
          }, {
            text: "End",
            figure: "Circle",
            fill: "#CE0620"
          }, {
            text: "Comment",
            figure: "RoundedRectangle",
            fill: "lightyellow"
          }
        ], [
          // the Palette also has a disconnected Link, which the user can drag-and-drop
          {
            points: new go.List( /*go.Point*/).addAll([new go.Point(0, 0), new go.Point(30, 0), new go.Point(30, 40), new go.Point(60, 40)])
          }
        ])
      });

    // setMyPalette(initMyPalette)

    // setMyDiagram(myDiagram)
  }

  useEffect(() => {
    initDiagram()
  }, []);


  return (
    <div className="go-page-wrap">
      <div style={{width: "100%", display: "flex", justifyContent: "space-between"}}>
        <div id="myPaletteDiv" style={{width: "105px", marginRight: "2px", backgroundColor: "whitesmoke", border: "solid 1px black"}}></div>
        <div id="myDiagramDiv" style={{flexGrow: 1, height: "450px", border: "solid 1px black"}}></div>
      </div>
      <div className="text-center mt-1">
        <Button type="primary" className="mr-1" onClick={save}>Save</Button>
        <Button onClick={load}>Load</Button>
      </div>
      <div className="text-center"> Diagram Model saved in JSON format:</div>
      <textarea id="mySavedModel" onChange={save} value={savedModelValue} style={{width:"100%", height:"300px"}}>

      </textarea>
    </div>
  );
}

const mapStateToProps = ({ loading, project, attributes, login }) => ({
  loading,
  allModelData: project.allModelData,

});

const mapDispatchToProps = dispatch => ({
  
  getAllModelData() {
    return dispatch({
      type: 'project/getAllModelData'
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(index);
