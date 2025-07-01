import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  // デフォルトエラーレスポンス
  let statusCode = 500;
  let message = 'サーバー内部エラーが発生しました';

  // エラータイプによる分岐
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'リクエストデータが正しくありません';
  } else if (error.name === 'TypeError') {
    statusCode = 400;
    message = 'データ形式が正しくありません';
  }

  res.status(statusCode).json({
    error: message,
    timestamp: new Date().toISOString(),
    path: req.path
  });
};