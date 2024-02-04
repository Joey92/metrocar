import { throttle } from "lodash";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Props as SelectProps, SingleValue } from "react-select";
import AsyncSelect from "react-select/async";
import { CoordinateSelectValue } from "../types/types";
import { handleAutocomplete } from "../util/form";

interface Props {
  location?: GeolocationPosition;
  placeholder: string;
  onChange: SelectProps<CoordinateSelectValue, false>["onChange"];
  value: SingleValue<CoordinateSelectValue>;
}

const GeolocationAsyncSelect = ({
  location,
  onChange,
  value,
  placeholder,
}: Props) => {
  const { t } = useTranslation();
  const translateOptions = (v: CoordinateSelectValue) => {
    if (v.label && v.label.startsWith("translate.")) {
      return {
        label: t(`pages:search.${v.label.replace("translate.", "")}`),
        value: v.value,
      };
    }

    return v;
  };

  const loadOptions = useMemo(
    () =>
      throttle(handleAutocomplete(location), 500, {
        trailing: true,
        leading: true,
      }),
    [location]
  );

  return (
    <AsyncSelect
      placeholder={placeholder}
      value={value ? translateOptions(value) : value}
      onChange={onChange}
      loadOptions={loadOptions}
    />
  );
};

export default GeolocationAsyncSelect;
