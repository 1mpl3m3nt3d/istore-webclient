import { ReactElement } from 'react';

import { useTranslation } from 'react-i18next';

import { Box, CircularProgress, Stack, Typography } from '@mui/material';

function LoadingSpinner(): ReactElement {
  const { t } = useTranslation(['app']);

  return (
    <Box
      textAlign="center"
      justifyContent="center"
      justifyItems="center"
      justifySelf="center"
      alignContent="center"
      alignItems="center"
      alignSelf="center"
    >
      <Stack direction="row" spacing={2}>
        <Stack
          textAlign="center"
          justifyContent="center"
          justifyItems="center"
          justifySelf="center"
          alignContent="center"
          alignItems="center"
          alignSelf="center"
        >
          <Typography>{t('loading')}</Typography>
        </Stack>
        <Stack
          textAlign="center"
          justifyContent="center"
          justifyItems="center"
          justifySelf="center"
          alignContent="center"
          alignItems="center"
          alignSelf="center"
        >
          <CircularProgress role="status" />
        </Stack>
      </Stack>
    </Box>
  );
}

export default LoadingSpinner;
