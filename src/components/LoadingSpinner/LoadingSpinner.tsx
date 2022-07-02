import React, { ReactElement } from 'react';

import { useTranslation } from 'react-i18next';

import { CircularProgress, Container } from '@mui/material';

function LoadingSpinner(): ReactElement {
  const { t } = useTranslation(['app']);

  return (
    <Container className="centered">
      <span>{t('loading')}</span>
      <CircularProgress role="status" className="centered" />
    </Container>
  );
}

export default LoadingSpinner;
