import { Router } from 'express';
import { z } from 'zod';
import { CalculationService } from '../services/calculationService.js';
import { SimulationInput } from '../types/index.js';

const router = Router();

// バリデーションスキーマ
const simulationInputSchema = z.object({
  address: z.string().min(1, '住所を入力してください'),
  roof_area: z.number().min(0.1, '屋根面積は0.1以上で入力してください'),
  roof_angle: z.number().min(0).max(90, '傾斜角度は0〜90度の範囲で入力してください'),
  floor_area: z.number().optional()
});

/**
 * 太陽光発電シミュレーション実行
 */
router.post('/simulate', async (req, res, next) => {
  try {
    // リクエストデータのバリデーション
    const validationResult = simulationInputSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'バリデーションエラー',
        details: validationResult.error.errors
      });
    }

    const input: SimulationInput = validationResult.data;

    // シミュレーション実行
    const result = CalculationService.calculateSolarGeneration(input);

    // 結果を返す
    res.json(result);

  } catch (error) {
    next(error);
  }
});

/**
 * 利用可能な地域一覧取得
 */
router.get('/locations', (req, res) => {
  try {
    const locations = [
      '北海道', '宮城県', '東京都', '千葉県', '神奈川県', '埼玉県',
      '愛知県', '静岡県', '大阪府', '京都府', '兵庫県', 
      '広島県', '香川県', '福岡県', '鹿児島県', '沖縄県'
    ];

    res.json({ locations });
  } catch (error) {
    res.status(500).json({ error: '地域データの取得に失敗しました' });
  }
});

/**
 * ヘルスチェック
 */
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'ZEH Power Generation Estimation API',
    timestamp: new Date().toISOString() 
  });
});

export { router as simulationRouter };