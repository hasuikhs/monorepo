import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const app = express();
const port = process.env.PORT || 3001;
const secretKey = 'secret';

console.log('테스트');

// CORS 설정
app.use(cors());
app.use(express.json());

// 기본 라우트
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Express 서버가 정상적으로 실행 중입니다!' });
});

// 테스트용 API 엔드포인트
app.get('/api/test', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    data: {
      message: '테스트 API가 정상적으로 동작합니다.',
      timestamp: new Date().toISOString()
    }
  });
});

// 페이지네이션 테스트를 위한 더미 데이터 생성
const generateDummyData = (startId: number, count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    id: startId + index,
    title: `아이템 ${ startId + index }`,
    description: `이것은 ${ startId + index }번째 아이템의 설명입니다.`,
    createdAt: new Date(Date.now() - (startId + index) * 86400000).toISOString()
  }));
};

// 지연 함수
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 페이지네이션 API
app.get('/api/items', async (req: Request, res: Response) => {
  // 500ms 지연
  await delay(500);

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const totalItems = 100; // 전체 아이템 수
  const totalPages = Math.ceil(totalItems / limit);
  
  // 현재 페이지의 데이터 생성
  const startId = (page - 1) * limit + 1;
  const endId = Math.min(startId + limit - 1, totalItems);
  const items = generateDummyData(startId, endId - startId + 1);

  res.json({
    status: 'success',
    data: {
      items,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }
  });
});

// 로그인: JWT 발급
app.post('/api/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  // 실제로는 DB 인증을 해야 함
  if (username === 'test' && password === '1234') {
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: '인증 실패' });
  }
});

// JWT 검증 미들웨어
const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1]; // 'Bearer <token>' 형식
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.status(403).json({ message: '토큰이 유효하지 않습니다.' });
      }
      (req as any).user = user;
      next();
    });
  } else {
    res.status(401).json({ message: '토큰이 필요합니다.' });
  }
};

// 보호된 API 예시
app.get('/api/protected', authenticateJWT, (req: Request, res: Response) => {
  res.json({ message: '인증된 사용자만 접근할 수 있습니다.', user: (req as any).user });
});

// 서버 시작
app.listen(port, () => {
  console.info(`서버가 http://localhost:${ port } 에서 실행 중입니다.`);
});
