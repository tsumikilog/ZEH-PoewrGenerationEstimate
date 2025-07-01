import { SolarIrradianceData } from '../types/index.js';

// NEDOの実データを基にした簡易データベース（地域別年間日射量）
const NEDO_SOLAR_DATA: Record<string, SolarIrradianceData> = {
  // 北海道
  '北海道': { location: '札幌', annual_irradiance: 1200, prefecture: '北海道' },
  '札幌': { location: '札幌', annual_irradiance: 1200, prefecture: '北海道' },
  
  // 東北
  '宮城': { location: '仙台', annual_irradiance: 1300, prefecture: '宮城県' },
  '仙台': { location: '仙台', annual_irradiance: 1300, prefecture: '宮城県' },
  
  // 関東
  '東京': { location: '東京', annual_irradiance: 1400, prefecture: '東京都' },
  '千葉': { location: '千葉', annual_irradiance: 1420, prefecture: '千葉県' },
  '神奈川': { location: '横浜', annual_irradiance: 1380, prefecture: '神奈川県' },
  '横浜': { location: '横浜', annual_irradiance: 1380, prefecture: '神奈川県' },
  '埼玉': { location: 'さいたま', annual_irradiance: 1390, prefecture: '埼玉県' },
  'さいたま': { location: 'さいたま', annual_irradiance: 1390, prefecture: '埼玉県' },
  
  // 中部
  '愛知': { location: '名古屋', annual_irradiance: 1450, prefecture: '愛知県' },
  '名古屋': { location: '名古屋', annual_irradiance: 1450, prefecture: '愛知県' },
  '静岡': { location: '静岡', annual_irradiance: 1500, prefecture: '静岡県' },
  
  // 関西
  '大阪': { location: '大阪', annual_irradiance: 1400, prefecture: '大阪府' },
  '京都': { location: '京都', annual_irradiance: 1380, prefecture: '京都府' },
  '兵庫': { location: '神戸', annual_irradiance: 1420, prefecture: '兵庫県' },
  '神戸': { location: '神戸', annual_irradiance: 1420, prefecture: '兵庫県' },
  
  // 中国・四国
  '広島': { location: '広島', annual_irradiance: 1480, prefecture: '広島県' },
  '香川': { location: '高松', annual_irradiance: 1520, prefecture: '香川県' },
  '高松': { location: '高松', annual_irradiance: 1520, prefecture: '香川県' },
  
  // 九州
  '福岡': { location: '福岡', annual_irradiance: 1350, prefecture: '福岡県' },
  '鹿児島': { location: '鹿児島', annual_irradiance: 1400, prefecture: '鹿児島県' },
  '沖縄': { location: '那覇', annual_irradiance: 1600, prefecture: '沖縄県' },
  '那覇': { location: '那覇', annual_irradiance: 1600, prefecture: '沖縄県' },
};

// デフォルト値（全国平均値）
const DEFAULT_IRRADIANCE = 1400;

export class NedoDataService {
  /**
   * 住所から日射量データを取得
   */
  static getSolarIrradianceByAddress(address: string): SolarIrradianceData {
    // 住所から都道府県名や市区町村名を抽出
    const locationKey = this.extractLocationFromAddress(address);
    
    const data = NEDO_SOLAR_DATA[locationKey];
    if (data) {
      return data;
    }

    // 見つからない場合はデフォルト値を返す
    return {
      location: address,
      annual_irradiance: DEFAULT_IRRADIANCE,
      prefecture: '全国平均'
    };
  }

  /**
   * 住所文字列から地域キーを抽出
   */
  private static extractLocationFromAddress(address: string): string {
    // 都道府県名を抽出
    const prefectures = Object.keys(NEDO_SOLAR_DATA);
    
    for (const prefecture of prefectures) {
      if (address.includes(prefecture)) {
        return prefecture;
      }
    }

    // 特定の市名を抽出
    const cities = ['札幌', '仙台', '横浜', 'さいたま', '名古屋', '神戸', '高松', '那覇'];
    for (const city of cities) {
      if (address.includes(city)) {
        return city;
      }
    }

    return '';
  }

  /**
   * 利用可能な地域一覧を取得
   */
  static getAvailableLocations(): string[] {
    return Object.keys(NEDO_SOLAR_DATA);
  }
}