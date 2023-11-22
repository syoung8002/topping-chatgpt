forEach: Model
fileName: openapi.js
---
{{#boundedContexts}}
    {{#aggregates}}
import {{nameCamelCase}}Yaml from "js-yaml-loader!../api/{{nameCamelCase}}-openapi.yaml";
    {{/aggregates}}
{{/boundedContexts}}

const YAML = require('json2yaml');

let apiSpec = "";

{{#boundedContexts}}
    {{#aggregates}}
let {{nameCamelCase}}Spec = YAML.stringify({{nameCamelCase}}Yaml);
apiSpec += {{nameCamelCase}}Spec;

    {{/aggregates}}
{{/boundedContexts}}

export default apiSpec;