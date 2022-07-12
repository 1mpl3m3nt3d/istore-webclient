import 'reflect-metadata';

import { CssBaseline } from '@mui/material';
import { ThemeChanger } from 'components/ThemeChanger';
import { observer } from 'mobx-react';
import { AppRoutes } from 'routes';

const App = observer(() => {
  return (
    <ThemeChanger>
      <CssBaseline />
      <AppRoutes />
    </ThemeChanger>
  );
});

export default App;
