#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Flask, render_template, request, jsonify
import math
import os

app = Flask(__name__, template_folder='../templates')

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

def get_solar_irradiance_by_address(address):
    """住所から日射量係数を取得"""
    for region, irradiance in SOLAR_IRRADIANCE_DATA.items():
        if region in address:
            return irradiance
    return DEFAULT_IRRADIANCE

def calculate_solar_generation(address, roof_area, roof_angle):
    """太陽光発電量を計算"""
    # パラメータ
    solar_irradiance = get_solar_irradiance_by_address(address)
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
        
        # バリデーション
        if not address:
            return jsonify({'error': '住所を入力してください'}), 400
        if roof_area <= 0:
            return jsonify({'error': '屋根面積は0より大きい値を入力してください'}), 400
        if roof_angle < 0 or roof_angle > 90:
            return jsonify({'error': '屋根の傾斜角度は0〜90度の範囲で入力してください'}), 400
        
        # 計算実行
        result = calculate_solar_generation(address, roof_area, roof_angle)
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

# Vercel用のハンドラー
def handler(request):
    return app(request.environ, lambda status, headers: None)

if __name__ == '__main__':
    app.run(debug=True)