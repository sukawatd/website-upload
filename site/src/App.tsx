import React, { useState } from "react";
import './App.css';
import ViteLogo from './vite-logo.svg';

function App() {
    const [dhcp, setDhcp] = useState(false);
    const [ip, setIp] = useState("");
    const [netmask, setNetmask] = useState("");
    const [gateway, setGateway] = useState("");
    const [interval, setInterval] = useState(10);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [activeView, setActiveView] = useState<string>('settings');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // handle form submission logic
    };

    const handleMenuToggle = () => {
        // Toggle the drawer open state
        setDrawerOpen(!drawerOpen);
    };

    const handleNavigation = (view: string) => {
        setActiveView(view);
        // Close the drawer after selecting an item
        setDrawerOpen(false);
    };

    return (
        <div className={`app-container ${activeView === 'dashboard' ? 'full-width' : ''}`}>
            {/* Navbar */}
            <nav className="navbar">
                <button className="menu-button" onClick={handleMenuToggle}>
                    ☰
                </button>
                <img src={ViteLogo} alt="Vite Logo" className="logo" />
                <span className="navbar-title">ESP32 Network Configuration</span>
            </nav>

            {/* Sidebar */}
            <aside className={`sidebar ${drawerOpen ? 'open' : ''}`}>
                <ul>
                    <li onClick={() => handleNavigation('dashboard')}>Dashboard</li>
                    <li onClick={() => handleNavigation('settings')}>Settings</li>
                </ul>
            </aside>

            {/* Main Content */}
            <main className={`content ${activeView === 'dashboard' ? 'expanded' : ''}`}>
                {activeView === 'dashboard' ? (
                    // Display the iframe when "Dashboard" is active
                    <iframe
                        src="http://192.168.1.2"
                        title="Atmosphere Dashboard"
                        style={{
                            width: '100%',
                            height: '100%',
                            border: 'none'
                        }}
                    />
                ) : (
                    // Display the settings form when "Settings" is active
                    <>
                        <h4>Network Configuration</h4>
                        <form onSubmit={handleSubmit} className="form">
                            <div className="form-group">
                                <input
                                    type="checkbox"
                                    id="dhcp"
                                    checked={dhcp}
                                    onChange={(e) => setDhcp(e.target.checked)}
                                />
                                <label htmlFor="dhcp">Enable DHCP</label>
                            </div>

                            <div className="form-group">
                                <label htmlFor="ip">IP Address</label>
                                <input
                                    type="text"
                                    id="ip"
                                    value={ip}
                                    onChange={(e) => setIp(e.target.value)}
                                    disabled={dhcp}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="netmask">Netmask</label>
                                <input
                                    type="text"
                                    id="netmask"
                                    value={netmask}
                                    onChange={(e) => setNetmask(e.target.value)}
                                    disabled={dhcp}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="gateway">Gateway</label>
                                <input
                                    type="text"
                                    id="gateway"
                                    value={gateway}
                                    onChange={(e) => setGateway(e.target.value)}
                                    disabled={dhcp}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="interval">Update Interval</label>
                                <select
                                    id="interval"
                                    value={interval}
                                    onChange={(e) => setInterval(Number(e.target.value))}
                                >
                                    <option value={10}>10 Seconds</option>
                                    <option value={30}>30 Seconds</option>
                                    <option value={60}>60 Seconds</option>
                                </select>
                            </div>

                            <div className="button-group">
                                <button type="submit" className="primary-button">Submit</button>
                                <button type="reset" className="secondary-button" onClick={() => window.location.reload()}>Reset</button>
                            </div>
                        </form>
                    </>
                )}
            </main>
        </div>
    );
}

export default App;
