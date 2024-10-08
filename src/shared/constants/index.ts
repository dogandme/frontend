export const colors = {
  grey: {
    0: "#FFFFFF",
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#EEEEEE",
    300: "#E0E0E0",
    400: "#BDBDBD",
    500: "#9E9E9E",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
  },
  tangerine: {
    50: "#FAE9E7",
    100: "#FECCBC",
    200: "#FDAB90",
    300: "#FC8A64",
    400: "#FB7042",
    500: "#FB5821",
    600: "#F0521D",
    700: "#E24B18",
    800: "#D44415",
    900: "#BB370C",
  },
  blue: {
    50: "#DFF5FE",
    100: "#ADE6FD",
    200: "#73D5FC",
    300: "#21C4FB",
    400: "#00B8FC",
    500: "#00ABFB",
    600: "#009CEC",
    700: "#0089D8",
    800: "#0078C5",
    900: "#0058A3",
  },
  pink: {
    50: "#FFE5EB",
    100: "#FFBDCD",
    200: "#FF91AB",
    300: "#FF648A",
    400: "#FD4170",
    500: "#FB2158",
    600: "#EA1B56",
    700: "#D41453",
    800: "#C00A50",
    900: "#9D004C",
  },
  amber: {
    50: "#FFF7E0",
    100: "#FEEAB1",
    200: "#FDDC7F",
    300: "#FCD04B",
    400: "#FBC421",
    500: "#FABB00",
    600: "#FAAD00",
    700: "#FA9A00",
    800: "#FA8900",
    900: "#FA6900",
  },
  lime: {
    50: "#F8FFE8",
    100: "#EEFEC5",
    200: "#E1FE9C",
    300: "#D5FC71",
    400: "#CAFA4C",
    500: "#C4FB21",
    600: "#B9E715",
    700: "#AAD000",
    800: "#9DB800",
    900: "#869000",
  },
  green: {
    50: "#EAFFEA",
    100: "#CAFFCA",
    200: "#A2FFA6",
    300: "#6DFE7C",
    400: "#21FB58",
    500: "#00F72D",
    600: "#00E524",
    700: "#00CF17",
    800: "#00BA04",
    900: "#009400",
  },
  purple: {
    50: "#F3E8FF",
    100: "#DFC6FE",
    200: "#CA9FFE",
    300: "#B474FF",
    400: "#A14FFD",
    500: "#8E21FB",
    600: "#821AF4",
    700: "#7209EC",
    800: "#6300E6",
    900: "#4600E0",
  },
} as const;

export const ROUTER_VALUE = {
  MAIN: "/",
  MAP: "map", // 1 depth
  SEARCH: "search", // 1 depth

  MY_PAGE: "my-page", // 1 depth
  SETTING: "setting", // 2 depth
  MANAGE_ACCOUNT: "manage-account", // 3 depth

  LOGIN: "login", // 1 depth
  LOGIN_BY_EMAIL: "email", // 2 depth
  FORGET_PASSWORD: "forgot-password", // 2depth

  SIGN_UP: "sign-up", // 1 depth
  SIGN_UP_USER_INFO: "user-info", // 2 depth
  SIGN_UP_PET_INFO: "pet-info", // 2 depth
} as const;

export const ROUTER_PATH = {
  MAIN: "/",
  MAP: `/${ROUTER_VALUE.MAP}`,

  MY_PAGE: `/${ROUTER_VALUE.MY_PAGE}`,
  SETTING: `/${ROUTER_VALUE.MY_PAGE}/${ROUTER_VALUE.SETTING}`,
  ACCOUNT: `/${ROUTER_VALUE.MY_PAGE}/${ROUTER_VALUE.SETTING}/${ROUTER_VALUE.MANAGE_ACCOUNT}`,

  LOGIN: `/${ROUTER_VALUE.LOGIN}`,
  LOGIN_BY_EMAIL: `/${ROUTER_VALUE.LOGIN}/${ROUTER_VALUE.LOGIN_BY_EMAIL}`,
  FORGET_PASSWORD: `/${ROUTER_VALUE.LOGIN}/${ROUTER_VALUE.FORGET_PASSWORD}`,

  SIGN_UP: `/${ROUTER_VALUE.SIGN_UP}`,
  SIGN_UP_USER_INFO: `/${ROUTER_VALUE.SIGN_UP}/${ROUTER_VALUE.SIGN_UP_USER_INFO}`,
  SIGN_UP_PET_INFO: `/${ROUTER_VALUE.SIGN_UP}/${ROUTER_VALUE.SIGN_UP_PET_INFO}`,
} as const;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
