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

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  const validate = () => {
    let tempErrors = {...errors};
    if ('username' in values)
      tempErrors.username = values.username ? '' : 'Name cannot be empty.';

    if ('email' in values)
      tempErrors.email = isEmail(values.email) ? '' : 'Enter a valid email address.';

    if ('password' in values) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
      tempErrors.password = passwordRegex.test(values.password) ? '' : 'Password must be at least 8 characters long, contain a number and an uppercase letter.';
    }

    if ('repeatPassword' in values)
      tempErrors.repeatPassword = values.password === values.repeatPassword ? '' : 'Passwords do not match.';

    if ('title' in values)
      tempErrors.title = values.title.length >= 5 ? '' : 'Title must be at least 5 characters long.';

    if ('description' in values)
      tempErrors.description = values.description.length >= 10 ? '' : 'Description must be at least 10 characters long.';

    if ('starting_bid' in values)
      tempErrors.starting_bid = values.starting_bid > 0 ? '' : 'Starting bid must be greater than 0.';

    setErrors({
      ...tempErrors
    });

    return Object.values(tempErrors).every(x => x === "");
  };

  return {
    handleChange,
    values,
    setValues,
    validate,
    errors,
    setErrors,
    reset,
  };
};
