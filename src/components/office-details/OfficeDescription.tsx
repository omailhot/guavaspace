import { useOfficeContext } from '../../contexts/OfficeContext';
import { cn } from '../../lib/utils';
import AddressRenderer from '../google-map/AddressRenderer';

type Props = {
  className?: string;
};

export const OfficeDescription = ({ className }: Props) => {
  const { office } = useOfficeContext();

  return (
    <div className={cn('flex flex-col', className)}>
      <div>
        <h2 className="text-xl font-semibold">
          <AddressRenderer
            lat={office.officeAddress.latitude}
            lng={office.officeAddress.longitude}
          />
        </h2>
      </div>
      <div>
        <p>{office.description}</p>
      </div>
    </div>
  );
};
