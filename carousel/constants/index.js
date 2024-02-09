import { Dimensions } from "react-native";

import { isWeb } from "../utils";

export const HEADER_HEIGHT = 100;

export const ElementsText = {
    AUTOPLAY: "AutoPlay",
};

export const window = isWeb
  ? {
      ...Dimensions.get("window"),
      width: 700
    }
  : Dimensions.get("window")