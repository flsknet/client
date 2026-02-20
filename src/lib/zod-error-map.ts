import { t } from "@lingui/core/macro";
import { z } from "zod";

z.setErrorMap((iss) => {
  switch (iss.code) {
    case "too_small":
      if (iss.minimum == 1) {
        return {
          message: t`Required.`,
        };
      }

      return {
        message: t`Too short. Must contain more than ${iss.minimum.toString()} characters.`,
      };

    case "too_big":
      return {
        message: t`Too long. Must contain less than ${iss.maximum.toString()} characters.`,
      };

    case "invalid_string": {
      if (iss.validation == "email") {
        return {
          message: t`This email is invalid.`,
        };
      }
    }
  }

  return {
    message: t`An error occured.`,
  };
});
