const CANVAS_OPTIONS = {
    height: "900px",
    interaction: { navigationButtons: true },
    edges: {
      smooth: {
        enabled: true,
      },
    },
    physics: {
      solver: 'repulsion',
      maxVelocity: 10,
      repulsion: {
        centralGravity: 0,
        springLength: 100,
        springConstant: 0.1,
        nodeDistance: 100,
        damping: 0.09
      },
    },
    
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

  export {CANVAS_OPTIONS}