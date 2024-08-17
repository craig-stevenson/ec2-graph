function createAwsNode() {
  const node = {
    'id': 'AWS-node',
    'label': 'AWS',
    'color': '#FF9900',
    'shape': 'box',
    font: {
      color: 'white',
      size: 48,
    },
  };

  return node;
}

export { createAwsNode }