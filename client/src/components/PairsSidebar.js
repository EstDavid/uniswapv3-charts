import React from 'react';
import PairsList from './PairsList';

const PairsSidebar = () => {
    return(
        <div className="flex-shrink-0 p-3 bg-white" style={{width: "280px"}}>
            <a href="/" className="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom">
                <svg className="bi me-2" width="30" height="24"></svg>
                <span className="fs-5 fw-semibold">Pool Pairs</span>
            </a>
            <ul className="list-unstyled ps-0">
                <li className="mb-1">
                    <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="true">
                        ETH pairs
                    </button>
                    <div className="collapse show" id="home-collapse">
                        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li><a href="#" className="link-dark rounded">Overview</a></li>
                            <li><a href="#" className="link-dark rounded">Updates</a></li>
                            <li><a href="#" className="link-dark rounded">Reports</a></li>
                        </ul>
                    </div>
                </li>
                <li className="mb-1">
                    <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#dashboard-collapse" aria-expanded="false">
                        Stable coin pairs
                    </button>
                    <div className="collapse" id="dashboard-collapse">
                        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li><a href="#" className="link-dark rounded">Overview</a></li>
                            <li><a href="#" className="link-dark rounded">Weekly</a></li>
                            <li><a href="#" className="link-dark rounded">Monthly</a></li>
                            <li><a href="#" className="link-dark rounded">Annually</a></li>
                        </ul>
                    </div>
                </li>
                <li className="mb-1">
                    <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#orders-collapse" aria-expanded="false">
                        All pairs
                    </button>
                    <div className="collapse" id="orders-collapse">
                        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li><a href="#" className="link-dark rounded">New</a></li>
                            <li><a href="#" className="link-dark rounded">Processed</a></li>
                            <li><a href="#" className="link-dark rounded">Shipped</a></li>
                            <li><a href="#" className="link-dark rounded">Returned</a></li>
                        </ul>
                    </div>
                </li>
                <PairsList listName="New Pairs" idNumber={5} />
                <li className="border-top my-3"></li>
                <li className="mb-1">
                    <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#account-collapse" aria-expanded="false">
                        Account
                    </button>
                    <div className="collapse" id="account-collapse">
                        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li><a href="#" className="link-dark rounded">New...</a></li>
                            <li><a href="#" className="link-dark rounded">Profile</a></li>
                            <li><a href="#" className="link-dark rounded">Settings</a></li>
                            <li><a href="#" className="link-dark rounded">Sign out</a></li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default PairsSidebar;