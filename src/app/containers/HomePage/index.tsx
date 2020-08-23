import React from 'react';
import { Helmet } from 'react-helmet-async';
import { GermiculeGraph } from '../../components/GermiculeGraph';
import defaultGermicule from '../../data/defaultGermicule.json.js';

import { GermiculeMeta } from '../../types';

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      <GermiculeGraph data={defaultGermicule as GermiculeMeta} />
    </>
  );
}
