/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { LogLevel } from '../Framework/src/live2dcubismframework';

/**
 * Sample Appで使用する定数
 */

// Canvas width and height pixel values, or dynamic screen size ('auto').
export const CanvasSize: { width: number; height: number } | 'auto' = 'auto';

// キャンバスの数
export const CanvasNum = 1;

// 画面
export const ViewScale = 1.0;
export const ViewMaxScale = 2.0;
export const ViewMinScale = 0.8;

export const ViewLogicalLeft = -1.0;
export const ViewLogicalRight = 1.0;
export const ViewLogicalBottom = -1.0;
export const ViewLogicalTop = 1.0;

export const ViewLogicalMaxLeft = -2.0;
export const ViewLogicalMaxRight = 2.0;
export const ViewLogicalMaxBottom = -2.0;
export const ViewLogicalMaxTop = 2.0;

// 相対パス
export const ResourcesPath = './Resources/';

// モデルの後ろにある背景の画像ファイル
export const BackImageName = 'back_class_normal.png';

// 歯車
export const GearImageName = 'icon_gear.png';

// 終了ボタン
export const PowerImageName = 'CloseNormal.png';

// モデル定義---------------------------------------------
// モデルを配置したディレクトリ名の配列
// ディレクトリ名とmodel3.jsonの名前を一致させておくこと
export const ModelDir: string[] = [
  'anna',
  'carrie',
  'winni',
  'carlos',
  'charlie',
];
export const ModelDirSize: number = ModelDir.length;

// Set different dialogs for different person
export const ModelDirWords: Record<string, string[]> = {
  "anna" : [
    'Awwwww! (*/ω＼*)',
    'Welcome to My Website!',
    '( •̀ ω •́ )✧',
    'Check out Message Board!',
  ],
  "carrie" : [
    'OMG So cute! (❁´◡`❁)',
    '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧'
  ],
  "winni" : [
    'Whats up?(〜￣▽￣)〜',
    '(〃￣︶￣)人(￣︶￣〃)'
  ],
  "carlos" : [
    'Skibidi (° ͜ʖ °)',
    'Ocho Eggs A Day 🥚'
  ],
  "charlie" : [
    '=￣ω￣=',
    '(　o=^•ェ•)o　┏━┓',
    '( ⓛ ω ⓛ *)',
    'ο(=•ω＜=)ρ⌒☆'
  ]
};


// 外部定義ファイル（json）と合わせる
export const MotionGroupIdle = 'Idle'; // アイドリング
export const MotionGroupTapBody = 'TapBody'; // 体をタップしたとき

// 外部定義ファイル（json）と合わせる
export const HitAreaNameHead = 'Head';
export const HitAreaNameBody = 'Body';

// モーションの優先度定数
export const PriorityNone = 0;
export const PriorityIdle = 1;
export const PriorityNormal = 2;
export const PriorityForce = 3;

// MOC3の整合性検証オプション
export const MOCConsistencyValidationEnable = true;
// motion3.jsonの整合性検証オプション
export const MotionConsistencyValidationEnable = true;

// デバッグ用ログの表示オプション
export const DebugLogEnable = true;
export const DebugTouchLogEnable = false;

// Frameworkから出力するログのレベル設定
export const CubismLoggingLevel: LogLevel = LogLevel.LogLevel_Verbose;

// デフォルトのレンダーターゲットサイズ
export const RenderTargetWidth = 1900;
export const RenderTargetHeight = 1000;
