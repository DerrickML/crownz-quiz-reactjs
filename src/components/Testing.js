import React, { useState } from 'react';
import PaymentMethods from './subscription/PaymentMethods';
function Testing() {

  return (
    <div>
      <PaymentMethods price={10000} paymentFor={'points'} points={200} />
    </div>
  );
}

export default Testing;
