import React from 'react';
import { SimulationOutput } from '../types';

interface SimulationResultProps {
  result: SimulationOutput;
}

export const SimulationResult: React.FC<SimulationResultProps> = ({ result }) => {
  const getJudgmentText = (judgment: string) => {
    switch (judgment) {
      case 'good':
        return { text: 'ZEH基準達成可能', symbol: '◯', className: 'good' };
      case 'fair':
        return { text: 'ZEH基準達成困難', symbol: '△', className: 'fair' };
      case 'poor':
        return { text: 'ZEH基準達成不可', symbol: '✕', className: 'poor' };
      default:
        return { text: '判定不明', symbol: '?', className: 'unknown' };
    }
  };

  const judgment = getJudgmentText(result.zeh_judgment);

  return (
    <div className="simulation-result">
      <h2>シミュレーション結果</h2>
      
      <div className="result-summary">
        <div className="main-result">
          <div className="generation-amount">
            <span className="label">年間推定発電量</span>
            <span className="value">{result.estimated_generation.toLocaleString()}</span>
            <span className="unit">kWh</span>
          </div>
          
          <div className={`zeh-judgment ${judgment.className}`}>
            <span className="symbol">{judgment.symbol}</span>
            <span className="text">{judgment.text}</span>
          </div>
        </div>
      </div>

      <div className="result-details">
        <h3>詳細情報</h3>
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">設置地域</span>
            <span className="detail-value">{result.details.location}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">年間日射量</span>
            <span className="detail-value">{result.details.solar_irradiance.toFixed(1)} kWh/m²</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">効率係数</span>
            <span className="detail-value">{(result.details.efficiency_factor * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className="input-summary">
        <h3>入力条件</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">住所</span>
            <span className="summary-value">{result.input_summary.address}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">屋根面積</span>
            <span className="summary-value">{result.input_summary.roof_area} m²</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">屋根傾斜角度</span>
            <span className="summary-value">{result.input_summary.roof_angle}°</span>
          </div>
          {result.input_summary.floor_area && result.input_summary.floor_area > 0 && (
            <div className="summary-item">
              <span className="summary-label">延床面積</span>
              <span className="summary-value">{result.input_summary.floor_area} m²</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};