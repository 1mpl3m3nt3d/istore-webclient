import 'reflect-metadata';
import '../../locales/config';

import React from 'react';

import { observer } from 'mobx-react';

import { Paper, Stack } from '@mui/material';

import { LanguageChangerButton } from '../LanguageChangerButton';

const Footer = observer(() => {
  return (
    <>
      <Paper
        sx={{
          display: 'grid',
          height: 'inherit',
          justifyContent: 'center',
          justifyItems: 'center',
          alignContent: 'center',
          alignItems: 'center',
        }}
      >
        <Stack
          direction="row"
          spacing={{ xs: 1, sm: 2, md: 4 }}
          justifyContent="center"
          justifyItems="center"
          justifySelf="center"
          alignContent="center"
          alignItems="center"
          alignSelf="center"
        >
          <LanguageChangerButton height={45} width={145} />
        </Stack>
      </Paper>
    </>
  );
});

export default Footer;
