
import styled from "styled-components";

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;

  &:focus-within {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
  }
  
  ${({ $hasError }) =>
    $hasError &&
    `
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220,38,38,0.3);
  `}
`;

export const StyledInput = styled.input`
  flex: 1;
  width: 100%;
  padding: 0.75rem 0.5rem;
  font-size: 1rem;
  color: #1f2937;
  background-color: #ffffff;
  border: none;
  outline: none;
  border-radius: 0.44rem;

  &::placeholder {
    color: #9ca3af;
  }
`;
export const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: none;
  font-size: 1rem;
  outline: none;
  resize: vertical;
  color: #1f2937;
  background-color: #ffffff;

  &::placeholder {
    color: #9ca3af;
  }
`;


export const ToggleButton = styled.button`
  padding: 0.25rem;
  background: transparent;
  color: #6b7280;
  border: none;
  cursor: pointer;
  padding-right: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;

  &:hover {
    color: #2563eb;
    opacity: 0.8;
  }
`;

export const ErrorMessage = styled.span`
  display: block;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #dc2626;
`;
