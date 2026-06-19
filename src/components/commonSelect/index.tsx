'use client';

import { OptionType } from '@/src/helpers/types';
import React from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import Select, {
  components,
  GroupBase,
  MultiValueGenericProps,
  Props as ReactSelectProps,
  StylesConfig,
} from 'react-select';

interface CommonSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TOption extends OptionType = OptionType,
  IsMulti extends boolean = false,
  Group extends GroupBase<TOption> = GroupBase<TOption>,
> extends Omit<
  ReactSelectProps<TOption, IsMulti, Group>,
  'name' | 'value' | 'onChange' | 'onBlur'
> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  containerClassName?: string;
  className?: string;
  customSelectContainer?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rules?: any;
  isClearable?: boolean;
  controlHeight?: number;
}

// just passes children through so text renders normally
function MultiValueLabel<
  TOption,
  IsMulti extends boolean,
  Group extends GroupBase<TOption>,
>(props: MultiValueGenericProps<TOption, IsMulti, Group>) {
  return (
    <components.MultiValueLabel {...props}>
      {props.children}
    </components.MultiValueLabel>
  );
}

export function CommonSelect<
  TFieldValues extends FieldValues = FieldValues,
  TOption extends OptionType = OptionType,
  IsMulti extends boolean = false,
  Group extends GroupBase<TOption> = GroupBase<TOption>,
