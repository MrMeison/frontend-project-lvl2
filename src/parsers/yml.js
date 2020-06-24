import yaml from 'js-yaml';

const ymlParser = (content) => yaml.safeLoad(content);
export default ymlParser;
