import type { StructureResolver } from "sanity/structure";
import { SINGLETONS } from "./schemaTypes";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Skaylon")
    .items([
      ...SINGLETONS.map(({ id, type, title }) =>
        S.listItem().title(title).id(id).child(S.document().schemaType(type).documentId(id).title(title)),
      ),
      S.divider(),
      S.documentTypeListItem("service").title("Services"),
      S.documentTypeListItem("project").title("Projects"),
    ]);
