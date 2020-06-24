import TYPES from '../types.js';

const stylishFormatter = (meta) => {
  const lines = meta.map((node) => {
    switch (node.type) {
      case TYPES.ADDED:
        return `\t+ ${node.key}: ${node.value}`;
      case TYPES.DELETED:
        return `\t- ${node.key}: ${node.value}`;
      default:
        return `\t  ${node.key}: ${node.value}`;
    }
  });
  return `
  {
    ${lines.join('\n')}
  }
  `;
};

export default stylishFormatter;
