import { Calendar } from "primereact/calendar";
import { Controller, useFormContext } from "react-hook-form";
import { inputValidator } from "../../../../library/utilities/helperFunction";
import { IFormFieldType } from "../../../../library/utilities/constant";
import { IFormProps } from "../formInterface/forms.model";
import { FormFieldError } from "../formFieldError/FormFieldError";

const DateTime = (props: IFormProps) => {
  const { attribute, form, appendTo, fieldType } = props;
  const { label, minDate, maxDate, placeholder } = form[attribute];
  const { required, showTime = true, disabled } = form[attribute].rules;
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const minDateValue = minDate ? new Date(Number(minDate)) : undefined;
  const maxDateValue = maxDate ? new Date(Number(maxDate)) : undefined;

  // Function to convert timestamp to date
  const timestampToDate = (timestamp: any) => {
    return timestamp ? new Date(Number(timestamp)) : null;
  };

  const getClassNames = () => {
    let labelClassName = "";
    let fieldClassName = "";
    let divClassName = "";

    switch (fieldType) {
      case IFormFieldType.NO_LABEL:
        labelClassName = "";
        fieldClassName = "field p-fluid";
        divClassName = "";
        break;
      case IFormFieldType.TOP_LABEL:
        labelClassName = "";
        fieldClassName = "field p-fluid";
        divClassName = "";
        break;
      default:
        labelClassName = "col-12 mb-3 md:col-3 md:mb-0";
        fieldClassName = "field grid";
        divClassName = "col-12 md:col-9 relative";
        break;
    }

    return { labelClassName, fieldClassName, divClassName };
  };
  const { labelClassName, fieldClassName, divClassName } = getClassNames();

  const labelElement = (
    <label htmlFor={attribute} className={labelClassName}>
      {label} {required && "*"}
    </label>
  );
  return (
    <div className={fieldClassName}>
      {fieldType !== IFormFieldType.NO_LABEL && labelElement}
      <div className={divClassName}>
        <Controller
          name={attribute}
          control={control}
          rules={inputValidator(form[attribute].rules, label)}
          render={({ field }) => {
            return (
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
                }}
                dateFormat="yy-mm-dd"
                showIcon
                placeholder={placeholder}
                minDate={minDateValue}
                maxDate={maxDateValue}
                appendTo={appendTo}
                disabled={disabled}
              />
            );
          }}
        />
        <FormFieldError data={{ errors: errors, name: attribute }} />
      </div>
    </div>
  );
};

export default DateTime;
