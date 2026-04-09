import { Field } from "@chakra-ui/react";

const FieldForm = ({ label, error, children }) => {
  return (
    <Field.Root invalid={!!error}>
      <Field.Label color="text.secondary" fontWeight="medium" mb={1}>
        {label}
      </Field.Label>
      {children}
      {error && (
        <Field.ErrorText color="red.400" fontSize="xs" mt={1}>
          {error.message}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default FieldForm;
