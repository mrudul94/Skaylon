import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./env";
import { schemaTypes, SINGLETONS } from "./schemaTypes";
import { structure } from "./structure";

const singletonTypes = new Set<string>(SINGLETONS.map((s) => s.type));
const singletonActions = new Set(["publish", "discardChanges", "restore"]);

export default defineConfig({
  name: "skaylon",
  title: "Skaylon",
  projectId,
  dataset,
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
    // Singletons can't be created from the "new document" menu...
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    // ...nor duplicated or deleted.
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
});
