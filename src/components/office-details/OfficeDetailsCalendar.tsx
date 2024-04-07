import { useNavigate } from '@tanstack/react-router';
import { DateRange } from 'react-day-picker';

import { useOfficeContext } from '../../Contexts/OfficeContext';
import { GET_DEFAULT_FROM_DATE } from '../../routes/offices/details';
import { CalendarInput } from '../form/CalendarInput';
import { getOfficeRoute } from './OfficeDetails';

type Props = {
  className?: string;
};

export const OfficeDetailsCalendar = ({ className }: Props) => {
  const { isEdit } = useOfficeContext();
  const route = getOfficeRoute(isEdit);

  const navigate = useNavigate({ from: route.fullPath });
  const date = route.useSearch();

  const handleOnDateChange = (range: DateRange | undefined) => {
    navigate({
      search: (old) => ({
        ...old,
        from: range?.from ?? GET_DEFAULT_FROM_DATE(),
        to: range?.to ?? GET_DEFAULT_FROM_DATE(),
      }),
    });
  };

  const formattedDate = {
    from: date.from ?? GET_DEFAULT_FROM_DATE(),
    to: date.to ?? GET_DEFAULT_FROM_DATE(),
  };

  return (
    <CalendarInput
      className={className}
      defaultDate={formattedDate}
      onChange={handleOnDateChange}
    />
  );
};
