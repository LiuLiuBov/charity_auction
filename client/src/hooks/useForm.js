import { useState } from 'react';
import isEmail from 'validator/lib/isEmail';

export const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const validate = () => {
    let tempErrors = {...errors};
    if ('name' in values)
      tempErrors.name = values.name ? '' : 'Name cannot be empty.';

    if ('email' in values)
      tempErrors.email = isEmail(values.email) ? '' : 'Enter a valid email address.';

    if ('password' in values) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
      tempErrors.password = passwordRegex.test(values.password) ? '' : 'Password must be at least 8 characters long, contain a number and an uppercase letter.';
    }

    if ('repeatPassword' in values)
      tempErrors.repeatPassword = values.password === values.repeatPassword ? '' : 'Passwords do not match.';

    setErrors({
      ...tempErrors
    });

    return Object.values(tempErrors).every(x => x === "");
  };

  return {
    handleChange,
    values,
    validate,
    errors,
  };
};
