import React, { useState, useEffect } from "react";
import './App.css';
import DroneSignLogo from './dronesign.svg';
import DiagnosticTools from './DiagnosticTools';

interface ConfigData {
    server_name: string;
    server_ssl_name: string;
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
    const [serverSslName, setServerSslName] = useState<string>('');
    const [ssl, setSsl] = useState<boolean>(false);
    const [interval, setInterval] = useState<number>(10);
    const [nofix, setNofix] = useState<boolean>(false);
    const [dhcp, setDhcp] = useState<boolean>(false);
    const [ip, setIp] = useState<string>('');
    const [netmask, setNetmask] = useState<string>('');
    const [gateway, setGateway] = useState<string>('');
    const [dns, setDns] = useState<string>('');
    const [irr, setIrr] = useState<string>('192.168.1.2:81');
    const [upload, setUpload] = useState<boolean>(false);

    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [activeView, setActiveView] = useState<string>('settings');
    const [configData, setConfigData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Function to generate the hardware URI
    const getHardwareUri = () => {
        if (!irr) return '';
        
        // Check if a port is included in the `irr` string
        const url = irr.includes(':') ? irr : `${irr}:80`;
        console.log('URL: http://', url);
        // Return the formatted URI
        return `http://${url}`;
    };
    
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // confirm the user wants to submit the form
        if (!window.confirm('Are you sure you want to update configuration\nThis will restart the device')) {
            console.log("User cancelled form submission");
            return;
        };

        const config = {
            server_name: serverName,
            server_ssl_name: serverSslName,
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
        // post to /config with the config object with POST method then redirect to /
        fetch('/config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(config)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to submit config data');
                }
                alert('Config data submitted successfully');
            })
            .catch(err => {
                alert('Failed to submit config data');
                console.error(err);
            })
            .finally(() => {
                // delay for 20 seconds before redirecting to root URL
                setTimeout(() => {
                    console.log('Redirecting to root URL');
                    window.location.href = '/';
                }, 20000);
            });

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
                setServerSslName(data.server_ssl_name);
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
            fetch('/config', { cache: 'no-store' })
            // .then(response => {
            //     if (!response.ok) {
            //       throw new Error(`Network response was not ok, status: ${response.status}`);
            //     }
            //     return response.json(); // This will parse the JSON if the Content-Type is correct
            //   })
            //   .then(data => {
            //     console.log('Parsed JSON:', data);
            //   })
            //   .catch(error => console.error('Fetch error:', error));
            // .then(async (response) => {
            //     const text = await response.text();
            //     console.log('Raw response text:', text);
            //     console.log('Text length:', text.length);
            //     try {
            //       const json = JSON.parse(text);
            //       console.log('Parsed JSON:', json);
            //     } catch (error) {
            //       console.error('JSON parse error:', error);
            //     }
            //   })
            //   .catch(error => console.error('Fetch error:', error));
              // fetch('/api/config')
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
                <img src={DroneSignLogo} alt="Setting Logo" className="logo" />
                <span className="navbar-title">Remote ID Configuration</span>
            </nav>

            {/* Sidebar */}
            <aside className={`sidebar ${drawerOpen ? 'open' : ''}`}>
                <ul>
                    <li onClick={() => handleNavigation('dashboard')}>Dashboard</li>
                    <li onClick={() => handleNavigation('settings')}>Settings</li>
                    <li onClick={() => handleNavigation('fetch')}>Fetch</li>
                    <li onClick={() => handleNavigation('diagnostics')}>Diagnostics</li>
                </ul>
            </aside>

            {/* Main Content */}
            <main className={`content ${activeView === 'dashboard' ? 'expanded' : ''}`}>
                {activeView === 'dashboard' ? (
                    // Display the iframe when "Dashboard" is active
                    <iframe
                        src={getHardwareUri()}
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
                                <label htmlFor="serverName">Server Name</label>
                                <input
                                    type="text"
                                    id="serverName"
                                    value={serverName}
                                    onChange={(e) => setServerName(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="serverPort">Server SSL Name&nbsp;</label>
                                <input
                                    type="text"
                                    id="serverSslName"
                                    value={serverSslName}
                                    onChange={(e) => setServerSslName(e.target.value)}
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
                ) : activeView === 'diagnostics' ? (
                    // Display the diagnostics view when "Diagnostics" is active
                    <DiagnosticTools />
                ): (
                    <p>Please select a valid view.</p>
                )}
            </main>
        </div>
    );
}

export default App;
