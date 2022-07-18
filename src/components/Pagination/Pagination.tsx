import 'reflect-metadata';

import { Pagination as MUIPagination } from '@mui/material';
import { observer } from 'mobx-react';
import React, { ChangeEvent, useEffect } from 'react';

interface Properties {
  totalCount: number;
  currentPage: number;
  onChange: (event: ChangeEvent<unknown>, value: number) => void;
}

const Pagination = observer(
  ({ totalCount, currentPage, onChange }: Properties) => {
    const [page, setPage] = React.useState(currentPage);

    const handleChange = (event: ChangeEvent<unknown>, value: number): void => {
      setPage(value);
      onChange(event, value);
    };

    useEffect(() => {
      setPage(currentPage);
    }, [currentPage]);

    return totalCount > 1 ? (
      <MUIPagination count={totalCount} page={page} onChange={handleChange} />
    ) : (
      <></>
    );
  }
);

export default Pagination;
