import { Link } from '@tanstack/react-router';

import { IndexRoute } from '../../routes/home';

export const Branding = () => {
  return (
    <>
      <Link
        className="flex justify-center py-2 text-2xl font-extrabold text-primary md:hidden"
        to={IndexRoute.fullPath}
      >
        Guavaspace
      </Link>
      <div className="my-8 hidden md:block md:w-[450px]">
        <h1 className="text-3xl font-bold text-primary md:text-4xl">
          Trouvez un espace de travail qui vous convient.
        </h1>
        <p className="mt-4">
          Louez ou sous-louer des espaces de bureaux{' '}
          <span className="text-primary">facilement</span> sur la plateforme de
          location en ligne
        </p>
      </div>
    </>
  );
};
