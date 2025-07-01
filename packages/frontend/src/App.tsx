import React, { useState } from 'react';
import { SimulationForm } from './components/SimulationForm';
import { SimulationResult } from './components/SimulationResult';
import { SimulationInput, SimulationOutput } from './types';
import './App.css';

function App() {
  const [result, setResult] = useState<SimulationOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (input: SimulationInput) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error('シミュレーションに失敗しました');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>ZEH太陽光発電シミュレーター</h1>
        <p>ZEH住宅向け太陽光発電量を簡単に試算できます</p>
      </header>

      <main className="app-main">
        <div className="container">
          <SimulationForm onSubmit={handleSubmit} loading={loading} />
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {result && (
            <SimulationResult result={result} />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 ZEH太陽光発電シミュレーター</p>
      </footer>
    </div>
  );
}

export default App;