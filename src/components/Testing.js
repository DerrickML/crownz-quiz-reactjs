import React, { useState } from 'react';
import PaymentMethods from './subscription/PaymentMethods';
import Packages from './subscription/Packages';
function Testing() {

  return (
    <div style={{ marginTop: "100px" }} >
      <Packages ></Packages>
      {/* <PaymentMethods price={10000} paymentFor={'points'} points={200} /> */}
    </div>
  );
}

export default Testing;
