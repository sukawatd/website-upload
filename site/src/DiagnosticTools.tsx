// src/DiagnosticTools.tsx

import React, { useState } from 'react';

const DiagnosticTools: React.FC = () => {
  const [ipAddress, setIpAddress] = useState<string>("8.8.8.8");  // Default IP address
  const [pingResult, setPingResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Function to perform the ping
  const performPing = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ping?ip=${ipAddress}`);
      if (!response.ok) {
        throw new Error('Failed to fetch ping data');
      }
      const data = await response.json();
      // Calculate total ping time
      const totalPingTime = data.results.reduce((acc: number, result: { ping_time: number }) => acc + result.ping_time, 0);

      // Count number of successful ping responses
      const count = data.results.length;

      // Calculate average ping time and format it to 0 decimal places
      const avgPingTime = (totalPingTime / count).toFixed(0);

      // Calculate packet loss percentage
      const packetLoss = (((3 - count) / 3) * 100).toFixed(0);

      // Format the result string with HTML line breaks for display
      const resultText = `
      Ping to ${ipAddress}
      3 packets transmitted, ${count} received, ${packetLoss}% packet loss, average time ${avgPingTime} ms
    `;
      setPingResult(resultText);
    } catch (error) {
      console.error(error);
      setPingResult('Ping failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Ping Test Tools</h2>
      <label>
        IP Address:&nbsp;
        <input
          type="text"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}  // Update IP address as user types
          placeholder="Enter IP address"
        />
      </label>&nbsp;
      <button onClick={performPing} disabled={loading}>
        Test
      </button>
      {loading ? <p>Pinging...</p> : pingResult && <p><pre>{pingResult}</pre></p>}
    </div>
  );
};

export default DiagnosticTools;
