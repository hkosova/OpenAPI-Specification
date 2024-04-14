import { readdirSync, readFileSync } from "node:fs";
import YAML from "yaml";
import { validate, setMetaSchemaOutputFormat } from "@hyperjump/json-schema/openapi-3-1";
import { BASIC } from "@hyperjump/json-schema/experimental";
import { describe, test, expect } from "vitest";


const parseYamlFromFile = (filePath) => {
  const schemaYaml = readFileSync(filePath, "utf8");
  return YAML.parse(schemaYaml, { prettyErrors: true });
};

setMetaSchemaOutputFormat(BASIC);
// setShouldValidateSchema(false);

const validateOpenApi = await validate("./schemas/v3.1/schema.json");

describe("v3.1", () => {
  describe("Pass", () => {
    readdirSync(`./tests/v3.1/pass`, { withFileTypes: true })
      .filter((entry) => entry.isFile() && /\.yaml$/.test(entry.name))
      .forEach((entry) => {
        test(entry.name, () => {
          const instance = parseYamlFromFile(`./tests/v3.1/pass/${entry.name}`);
          const output = validateOpenApi(instance, BASIC);
          expect(output.valid).to.equal(true);
        });
      });
  });

  describe("Fail", () => {
    readdirSync(`./tests/v3.1/fail`, { withFileTypes: true })
      .filter((entry) => entry.isFile() && /\.yaml$/.test(entry.name))
      .forEach((entry) => {
        test(entry.name, () => {
          const instance = parseYamlFromFile(`./tests/v3.1/fail/${entry.name}`);
          const output = validateOpenApi(instance, BASIC);
          expect(output.valid).to.equal(false);
        });
      });
  });
});
