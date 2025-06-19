import { Calendar } from "primereact/calendar";
import { Controller, useFormContext } from "react-hook-form";
import { inputValidator } from "../../../../library/utilities/helperFunction";
import { IFormFieldType } from "../../../../library/utilities/constant";
import { IFormProps } from "../formInterface/forms.model";
import { FormFieldError } from "../formFieldError/FormFieldError";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

const DateTime = (props: IFormProps) => {
  const {
    attribute,
    form,
    appendTo,
    fieldType,
    showAdjustButtons,
    handleChange,
  } = props;
  const { isShowAdjustButtons = false, isButtonInside = true } =
    showAdjustButtons || {};
  const { label, minDate, maxDate, placeholder } = form[attribute];
  const {
    required,
    showTime = true,
    disabled,
    showIcon = true,
    dateView,
  } = form[attribute].rules;
  const { view = "date", format = "yy-mm-dd" } = dateView || {};
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation();
  const defaultPlaceHolder: string = t("components.multiSelect.placeholder");
  const minDateValue = minDate ? new Date(Number(minDate)) : undefined;
  const maxDateValue = maxDate ? new Date(Number(maxDate)) : undefined;

  // Function to convert timestamp to date
  const timestampToDate = (timestamp: any) => {
    return timestamp ? new Date(Number(timestamp)) : null;
  };

  const { labelClassName, fieldClassName, divClassName } = useMemo(() => {
    switch (fieldType) {
      case IFormFieldType.NO_LABEL:
      case IFormFieldType.TOP_LABEL:
        return {
          labelClassName: "",
          fieldClassName: "field p-fluid",
          divClassName: "",
        };
      default:
        return {
          labelClassName: "col-12 mb-3 md:col-3 md:mb-0",
          fieldClassName: "field grid",
          divClassName: "col-12 md:col-9 relative",
        };
    }
  }, [fieldType]);

  const labelElement = (
    <label htmlFor={attribute} className={labelClassName}>
      <span className="capitalize-first">
        {label} {required && "*"}
      </span>
    </label>
  );
  const types = [
    { label: "D", type: "day" as const },
    { label: "V", type: "week" as const },
  ];
  return (
    <div className={fieldClassName}>
      {fieldType !== IFormFieldType.NO_LABEL && labelElement}
      <div className={divClassName}>
        <div className={"flex  p-inputgroup"}>
          <Controller
            name={attribute}
            control={control}
            rules={inputValidator(form[attribute].rules, label)}
            render={({ field }) => {
              const adjustDate = (amount: number) => {
                const newDate = timestampToDate(field.value);
                if (!newDate) return;
                newDate.setDate(newDate.getDate() + amount);
                field.onChange(newDate.getTime().toString());
              };
              return (
                <div className="p-inputgroup relative">
                  <Calendar
                    className={`w-full ${errors[attribute] ? "p-invalid" : ""}`}
                    showTime={showTime}
                    hourFormat="12"
                    id={field.name}
                    value={timestampToDate(field.value)}
                    onChange={(e) => {
                      const timeStamp = e.value
                        ? new Date(Number(e.value)).getTime().toString()
                        : null;
                      field.onChange(timeStamp);
                      handleChange?.(e);
                    }}
                    dateFormat={format}
                    showIcon={showIcon}
                    placeholder={placeholder || defaultPlaceHolder}
                    minDate={minDateValue}
                    maxDate={maxDateValue}
                    appendTo={appendTo}
                    disabled={disabled}
                    view={view}
                  />
                  {isShowAdjustButtons &&
                    types.map(({ label, type }) => (
                      <span
                        key={type}
                        className={`align-items-center flex justify-content-center border-round-2xl bg-red-400 border-transparent h-full ${
                          isButtonInside ? "absolute" : ``
                        }`}
                        style={{
                          ...(isButtonInside
                            ? {
                                right: type === "day" ? "4.9rem" : "2.1rem",
                                zIndex: 1,
                                width: "2.7rem",
                              }
                            : { width: "60px" }),
                        }}
                      >
                        <i
                          className="pi pi-minus text-white cursor-pointer"
                          onClick={() => adjustDate(type === "week" ? -7 : -1)}
                          style={{ fontSize: "7px" }}
                        />
                        <span
                          className="text-white"
                          style={{ fontSize: "11px" }}
                        >
                          &nbsp;{label}&nbsp;
                        </span>
                        <i
                          className="pi pi-plus text-white cursor-pointer"
                          onClick={() => adjustDate(type === "week" ? 7 : 1)}
                          style={{ fontSize: "7px" }}
                        />
                      </span>
                    ))}
                </div>
              );
            }}
          />
          <FormFieldError data={{ errors: errors, name: attribute }} />
        </div>
      </div>
    </div>
  );
};

export default DateTime;
