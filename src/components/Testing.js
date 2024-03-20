import React, { useState } from 'react';
// import OrderSummery from './subscription/OrderSummery';
// import Pricing from './subscription/Pricing';
// import Packages2 from './subscription/Packages2'
import PaymentMethods from './subscription/PaymentMethods';

function Testing() {

  const selectedPackage = {
    name: 'Points',
    tier: 'Starter Pack',
    points: 100,
    price: 5000,
    quizzes: 5,
    duration: 7,
    features: [
      '100 points',
      `Attempt up to 5 quizzes`,
      'Expires in 7 days',
    ]
  }

  return (
    <div style={{ marginTop: "100px" }} >
      {/* <Packages2></Packages2> */}
      {/* <Pricing></Pricing> */}
      {/* <OrderSummery /> */}
      <PaymentMethods
        price={selectedPackage.price}
        points={selectedPackage.points}
        paymentFor={'points'}
      // studentInfo={studentInfo}
      />
    </div>
  );
}

export default Testing;
