import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react/macro";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  useColorScheme,
} from "@mui/material";

const THEME_OPTIONS = [
  {
    label: msg`System`,
    value: "system",
  },
  {
    label: msg`Dark`,
    value: "dark",
  },
  {
    label: msg`Light`,
    value: "light",
  },
] as const;

export const ChangeTheme = () => {
  const { mode, setMode } = useColorScheme();
  const { t } = useLingui();

  return (
    <FormControl>
      <RadioGroup value={mode}>
        {THEME_OPTIONS.map((option) => (
          <FormControlLabel
            label={t(option.label)}
            value={option.value}
            onChange={() => setMode(option.value)}
            control={<Radio />}
            key={option.value}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
