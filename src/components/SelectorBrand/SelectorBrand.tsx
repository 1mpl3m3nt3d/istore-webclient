import 'reflect-metadata';

import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { observer } from 'mobx-react';
import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Brand } from 'models';

interface Properties {
  label: string;
  items: Brand[];
  selectedBrandId: number;
  minWidth?: number;
  onChange?: (id: number) => void;
}

const SelectorBrand = observer(
  ({ label, items, selectedBrandId, onChange, minWidth = 150 }: Properties): ReactElement => {
    const navigate = useNavigate();
    const { t } = useTranslation(['products']);

    const defaultValue = selectedBrandId === 0 ? '' : selectedBrandId.toString();
    const [value, setValue] = useState<string>(defaultValue);

    const handleChange = (event: SelectChangeEvent): void => {
      const newValue = event.target.value;
      const newValueNumber = Number.parseInt(newValue);

      setValue(newValue as string);

      if (onChange !== undefined) onChange(newValue === '' ? 0 : newValueNumber);

      const urlParameters = new URLSearchParams(window.location.search);

      urlParameters.delete('page');

      if (newValueNumber !== 0) {
        urlParameters.set('brand', newValue);
      } else {
        urlParameters.delete('brand');
      }

      navigate('?' + urlParameters.toString(), { replace: false, preventScrollReset: true });
    };

    return (
      <Box sx={{ minWidth: { minWidth } }}>
        <FormControl fullWidth>
          <InputLabel>{label}</InputLabel>
          <Select id="brand-selector" value={value} label={label} onChange={handleChange}>
            <MenuItem key={0} value={0}>
              <em>{t('selectors.all')}</em>
            </MenuItem>
            {items &&
              items?.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.brand}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>
    );
  }
);

export default SelectorBrand;
