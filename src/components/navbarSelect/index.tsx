'use client';

import React from 'react';
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
} from 'react-hook-form';
import Select, {
  GroupBase,
  Props as ReactSelectProps,
  StylesConfig,
} from 'react-select';

export interface NavbarSelectOption {
  label: string;
  value: string;
}

interface NavbarSelectProps<
  TFieldValues extends FieldValues,
  TOption extends NavbarSelectOption = NavbarSelectOption,
  IsMulti extends boolean = false,
  Group extends GroupBase<TOption> = GroupBase<TOption>,
> extends Omit<
    ReactSelectProps<TOption, IsMulti, Group>,
    'name' | 'value' | 'onChange' | 'onBlur'
  > {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
}

export function NavbarSelect<
  TFieldValues extends FieldValues,
  TOption extends NavbarSelectOption = NavbarSelectOption,
  IsMulti extends boolean = false,
  Group extends GroupBase<TOption> = GroupBase<TOption>,
>({
  control,
  name,
  instanceId,
  ...selectProps
}: NavbarSelectProps<
  TFieldValues,
  TOption,
  IsMulti,
  Group
>) {
  const styles: StylesConfig<
  TOption,
  IsMulti,
  Group
> = {
  container: (base) => ({
    ...base,
    minWidth: 260,
  }),

  control: (base, state) => ({
    ...base,
    minHeight: 44,
    borderRadius: 9999,
    background: 'rgba(243,248,255,0.8)',
    backdropFilter: 'blur(12px)',
    border: state.isFocused
      ? '1px solid #C7C9D9'
      : '1px solid rgba(199,201,217,0.6)',
    boxShadow: state.isFocused
      ? '0 0 0 4px rgba(59,130,246,0.08)'
      : '0 4px 20px rgba(0,0,0,0.04)',
    transition: 'all 0.25s ease',
    cursor: 'pointer',

    '&:hover': {
      borderColor: '#C7C9D9',
      transform: 'translateY(-1px)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    },
  }),

  valueContainer: (base) => ({
    ...base,
    paddingLeft: 16,
    paddingRight: 12,
  }),

  singleValue: (base) => ({
    ...base,
    color: '#1d2b50',
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '0.2px',
  }),

  placeholder: (base) => ({
    ...base,
    color: '#64748B',
    fontSize: '14px',
    fontWeight: 500,
  }),

  dropdownIndicator: (base, state) => ({
    ...base,
    color: '#1d2b50',
    transition: 'all 0.25s ease',
    transform: state.selectProps.menuIsOpen
      ? 'rotate(180deg)'
      : 'rotate(0deg)',

    '&:hover': {
      color: '#2563EB',
    },
  }),

  indicatorSeparator: () => ({
    display: 'none',
  }),

  menu: (base) => ({
    ...base,
    marginTop: 10,
    borderRadius: 18,
    overflow: 'hidden',
    border: '1px solid #E2E8F0',
    background: '#FFFFFF',
    boxShadow:
      '0px 20px 40px rgba(15,23,42,0.12)',
    animation: 'fadeIn 0.2s ease',
    zIndex: 9999,
  }),

  menuList: (base) => ({
    ...base,
    padding: 8,
  }),

  option: (base, state) => ({
    ...base,
    padding: '12px 16px',
    borderRadius: 12,
    marginBottom: 4,
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: state.isSelected ? 600 : 500,

    backgroundColor: state.isSelected
      ? '#1d2b50'
      : state.isFocused
        ? '#ddeafc'
        : 'transparent',

    color: state.isSelected
      ? '#FFFFFF'
      : '#0F172A',

    transition: 'all 0.2s ease',

    ':active': {
      backgroundColor: '#ddeafc',
    },
  }),
};

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select<TOption, IsMulti, Group>
          {...selectProps}
          {...field}
          instanceId={
            instanceId ?? `navbar-${String(name)}`
          }
          inputId={`navbar-${String(name)}`}
          classNamePrefix="navbar-select"
          styles={styles}
          isSearchable={false}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
        />
      )}
    />
  );
}

export default NavbarSelect;