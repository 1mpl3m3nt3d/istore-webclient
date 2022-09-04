/* eslint-disable i18next/no-literal-string */

import 'reflect-metadata';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react';
import { Fragment } from 'react';

import { IoCTypes } from 'ioc';
import { CheckoutStore } from 'stores';

const PaymentForm = observer((): JSX.Element => {
  const store = useInjection<CheckoutStore>(IoCTypes.checkoutStore);

  return (
    <Fragment>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cardName"
            label="Name on card"
            fullWidth
            autoComplete="cc-name"
            variant="standard"
            value={store.cardName}
            onChange={(event): void => store.changeCardName(event.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cardNumber"
            label="Card number"
            fullWidth
            autoComplete="cc-number"
            variant="standard"
            inputMode="numeric"
            value={store.cardNumber}
            onChange={(event): void => {
              if (event.target.value.match('\\\\d+\\')) {
                store.changeCardNumber(Number(event.target.value));
              }
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="expDate"
            label="Expiry date"
            fullWidth
            autoComplete="cc-exp"
            variant="standard"
            value={store.expDate}
            onChange={(event): void => store.changeExpDate(event.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cvv"
            label="CVV"
            helperText="Last three digits on signature strip"
            fullWidth
            autoComplete="cc-csc"
            variant="standard"
            inputMode="numeric"
            value={store.cvv}
            onChange={(event): void =>
              store.changeCvv(Number(event.target.value))
            }
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="secondary" name="saveCard" value="yes" />}
            label="Remember credit card details for next time"
          />
        </Grid>
      </Grid>
    </Fragment>
  );
});

export default PaymentForm;
