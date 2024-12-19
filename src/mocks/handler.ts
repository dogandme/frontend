import { authHandlers } from "./handlers/auth";
import { followHandlers } from "./handlers/follow";
import { mapHandlers } from "./handlers/map";
import { markingHandlers } from "./handlers/marking";
import { profileHandlers } from "./handlers/profile";
import { settingHandlers } from "./handlers/setting";

export const handlers = [
  ...authHandlers,
  ...followHandlers,
  ...mapHandlers,
  ...markingHandlers,
  ...profileHandlers,
  ...settingHandlers,
];
