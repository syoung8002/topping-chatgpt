import yamlData from "js-yaml-loader!../api/openapi.yaml";

const YAML = require('json2yaml');

let apiSpec = YAML.stringify(yamlData);

export default apiSpec;