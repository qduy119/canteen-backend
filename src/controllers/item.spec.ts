import { expressApp } from '@/server/app';
import request from 'supertest';

describe('API for item', async () => {
  const app = expressApp({ port: 3000 });
  test('it should return item by id', async () => {
    const res = await request(app).get('/api/item/1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
  });
});
