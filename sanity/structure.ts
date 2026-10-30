import type { StructureResolver } from "sanity/structure";
import { CogIcon } from "@sanity/icons/Cog";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { TagIcon } from "@sanity/icons/Tag";
import { UserIcon } from "@sanity/icons/User";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("CoreServe content")
    .items([
      S.listItem().title("Blog posts").icon(DocumentTextIcon).child(S.documentTypeList("post").title("Blog posts")),
      S.listItem().title("Categories").icon(TagIcon).child(S.documentTypeList("category").title("Categories")),
      S.listItem().title("Authors").icon(UserIcon).child(S.documentTypeList("author").title("Authors")),
      S.divider(),
      S.listItem().title("Blog settings").icon(CogIcon).child(S.document().schemaType("blogSettings").documentId("blogSettings")),
    ]);
