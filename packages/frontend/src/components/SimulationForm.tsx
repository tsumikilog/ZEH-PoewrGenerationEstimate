import React, { useState } from 'react';
import { SimulationInput } from '../types';

interface SimulationFormProps {
  onSubmit: (input: SimulationInput) => void;
  loading: boolean;
}

export const SimulationForm: React.FC<SimulationFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<SimulationInput>({
    address: '',
    roof_area: 0,
    roof_angle: 30,
    floor_area: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = name === 'address' ? value : parseFloat(value) || 0;
    
    setFormData(prev => ({
      ...prev,
      [name]: numericValue
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.address.trim()) {
      newErrors.address = '住所を入力してください';
    }

    if (formData.roof_area <= 0) {
      newErrors.roof_area = '屋根面積は1以上の値を入力してください';
    }

    if (formData.roof_angle < 0 || formData.roof_angle > 90) {
      newErrors.roof_angle = '屋根の傾斜角度は0〜90度の範囲で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="simulation-form">
      <h2>条件入力</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="address">住所（市区町村まで）</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="例: 東京都新宿区"
            className={errors.address ? 'error' : ''}
          />
          {errors.address && <span className="error-text">{errors.address}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="roof_area">屋根面積（m²）</label>
          <input
            type="number"
            id="roof_area"
            name="roof_area"
            value={formData.roof_area}
            onChange={handleInputChange}
            min="1"
            step="0.1"
            className={errors.roof_area ? 'error' : ''}
          />
          {errors.roof_area && <span className="error-text">{errors.roof_area}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="roof_angle">屋根の傾斜角度（度）</label>
          <input
            type="number"
            id="roof_angle"
            name="roof_angle"
            value={formData.roof_angle}
            onChange={handleInputChange}
            min="0"
            max="90"
            step="1"
            className={errors.roof_angle ? 'error' : ''}
          />
          {errors.roof_angle && <span className="error-text">{errors.roof_angle}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="floor_area">延床面積（m²）※参考値</label>
          <input
            type="number"
            id="floor_area"
            name="floor_area"
            value={formData.floor_area}
            onChange={handleInputChange}
            min="0"
            step="0.1"
          />
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'シミュレーション中...' : 'シミュレーション実行'}
        </button>
      </form>
    </div>
  );
};