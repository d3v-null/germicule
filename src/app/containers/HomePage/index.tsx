import React from 'react';
import { Helmet } from 'react-helmet-async';
import { GermiculeEnvironment } from '../../components/GermiculeEnvironment';
import defaultGermicule from '../../data/defaultGermicule';


export function HomePage() {
  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta
          name="description"
          content="Visualise your contacts and their covid risk factors"
        />
      </Helmet>
      <GermiculeEnvironment src={defaultGermicule} />
    </>
  );
}
