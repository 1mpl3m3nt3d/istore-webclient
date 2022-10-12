import 'reflect-metadata';

import { Box, Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react';
import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { IoCTypes } from 'ioc';
import { Type } from 'models';
import { ProductsStore } from 'stores';

interface Properties {
  label: string;
  items: Type[];
  selectedTypeId: number[];
  minWidth?: number;
  onChange?: (types: number[]) => void;
}

const RESET_INDEX = -1;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const SelectorType = observer(
  ({ label, items, selectedTypeId, onChange, minWidth = 150 }: Properties): ReactElement => {
    const store = useInjection<ProductsStore>(IoCTypes.productsStore);
    const navigate = useNavigate();
    const { t } = useTranslation(['products']);

    const defaultValue = selectedTypeId ? selectedTypeId.map(String) : [];
    const [typesValue, setTypesValue] = useState<string[]>(defaultValue);

    const handleChange = (event: SelectChangeEvent<typeof typesValue>): void => {
      const {
        target: { value },
      } = event;

      if (value.includes(RESET_INDEX.toString())) {
        setTypesValue([]);

        const urlParameters = new URLSearchParams(window.location.search);

        urlParameters.delete('page');
        urlParameters.delete('types');

        navigate('?' + urlParameters.toString(), { replace: false, preventScrollReset: true });

        store.changeTypeIds([]);

        return;
      }

      const newValue = typeof value === 'string' ? value.split(',') : value;

      setTypesValue(newValue); // on autofill we get a stringified value

      const parsedValue = newValue ? newValue.map(Number) : [];

      if (onChange !== undefined) onChange(parsedValue);

      const urlParameters = new URLSearchParams(window.location.search);

      urlParameters.delete('page');

      if (newValue.length > 0) {
        urlParameters.set('types', newValue.toString());
      } else {
        urlParameters.delete('types');
      }

      store.changeTypeIds(parsedValue);

      navigate('?' + urlParameters.toString(), { replace: false, preventScrollReset: true });
    };

    return (
      <Box sx={{ minWidth: { minWidth } }}>
        <FormControl fullWidth>
          <InputLabel>{label}</InputLabel>
          <Select
            multiple
            id="type-selector"
            value={typesValue}
            label={label}
            onChange={handleChange}
            input={<OutlinedInput label={label} />}
            renderValue={(selected): string => {
              return t('selectors.selected_types', { count: selected.length });
            }}
            MenuProps={MenuProps}
          >
            <MenuItem key={RESET_INDEX.toString()} value={RESET_INDEX.toString()}>
              <em>{t('selectors.all')}</em>
            </MenuItem>
            {items &&
              items?.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  <Checkbox checked={typesValue?.includes(item.id.toString())} />
                  <ListItemText primary={item.type} />
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>
    );
  }
);

export default SelectorType;
