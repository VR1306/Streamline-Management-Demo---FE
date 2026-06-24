'use client';

import React, { ForwardedRef, forwardRef, useState } from 'react';
import {
    Controller,
    FieldError,
    FieldPath,
    FieldValues,
    RegisterOptions,
    useFormContext,
    useWatch,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Image from 'next/image';
import { Images } from '@/src/images';

type InputProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
    name: TName;
    label?: string;
    placeholder?: string;
    className?: string;
    containerClassName?: string;
    disabled?: boolean;
    required?: boolean;
    customInputContainer?: string;
    helperText?: React.ReactNode;
    type?: React.HTMLInputTypeAttribute;
    isIcon?: boolean;
    icon?: React.ReactNode;
    isCustomBorder?: string;
    isCustomPlaceHolderStyle?: string;
    isClear?: boolean;
    onClear?: () => void;
    hideError?: boolean;

    // ✅ Added rules support
    rules?: RegisterOptions<TFieldValues, TName>;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'defaultValue'>;

const ControlledInput = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
    {
        name,
        label,
        placeholder = '',
        className = '',
        containerClassName = '',
        disabled = false,
        required = false,
        customInputContainer = 'w-full',
        isCustomBorder = '',
        isCustomPlaceHolderStyle = '',
        type = 'text',
        helperText,
        isIcon = false,
        icon,
        isClear = false,
        onClear,
        hideError = false,
        rules, // ✅ destructured here
        ...inputProps
    }: InputProps<TFieldValues, TName>,
    ref: ForwardedRef<HTMLInputElement>
) => {
    const { control } = useFormContext<TFieldValues>();
    const [showPassword, setShowPassword] = useState(false);
    const { t } = useTranslation(['common', 'auth']);

    const searchWatchValue = useWatch({
        control,
        name,
    });

    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    const hasRightAction = isPassword || isClear;
    const paddingStyles = hasRightAction ? 'pl-4 pr-12' : 'px-4';

    const baseInputStyles = `w-full ${paddingStyles} py-3 rounded-4 bg-[#F3F8FF] text-primary-text transition-colors focus:outline-none text-gray-900`;

    const combinedInputClassName = `
    ${baseInputStyles}
    ${className}
  `
        .trim()
        .replace(/\s+/g, ' ');

    const getNameClasses = (error: FieldError | undefined) => {
        if (error) {
            return 'border border-error bg-red-50 global-error-focus';
        }
        if (isCustomBorder) {
            return isCustomBorder;
        }
        return 'border border-secondary global-input-focus';
    };

    // ✅ Merge required prop into rules automatically
    const mergedRules: RegisterOptions<TFieldValues, TName> = {
        ...rules,
        ...(required && !rules?.required
            ? { required: 'This field is required' }
            : {}),
    };

    return (
        <div className={`${containerClassName}`}>
            {label && (
                <label
                    htmlFor={name}
                    className="mb-2 block text-sm font-medium text-primary-text mt-3 sm:mt-0"
                >
                    {label}
                    {required && <span className="text-error ml-1">*</span>}
                </label>
            )}

            <Controller<TFieldValues, TName>
                name={name}
                control={control}
                rules={mergedRules} // ✅ applied here
                render={({ field, fieldState: { error } }) => (
                    <div
                        className={`${customInputContainer ? customInputContainer : 'min-h-[4.5rem]'} relative`}
                    >
                        <input
                            {...field}
                            ref={ref}
                            id={name}
                            type={inputType}
                            placeholder={placeholder}
                            disabled={disabled}
                            className={`
  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
  ${combinedInputClassName}
  ${!searchWatchValue ? 'is-empty' : ''}
  placeholder:text-sm placeholder:${isCustomPlaceHolderStyle || 'text-placeholder-text'
                                }
  ${getNameClasses(error)}
`.trim()}
                            {...inputProps}
                            onKeyDown={(e) => {
                                if (type === 'number') {
                                    if (
                                        e.key === '-' ||
                                        e.key === 'e' ||
                                        e.key === 'E' ||
                                        e.key === '+'
                                    ) {
                                        e.preventDefault();
                                    }
                                }
                                if (inputProps.onKeyDown) {
                                    inputProps.onKeyDown(e);
                                }
                            }}
                            onPaste={(e) => {
                                if (type === 'number') {
                                    const pastedData = e.clipboardData.getData('text');
                                    if (
                                        pastedData.includes('-') ||
                                        pastedData.includes('e') ||
                                        pastedData.includes('E') ||
                                        pastedData.includes('+')
                                    ) {
                                        e.preventDefault();
                                    }
                                }
                                if (inputProps.onPaste) {
                                    inputProps.onPaste(e);
                                }
                            }}
                        />

                        {type === 'date' && placeholder && !searchWatchValue && (
                            <span className="custom-date-placeholder absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-placeholder-text text-sm select-none">
                                {placeholder}
                            </span>
                        )}

                        {isIcon && icon}

                        {isPassword && (
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-6.5 -translate-y-1/2 text-primary hover:opacity-70 transition-opacity cursor-pointer"
                                aria-label={!showPassword ? 'Hide password' : 'Show password'}
                                tabIndex={-1}
                            >
                                {!showPassword ? (
                                    <FiEyeOff className="w-5 h-5" />
                                ) : (
                                    <FiEye className="w-5 h-5" />
                                )}
                            </button>
                        )}

                        {isClear && searchWatchValue && (
                            <button
                                type="button"
                                onClick={onClear}
                                className="absolute right-4 top-5.5 -translate-y-1/2 hover:opacity-70 transition-opacity cursor-pointer"
                                aria-label="Clear input"
                                tabIndex={-1}
                            >
                                <Image
                                    src={Images.close}
                                    alt="clear"
                                    width={16}
                                    height={16}
                                />
                            </button>
                        )}

                        {error && !hideError ? (
                            <p className="mt-1 text-xs text-error" role="alert">
                                {t(error.message as string, {
                                    defaultValue: error.message as string,
                                })}
                            </p>
                        ) : (
                            helperText
                        )}
                    </div>
                )}
            />
        </div>
    );
};

const ControlledInputForwarded = forwardRef(
    ControlledInput
) as unknown as React.ForwardRefExoticComponent<
    InputProps & React.RefAttributes<HTMLInputElement>
>;

ControlledInputForwarded.displayName = 'ControlledInput';

export { ControlledInputForwarded as ControlledInput };
