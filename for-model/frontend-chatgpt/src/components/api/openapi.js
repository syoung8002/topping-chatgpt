import specYaml from "js-yaml-loader!./openapi.yaml";

const YAML = require('json2yaml');

let apiSpec = YAML.stringify(specYaml);

export default apiSpec;