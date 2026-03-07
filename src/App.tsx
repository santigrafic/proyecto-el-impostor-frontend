import React from "react";

import Layout from "./application/components/layout";

import RoutesComponent from "./application/components/routes";

const App: React.FC = () => {
  return (
    <Layout>
      <RoutesComponent />
    </Layout>
  );
};

export default App;
