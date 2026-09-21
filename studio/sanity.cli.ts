import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./env";

export default defineCliConfig({
  api: { projectId, dataset },
  studioHost: "skaylon-studio", // "skaylon" was already taken
  deployment: { autoUpdates: true },
});
