import cors from 'cors';
import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3001;

// CORS 설정
app.use(cors());

// JSON 파싱을 위한 미들웨어
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
    title: `아이템 ${startId + index}`,
    description: `이것은 ${startId + index}번째 아이템의 설명입니다.`,
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

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
}); 