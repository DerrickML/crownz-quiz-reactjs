import React, { useState } from 'react';
import OrderSummery2 from './subscription/OrderSummery2';
import Pricing from './subscription/Pricing';
import Packages2 from './subscription/Packages2'
function Testing() {

  return (
    <div style={{ marginTop: "100px" }} >
      <Packages2></Packages2>
      <Pricing></Pricing>
      <OrderSummery2 />
    </div>
  );
}

export default Testing;