>({
  control,
  name,
  label,
  helperText,
  containerClassName = 'w-full',
  customSelectContainer,
  className,
  styles: customStyles,
  components: customComponents,
  rules,
  isClearable = true,
  controlHeight = 48,
  instanceId,
  ...selectProps
}: CommonSelectProps<TFieldValues, TOption, IsMulti, Group>) {
  // const { t } = useTranslation(['common', 'auth']);
  const defaultStyles = <
    TOption extends OptionType,
    IsMulti extends boolean = false,
    Group extends GroupBase<TOption> = GroupBase<TOption>,
  >(): StylesConfig<TOption, IsMulti, Group> => ({
    container: (base) => ({
      ...base,
      width: '100%',
    }),

    control: (base, state) => ({
      ...base,
      minHeight: controlHeight,
      height: controlHeight,
      borderRadius: 4,
      paddingLeft: 8,
      borderColor: state.isFocused ? '#C7C9D9' : '#d4d7e3',
      boxShadow: 'none',
      backgroundColor: state.isDisabled ? '#f3f4f6' : '#F3F8FF',
      cursor: state.isDisabled ? 'not-allowed' : 'default',
      overflow: 'hidden',
      '&:hover': {
        borderColor: state.isDisabled ? '#d4d7e3' : '#C7C9D9',
      },
    }),

    input: (base, state) => ({
      ...base,
      margin: 0,
      padding: 0,
      paddingLeft: 0,
      color: state.isDisabled ? '#9ca3af' : '#0c1421',
      '& input': {
        opacity: '1 !important',
      },
    }),

    valueContainer: (base) => ({
      ...base,
      paddingLeft: 14,
      paddingRight: 14,
      height: controlHeight - 4,
      maxHeight: controlHeight - 4,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      overflowX: 'hidden',
      overflowY: 'hidden',
      flexWrap: 'nowrap',
      scrollbarWidth: 'thin',
      position: 'relative',
      '&::-webkit-scrollbar': {
        height: 6,
      },
      '&::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#CBD5E1',
        borderRadius: 9999,
      },
    }),

    placeholder: (base, state) => ({
      ...base,
      color: state.isDisabled ? '#9ca3af' : 'var(--color-placeholder-text)',
      fontSize: '0.875rem',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      position: 'absolute',
      left: 14,
      width: 'calc(100% - 32px)',
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
    }),

    singleValue: (base, state) => ({
      ...base,
      fontSize: 14,
      color: state.isDisabled ? '#9ca3af' : '#111827',
      margin: 0,
      padding: 0,
    }),

    indicatorsContainer: (base) => ({
      ...base,
      paddingRight: 8,
    }),

    dropdownIndicator: (base, state) => ({
      ...base,
      color: state.isDisabled ? '#9ca3af' : '#6B7280',
      padding: '0 8px',
      transition: 'transform 0.2s ease-in-out',
      transform: state.selectProps.menuIsOpen
        ? 'rotate(180deg)'
        : 'rotate(0deg)',
      '&:hover': {
        color: state.isDisabled ? '#9ca3af' : '#374151',
      },
    }),

    indicatorSeparator: () => ({
      display: 'none',
    }),

    menu: (base) => ({
      ...base,
      borderRadius: 8,
      border: '1px solid #d4d7e3',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      marginTop: 6,
      zIndex: 50,
    }),

    option: (base, { isSelected, isFocused }) => ({
      ...base,
      backgroundColor: isSelected
        ? '#1d2b50'
        : isFocused
          ? '#ddeafc'
          : 'transparent',
      color: isSelected ? '#ffffff' : '#111827',
      fontSize: 14,
      padding: 10,
      cursor: 'pointer',
    }),

    multiValue: (base) => ({
      ...base,
      backgroundColor: '#EEF2FF',
      borderRadius: 9999,
      paddingLeft: 10,
      paddingRight: 10,
    }),

    multiValueLabel: (base) => ({
      ...base,
      color: '#111827',
      fontSize: 13,
      fontWeight: 500,
      whiteSpace: 'normal', // text visible
    }),

    multiValueRemove: (base) => ({
      ...base,
      color: '#6B7280',
      '&:hover': {
        backgroundColor: 'transparent',
        color: '#374151',
      },
    }),
  });
  return (
    <div className={containerClassName}>
      {label && (
        <label
          htmlFor={String(name)}
          className="mt-3 md:mt-0 mb-2 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState: { error } }) => {
          const renderMessage = () => {
            if (error?.message) {
              return (
                <p className="mt-1 text-xs text-error">
                  {error.message}
                </p>
              );
            }
            if (helperText) {
              return (
                <p className="mt-1 text-xs text-secondary-text">{helperText}</p>
              );
            }
            return null;
          };

          const getMappedValue = () => {
            if (!field.value) return field.value;
            const options = selectProps.options as TOption[] | undefined;
            if (!options) return field.value;

            if (selectProps.isMulti) {
              if (Array.isArray(field.value)) {
                return field.value.map((val: TOption) => {
                  const opt = options.find((o) => o.value === val.value);
                  return opt || val;
                });
              }
              return field.value;
            } else {
              const opt = options.find(
                (o) => o.value === (field.value as TOption).value
              );
              return opt || field.value;
            }
          };

          return (
            <div
              className={`relative ${customSelectContainer ? customSelectContainer : ''}`}
            >
              <Select<TOption, IsMulti, Group>
                {...selectProps}
                {...field}
                // Stable, deterministic id across server & client renders.
                // Prevents react-select's internal counter (react-select-N-...)
                // from drifting between SSR and CSR and causing hydration
                // mismatches. Defaults to the field name if not provided.
                instanceId={instanceId ?? String(name)}
                inputId={String(name)}
                classNamePrefix="react-select"
                className={className}
                isClearable={isClearable}
                styles={{
                  ...defaultStyles<TOption, IsMulti, Group>(),
                  ...customStyles,
                  control: (base, state) => ({
                    ...defaultStyles<TOption, IsMulti, Group>().control?.(
                      base,
                      state
                    ),
                    ...(customStyles?.control?.(base, state) || {}),
                    ...(error
                      ? {
                          borderColor: '#d00416',
                          borderWidth: 1,
                          background: '#FEF2F2',
                        }
                      : {}),
                  }),
                  valueContainer: (base, state) => ({
                    ...defaultStyles<
                      TOption,
                      IsMulti,
                      Group
                    >().valueContainer?.(base, state),
                    ...(customStyles?.valueContainer?.(base, state) || {}),
                  }),
                }}
                components={{
                  MultiValueLabel,
                  ...(customComponents || {}),
                }}
                value={getMappedValue()}
                onChange={field.onChange}
                onBlur={field.onBlur}
                closeMenuOnSelect={
                  selectProps.closeMenuOnSelect !== undefined
                    ? selectProps.closeMenuOnSelect
                    : !selectProps.isMulti
                }
                blurInputOnSelect={!selectProps.isMulti}
              />
              {renderMessage()}
            </div>
          );
        }}
      />
    </div>
  );
}

CommonSelect.displayName = 'CommonSelect';