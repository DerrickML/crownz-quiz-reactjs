import React from "react";
import './Pricing.css'

function Pricing() {
    return (
        <div className='PricingContainer'>
            <header>
                <h1>Our Pricing</h1>
                {/* <div className="switch__container">
                    <p>Annually</p>
                    <label htmlFor="switch__toggle" className="switch">
                        <input type="checkbox" id="switch__toggle" />
                        <span className="slider switch__btn" />
                    </label>
                    <p>Monthly</p>
                </div> */}
            </header>
            <main>
                <div className="cards">
                    <div className="card card__regular">
                        <h2>Basic</h2>
                        <p className="card__currency monthly">
                            $<span>19.99</span>
                        </p>
                        {/* <p className="card__currency annually">
                            $<span>199.99</span>
                        </p> */}
                        <ul className="card__items">
                            <li className="card__item">500 GB Storage</li>
                            <li className="card__item">2 Users Allowed</li>
                            <li className="card__item">Send up to 3 GB</li>
                        </ul>
                        <button>Learn More</button>
                    </div>
                    <div className="card card__main">
                        <h2>Professional</h2>
                        <p className="card__currency monthly">
                            $<span>24.99</span>
                        </p>
                        {/* <p className="card__currency annually">
                            $<span>249.99</span>
                        </p> */}
                        <ul className="card__items">
                            <li className="card__item">1 TB Storage</li>
                            <li className="card__item">5 Users Allowed</li>
                            <li className="card__item">Send up to 10 GB</li>
                        </ul>
                        <button>Learn More</button>
                    </div>
                    <div className="card card__regular">
                        <h2>Master</h2>
                        <p className="card__currency monthly">
                            $<span>39.99</span>
                        </p>
                        {/* <p className="card__currency annually">
                            $<span>399.99</span>
                        </p> */}
                        <ul className="card__items">
                            <li className="card__item">2 TB Storage</li>
                            <li className="card__item">10 Users Allowed</li>
                            <li className="card__item">Send up to 20 GB</li>
                        </ul>
                        <button>Learn More</button>
                    </div>
                </div>
            </main>
        </div>

    )
}

export default Pricing