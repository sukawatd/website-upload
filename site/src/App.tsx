import React, { useState, useEffect } from "react";
import './App.css';
import ViteLogo from './vite-logo.svg';

interface ConfigData {
    server_name: string;
    server_port: number;
    ssl: boolean;
    nofix: boolean;
    dhcp_enable: boolean;
    ip: string;
    netmask: string;
    gateway: string;
    dns: string;
    irr: string;
    upload: boolean;
    interval: number;
}

function App() {
    const [serverName, setServerName] = useState<string>('');
    const [serverPort, setServerPort] = useState<number>(80);
    const [ssl, setSsl] = useState<boolean>(false);
    const [interval, setInterval] = useState<number>(10);
    const [nofix, setNofix] = useState<boolean>(false);
    const [dhcp, setDhcp] = useState<boolean>(false);
    const [ip, setIp] = useState<string>('');
    const [netmask, setNetmask] = useState<string>('');
    const [gateway, setGateway] = useState<string>('');
    const [dns, setDns] = useState<string>('');
    const [irr, setIrr] = useState<string>('');
    const [upload, setUpload] = useState<boolean>(false);

    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [activeView, setActiveView] = useState<string>('settings');
    const [configData, setConfigData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const config = {
            server_name: serverName,
            server_port: serverPort,
            ssl,
            interval,
            nofix,
            dhcp_enable: dhcp,
            ip,
            netmask,
            gateway,
            dns,
            irr,
            upload
        };
        console.log("Submitting config:", config);
        // Implement form submission logic here (e.g., send data to ESP32)
    };

    const handleMenuToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleNavigation = (view: string) => {
        setActiveView(view);
        setDrawerOpen(false);
    };

    useEffect(() => {
        // Fetch settings data from the server
        const fetchSettings = async () => {
            try {
                setLoading(true);
                const response = await fetch('/config');
                if (!response.ok) {
                    throw new Error('Failed to fetch config data');
                }
                const data: ConfigData = await response.json();

                // Update the state variables with the fetched data
                setServerName(data.server_name);
                setServerPort(data.server_port);
                setSsl(data.ssl);
                setInterval(data.interval);
                setNofix(data.nofix);
                setDhcp(data.dhcp_enable);
                setIp(data.ip);
                setNetmask(data.netmask);
                setGateway(data.gateway);
                setDns(data.dns);
                setIrr(data.irr);
                setUpload(data.upload);
                setInterval(data.interval);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        // Call the fetch function when the component mounts
        fetchSettings();
    }, []);


    useEffect(() => {
        if (activeView === 'fetch') {
            setLoading(true);
            fetch('http://192.168.1.100/config')
                .then((response) => response.json())
                .then((data) => {
                    setConfigData(data);
                    setLoading(false);
                })
                .catch(() => {
                    setError('Failed to fetch config data');
                    setLoading(false);
                });
        }
    }, [activeView]);

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
                    <li onClick={() => handleNavigation('fetch')}>Fetch</li>
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
                ) : activeView === 'settings' ? (
                    // Display the settings form when "Settings" is active
                    <>
                        <h4>Network Configuration</h4>
                        <form onSubmit={handleSubmit} className="form">
                            <div className="form-group">
                                <label htmlFor="serverName">Server Name&nbsp;</label>
                                <input
                                    type="text"
                                    id="serverName"
                                    value={serverName}
                                    onChange={(e) => setServerName(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="serverPort">Server Port</label>
                                <input
                                    type="number"
                                    id="serverPort"
                                    value={serverPort}
                                    onChange={(e) => setServerPort(Number(e.target.value))}
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="checkbox"
                                    id="ssl"
                                    checked={ssl}
                                    onChange={(e) => setSsl(e.target.checked)}
                                />
                                <label htmlFor="ssl">Enable SSL</label>
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

                            <div className="form-group">
                                <input
                                    type="checkbox"
                                    id="nofix"
                                    checked={nofix}
                                    onChange={(e) => setNofix(e.target.checked)}
                                />
                                <label htmlFor="nofix">No Fix</label>
                            </div>

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
                                <label htmlFor="dns">DNS</label>
                                <input
                                    type="text"
                                    id="dns"
                                    value={dns}
                                    onChange={(e) => setDns(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="irr">Irridium IP</label>
                                <input
                                    type="text"
                                    id="irr"
                                    value={irr}
                                    onChange={(e) => setIrr(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="checkbox"
                                    id="upload"
                                    checked={upload}
                                    onChange={(e) => setUpload(e.target.checked)}
                                />
                                <label htmlFor="upload">Upload Configuration</label>
                            </div>

                            <div className="button-group">
                                <button type="submit" className="primary-button">Submit</button>
                                <button type="reset" className="secondary-button" onClick={() => window.location.reload()}>Reset</button>
                            </div>
                        </form>
                    </>
                ) : activeView === 'fetch' ? (
                    // Display the fetched data when "Fetch" is active
                    <>
                        <h4>Configuration Data</h4>
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p style={{ color: 'red' }}>{error}</p>
                        ) : (
                            <pre>{JSON.stringify(configData, null, 2)}</pre>
                        )}
                    </>
                ) : (
                    <p>Please select a valid view.</p>
                )}
            </main>
        </div>
    );
}

export default App;
