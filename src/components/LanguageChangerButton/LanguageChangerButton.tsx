import 'reflect-metadata';

import React, { useState } from 'react';

import { observer } from 'mobx-react';

import Button from '@mui/material/Button';

import i18n from '../../locales/config';

interface Properties {
  height?: number;
  width?: number;
}

const LanguageChangerButton = observer(({ height, width }: Properties) => {
  const [language, setLanguage] = useState<string>(i18n.resolvedLanguage);
  const supportedLngs = i18n.store.options.supportedLngs ??
    i18n.languages ?? [language];
  const languages: string[] = (
    Array.isArray(supportedLngs) ? supportedLngs : [language]
  ).filter((val, idx, arr) => {
    return val !== 'cimode';
  });
  const currentLanguageIndex = languages.indexOf(language);

  const handleChange = async (): Promise<void> => {
    const nextLanguage =
      languages[
        currentLanguageIndex < languages.length - 1
          ? currentLanguageIndex + 1
          : 0
      ];
    setLanguage(nextLanguage);
    await i18n.changeLanguage(nextLanguage);
  };

  return (
    <Button
      sx={{ height: height ? height : 'auto', width: width ? width : 'auto' }}
      className="langSwitcher"
      variant="contained"
      color="info"
      value={language}
      onClick={async (): Promise<void> => handleChange()}
    >
      {language.toUpperCase()}
    </Button>
  );
});

export default LanguageChangerButton;
