import { useLingui } from "@lingui/react";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

import { changeLanguage, LANGUAGES } from "~/lib/i18n";

export const ChangeLanguage = () => {
  const { i18n } = useLingui();

  return (
    <FormControl>
      <RadioGroup value={i18n.locale}>
        {LANGUAGES.map((option) => (
          <FormControlLabel
            label={option.label}
            value={option.value}
            onChange={() => changeLanguage(option.value)}
            control={<Radio />}
            key={option.value}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
