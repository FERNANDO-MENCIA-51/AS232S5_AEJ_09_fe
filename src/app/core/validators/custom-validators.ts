import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Custom validator for minimum text length
 * @param min Minimum number of characters required
 * @returns Validator function
 */
export function minLengthValidator(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null; // Don't validate empty values to allow optional controls
        }

        const value = control.value.toString().trim();

        if (value.length < min) {
            return {
                minLength: {
                    requiredLength: min,
                    actualLength: value.length
                }
            };
        }

        return null;
    };
}

/**
 * Custom validator for date range
 * @param min Minimum date in YYYY-MM-DD format
 * @param max Maximum date in YYYY-MM-DD format
 * @returns Validator function
 */
export function dateRangeValidator(min: string, max: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null; // Don't validate empty values to allow optional controls
        }

        const value = control.value;
        const minDate = new Date(min);
        const maxDate = new Date(max);
        const inputDate = new Date(value);

        if (inputDate < minDate) {
            return {
                dateRange: {
                    min: min,
                    max: max,
                    actual: value,
                    message: `La fecha debe ser posterior o igual a ${min}`
                }
            };
        }

        if (inputDate > maxDate) {
            return {
                dateRange: {
                    min: min,
                    max: max,
                    actual: value,
                    message: `La fecha debe ser anterior o igual a ${max}`
                }
            };
        }

        return null;
    };
}

/**
 * Custom validator to ensure date is not in the future
 * @returns Validator function
 */
export function notFutureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null; // Don't validate empty values to allow optional controls
        }

        const value = control.value;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day

        const inputDate = new Date(value);
        inputDate.setHours(0, 0, 0, 0); // Reset time to start of day

        if (inputDate > today) {
            return {
                futureDate: {
                    actual: value,
                    message: 'La fecha no puede ser futura'
                }
            };
        }

        return null;
    };
}
