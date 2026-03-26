/**
 * @jest-environment node
 */
import { GET } from '@/app/readyz/route';

describe('GET /readyz', () => {
  it('200 반환', async () => {
    const response = GET();
    expect(response.status).toBe(200);
  });

  it('{ status: "ok" } 반환', async () => {
    const response = GET();
    const body = await response.json();
    expect(body).toEqual({ status: 'ok' });
  });
});
