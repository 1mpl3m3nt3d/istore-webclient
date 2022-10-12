import 'reflect-metadata';

import {
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react';
import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { IoCTypes } from 'ioc';
import { Brand } from 'models';
import { ProductsStore } from 'stores';

interface Properties {
  label: string;
  items: Brand[];
  selectedBrandId: number[];
  minWidth?: number;
  onChange?: (brands: number[]) => void;
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

const SelectorBrand = observer(
  ({ label, items, selectedBrandId, onChange, minWidth = 150 }: Properties): ReactElement => {
    const store = useInjection<ProductsStore>(IoCTypes.productsStore);
    const navigate = useNavigate();
    const { t } = useTranslation(['products']);

    const defaultValue = selectedBrandId ? selectedBrandId.map(String) : [];
    const [brandsValue, setBrandsValue] = useState<string[]>(defaultValue);

    const handleChange = (event: SelectChangeEvent<typeof brandsValue>): void => {
      const {
        target: { value },
      } = event;

      if (value.includes(RESET_INDEX.toString())) {
        setBrandsValue([]);

        const urlParameters = new URLSearchParams(window.location.search);

        urlParameters.delete('page');
        urlParameters.delete('brands');

        navigate('?' + urlParameters.toString(), { replace: false, preventScrollReset: true });

        store.changeBrandIds([]);

        return;
      }

      const newValue = typeof value === 'string' ? value.split(',') : value;

      setBrandsValue(newValue); // on autofill we get a stringified value

      const parsedValue = newValue ? newValue.map(Number) : [];

      if (onChange !== undefined) onChange(parsedValue);

      const urlParameters = new URLSearchParams(window.location.search);

      urlParameters.delete('page');

      if (newValue.length > 0) {
        urlParameters.set('brands', newValue.toString());
      } else {
        urlParameters.delete('brands');
      }

      store.changeBrandIds(parsedValue);

      navigate('?' + urlParameters.toString(), { replace: false, preventScrollReset: true });
    };

    return (
      <Box sx={{ minWidth: { minWidth } }}>
        <FormControl fullWidth>
          <InputLabel>{label}</InputLabel>
          <Select
            multiple
            id="brand-selector"
            value={brandsValue}
            label={label}
            onChange={handleChange}
            input={<OutlinedInput label={label} />}
            renderValue={(selected): string => {
              return t('selectors.selected_brands', { count: selected.length });
            }}
            MenuProps={MenuProps}
          >
            <MenuItem key={RESET_INDEX.toString()} value={RESET_INDEX.toString()}>
              <em>
                <ListItemText primary={t('selectors.all')} />
              </em>
            </MenuItem>
            {items &&
              items?.map((item) => (
                <MenuItem key={item.id.toString()} value={item.id.toString()}>
                  <Checkbox checked={brandsValue?.includes(item.id.toString())} />
                  <ListItemText primary={item.brand} />
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>
    );
  }
);

export default SelectorBrand;
