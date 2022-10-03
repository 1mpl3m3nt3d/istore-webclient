import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { observer } from 'mobx-react';
import { Type } from 'models';
import { ReactElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Properties {
  label: string;
  items: Type[];
  selectedTypeId: number;
  minWidth?: number;
  onChange?: (id: number) => void;
}

const SelectorType = observer(
  ({ label, items, selectedTypeId, onChange, minWidth = 150 }: Properties): ReactElement => {
    const navigate = useNavigate();

    const defaultValue = selectedTypeId === 0 ? '' : selectedTypeId.toString();
    const [value, setValue] = useState<string>(defaultValue);

    const handleChange = (event: SelectChangeEvent): void => {
      const newValue = event.target.value;
      const newValueNumber = Number.parseInt(newValue);

      setValue(newValue as string);

      if (onChange !== undefined) onChange(newValue === '' ? 0 : newValueNumber);

      const urlParameters = new URLSearchParams(window.location.search);

      urlParameters.delete('page');

      if (newValueNumber !== 0) {
        urlParameters.set('type', newValue);
      } else {
        urlParameters.delete('type');
      }

      navigate('?' + urlParameters.toString(), { replace: false, preventScrollReset: true });
    };

    return (
      <Box sx={{ minWidth: { minWidth } }}>
        <FormControl fullWidth>
          <InputLabel>{label}</InputLabel>
          <Select id="type-selector" value={value} label={label} onChange={handleChange}>
            <MenuItem key={0} value={0}>
              <em>All</em>
            </MenuItem>
            {items.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );
  }
);

export default SelectorType;
