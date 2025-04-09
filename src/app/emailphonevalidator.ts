import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function phoneOrEmailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null; // don't validate empty value
    }

    // Define regex patterns for email and phone number
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phonePattern = /^[0-9]{10}$/;

    const isValidEmail = emailPattern.test(value);
    const isValidPhone = phonePattern.test(value);

    if (!isValidEmail && !isValidPhone) {
      return { phoneOrEmail: true };
    }
    return null;
  };
}
