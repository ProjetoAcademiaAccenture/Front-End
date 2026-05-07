import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { StyledInput, InputWrapper, ToggleButton, StyledTextArea } from "./input.styles";

export function Input({
  isPassword = false,
  isTextArea = false,
  hasError = false,
  className = "",
  rows = 4,
  maxLength,
  value,
  onChange,
  onLengthChange,
  ...props
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof value === "string") {
      onLengthChange?.(value.length);
    }
  }, [value, onLengthChange]);

  const handleChange = (e) => {
    const newLen = e.target.value.length;
    onLengthChange?.(newLen);
    onChange?.(e);
  };

  return (
    <InputWrapper className={className} $hasError={!!hasError}>
      {isTextArea ? (
        <StyledTextArea
          rows={rows}
          maxLength={maxLength}
          {...props}
          value={value ?? ""}
          onChange={handleChange}
        />
      ) : (
        <StyledInput
          {...props}
          type={isPassword && !show ? "password" : "text"}
          maxLength={maxLength}
          value={value ?? ""}
          onChange={handleChange}
        />
      )}

      {isPassword && !isTextArea && (
        <ToggleButton
          type="button"
          onClick={() => setShow(!show)}
        >
          {show ? "🙈" : "👁️"}
        </ToggleButton>
      )}
    </InputWrapper>
  );
}

Input.propTypes = {
  isPassword: PropTypes.bool,
  isTextArea: PropTypes.bool,
  hasError: PropTypes.bool,
  className: PropTypes.string,
  rows: PropTypes.number,
  maxLength: PropTypes.number,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onLengthChange: PropTypes.func,
};
