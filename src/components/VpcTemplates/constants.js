const NODE_STYLE = {
    shape: 'box',
    borderWidth: 2,
    borderWidthSelected: 4,
    imagePadding: { left: 4, top: 4, right: 4, bottom: 4 },
    shapeProperties: {
      useBorderWithImage: false,
    },
    color: {
      border: 'black',
      background: '#fff',
    },
    font: {
      color: 'black',
      align: 'left'
    },
    shadow: {
      enabled: true,
      color: 'rgba(0,0,0,0.25)',
      size: 6,
      x: 0,
      y: 3,
    },
  };
  
  const CANVAS_OPTIONS = {
    height: "900px",
    interaction: {
      multiselect: true,
      navigationButtons: true
    },
  
    physics: false,
    /*
    {
      solver: 'repulsion',
      maxVelocity: 10,
      repulsion: {
        centralGravity: 0,
        springLength: 100,
        springConstant: 0.1,
        nodeDistance: 100,
        damping: 0.09
      },
    }
      */
  
    layout: {
      /*
      hierarchical: {
        enabled: true,
        levelSeparation: 200,
        nodeSpacing: 100,
        treeSpacing: 200,
        //blockShifting: true,
        edgeMinimization: true,
        parentCentralization: true,
        direction: 'UD',        // UD, DU, LR, RL
        //sortMethod: 'hubsize',  // hubsize, directed
        shakeTowards: 'leaves'  // roots, leaves
      }
      */
    }
  };
  
  export { NODE_STYLE, CANVAS_OPTIONS }