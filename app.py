#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Flask, render_template, request, jsonify
import math

app = Flask(__name__)

# 地域別日射量係数（簡易版）
SOLAR_IRRADIANCE_DATA = {
    "北海道": 1200,
    "仙台": 1300,
    "東京": 1300,
    "千葉": 1320,
    "横浜": 1280,
    "名古屋": 1450,
    "大阪": 1400,
    "京都": 1380,
    "神戸": 1420,
    "広島": 1480,
    "福岡": 1450,
    "鹿児島": 1400,
    "沖縄": 1600,
    "札幌": 1200,
    "さいたま": 1290,
    "静岡": 1500,
    "高松": 1520,
    "那覇": 1600
}

DEFAULT_IRRADIANCE = 1350  # デフォルト値

def get_solar_irradiance_by_coordinates(latitude, longitude):
    """緯度経度から日射量係数を取得（より正確な計算）"""
    if not latitude or not longitude:
        return None
    
    # 緯度に基づく基本日射量の計算
    # 日本の緯度範囲: 約24°N（沖縄）〜 45°N（北海道）
    lat = float(latitude)
    
    # 緯度による日射量補正（南ほど多い）
    if lat >= 43:  # 北海道
        base_irradiance = 1200
    elif lat >= 38:  # 東北・北陸
        base_irradiance = 1300
    elif lat >= 35:  # 関東・中部
        base_irradiance = 1400
    elif lat >= 33:  # 関西・中国
        base_irradiance = 1450
    elif lat >= 31:  # 四国・九州
        base_irradiance = 1500
    else:  # 沖縄
        base_irradiance = 1600
    
    return base_irradiance

def get_solar_irradiance_by_address(address, latitude=None, longitude=None):
    """住所と緯度経度から日射量係数を取得（座標優先）"""
    # 緯度経度がある場合は優先的に使用
    if latitude and longitude:
        coordinate_irradiance = get_solar_irradiance_by_coordinates(latitude, longitude)
        if coordinate_irradiance:
            return coordinate_irradiance
    
    # 従来の住所ベース検索
    for region, irradiance in SOLAR_IRRADIANCE_DATA.items():
        if region in address:
            return irradiance
    return DEFAULT_IRRADIANCE

def calculate_solar_generation(address, roof_area, roof_angle, latitude=None, longitude=None):
    """太陽光発電量を計算"""
    # パラメータ
    solar_irradiance = get_solar_irradiance_by_address(address, latitude, longitude)
    system_efficiency = 0.15  # システム効率 15%
    
    # 角度をラジアンに変換
    roof_angle_rad = math.radians(roof_angle)
    
    # 発電量計算
    # 年間発電量 (kWh) = 日射量係数 × 屋根面積 × システム効率 × sin(屋根傾斜角度)
    annual_generation = solar_irradiance * roof_area * system_efficiency * abs(math.sin(roof_angle_rad))
    
    return {
        'annual_generation': int(annual_generation),  # 小数点以下切り捨て
        'solar_irradiance': solar_irradiance,
        'system_efficiency': system_efficiency * 100,  # パーセント表示
        'angle_factor': abs(math.sin(roof_angle_rad))
    }

def judge_zeh_potential(annual_generation, floor_area=None):
    """ZEH基準達成可能性を簡易判定"""
    if annual_generation >= 5000:
        return {"symbol": "◯", "text": "ZEH基準達成可能", "class": "good"}
    elif annual_generation >= 3000:
        return {"symbol": "△", "text": "ZEH基準達成困難", "class": "fair"}
    else:
        return {"symbol": "✕", "text": "ZEH基準達成不可", "class": "poor"}

@app.route('/')
def index():
    """メインページ"""
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    """太陽光発電量計算API"""
    try:
        # フォームデータを取得
        address = request.form['address'].strip()
        roof_area = float(request.form['roof_area'])
        roof_angle = float(request.form['roof_angle'])
        
        # 緯度経度（オプション）
        latitude = request.form.get('latitude')
        longitude = request.form.get('longitude')
        
        if latitude:
            latitude = float(latitude)
        if longitude:
            longitude = float(longitude)
        
        # バリデーション
        if not address:
            return jsonify({'error': '住所を入力してください'}), 400
        if roof_area <= 0:
            return jsonify({'error': '屋根面積は0より大きい値を入力してください'}), 400
        if roof_angle < 0 or roof_angle > 90:
            return jsonify({'error': '屋根の傾斜角度は0〜90度の範囲で入力してください'}), 400
        
        # 計算実行
        result = calculate_solar_generation(address, roof_area, roof_angle, latitude, longitude)
        zeh_judgment = judge_zeh_potential(result['annual_generation'])
        
        # 結果をまとめる
        response = {
            'success': True,
            'input': {
                'address': address,
                'roof_area': roof_area,
                'roof_angle': roof_angle
            },
            'result': {
                'annual_generation': result['annual_generation'],
                'solar_irradiance': result['solar_irradiance'],
                'system_efficiency': result['system_efficiency'],
                'angle_factor': round(result['angle_factor'], 3),
                'zeh_judgment': zeh_judgment
            }
        }
        
        return jsonify(response)
        
    except ValueError as e:
        return jsonify({'error': '数値の形式が正しくありません'}), 400
    except Exception as e:
        app.logger.error(f"計算エラー: {str(e)}")
        return jsonify({'error': 'サーバーエラーが発生しました'}), 500

@app.route('/health')
def health():
    """ヘルスチェック"""
    return jsonify({
        'status': 'OK',
        'service': 'ZEH太陽光発電シミュレーター',
        'version': '1.0.0'
    })

if __name__ == '__main__':
    print("ZEH太陽光発電シミュレーター Starting...")
    print("http://localhost:5000 でアクセスできます")
    app.run(debug=True, host='0.0.0.0', port=5000)