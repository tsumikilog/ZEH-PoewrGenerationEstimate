import { SimulationInput, SimulationOutput } from '../types/index.js';
import { NedoDataService } from './nedoDataService.js';

export class CalculationService {
  /**
   * 太陽光発電量を計算
   */
  static calculateSolarGeneration(input: SimulationInput): SimulationOutput {
    // 1. 地域の日射量データを取得
    const solarData = NedoDataService.getSolarIrradianceByAddress(input.address);
    
    // 2. 発電量計算
    const generationResult = this.calculateGeneration(
      solarData.annual_irradiance,
      input.roof_area,
      input.roof_angle
    );

    // 3. ZEH基準判定
    const zehJudgment = this.calculateZehJudgment(
      generationResult.estimated_generation,
      input.floor_area || 0
    );

    return {
      estimated_generation: Math.round(generationResult.estimated_generation),
      zeh_judgment: zehJudgment,
      input_summary: input,
      details: {
        solar_irradiance: solarData.annual_irradiance,
        efficiency_factor: generationResult.efficiency_factor,
        location: solarData.location
      }
    };
  }

  /**
   * 太陽光発電量の詳細計算
   */
  private static calculateGeneration(
    annualIrradiance: number, 
    roofArea: number, 
    roofAngle: number
  ) {
    // 基本パラメータ
    const PANEL_EFFICIENCY = 0.20; // パネル効率 20%
    const SYSTEM_EFFICIENCY = 0.85; // システム効率 85%
    const INSTALLATION_RATIO = 0.7; // 屋根面積に対する設置可能比率 70%

    // 傾斜角度による補正係数
    const angleCorrection = this.getAngleCorrection(roofAngle);
    
    // 総合効率係数
    const totalEfficiency = PANEL_EFFICIENCY * SYSTEM_EFFICIENCY * INSTALLATION_RATIO * angleCorrection;
    
    // 年間発電量計算 (kWh)
    // 発電量 = 日射量 × 屋根面積 × 総合効率
    const estimatedGeneration = annualIrradiance * roofArea * totalEfficiency;

    return {
      estimated_generation: estimatedGeneration,
      efficiency_factor: totalEfficiency
    };
  }

  /**
   * 屋根傾斜角度による補正係数を計算
   */
  private static getAngleCorrection(angle: number): number {
    // 最適角度は30度として、角度による効率の変化を計算
    const optimalAngle = 30;
    const angleDiff = Math.abs(angle - optimalAngle);
    
    // 角度差による効率低下を考慮（最大20%の低下）
    const efficiencyLoss = Math.min(angleDiff * 0.005, 0.2);
    
    return Math.max(0.8, 1.0 - efficiencyLoss);
  }

  /**
   * ZEH基準達成判定
   */
  private static calculateZehJudgment(
    estimatedGeneration: number, 
    floorArea: number
  ): 'good' | 'fair' | 'poor' {
    if (floorArea <= 0) {
      // 延床面積が不明の場合は発電量のみで簡易判定
      if (estimatedGeneration >= 5000) return 'good';
      if (estimatedGeneration >= 3000) return 'fair';
      return 'poor';
    }

    // ZEH基準: 年間一次エネルギー消費量を20%以上削減
    // 一般的な住宅の一次エネルギー消費量: 約100 kWh/m² ・年
    const estimatedConsumption = floorArea * 100; // kWh/年
    const requiredGeneration = estimatedConsumption * 0.2; // 20%削減に必要な発電量

    // 発電量と必要量の比較
    const achievementRatio = estimatedGeneration / requiredGeneration;

    if (achievementRatio >= 1.0) return 'good';   // 100%以上達成
    if (achievementRatio >= 0.7) return 'fair';   // 70%以上達成
    return 'poor';  // 70%未満
  }
}