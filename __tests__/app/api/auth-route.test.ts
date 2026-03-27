/**
 * @jest-environment node
 */

const mockGetAuth = jest.fn(() => ({ api: {} }));
const mockGet = jest.fn(async () => new Response(null, { status: 204 }));
const mockPost = jest.fn(async () => new Response(null, { status: 204 }));
const mockToNextJsHandler = jest.fn(() => ({
  GET: mockGet,
  POST: mockPost,
}));

jest.mock('@/backend/infrastructure/auth', () => ({
  getAuth: mockGetAuth,
}));

jest.mock('better-auth/next-js', () => ({
  toNextJsHandler: mockToNextJsHandler,
}));

describe('auth route', () => {
  beforeEach(() => {
    jest.resetModules();
    mockGetAuth.mockClear();
    mockGet.mockClear();
    mockPost.mockClear();
    mockToNextJsHandler.mockClear();
  });

  it('모듈 로드 시 Next.js 핸들러를 1회만 생성한다', async () => {
    const route = await import('@/app/api/auth/[...all]/route');
    const getRequest = new Request('http://localhost/api/auth/session');
    const postRequest = new Request('http://localhost/api/auth/sign-in', {
      method: 'POST',
    });

    await route.GET(getRequest);
    await route.POST(postRequest);

    expect(mockGetAuth).toHaveBeenCalledTimes(1);
    expect(mockToNextJsHandler).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith(getRequest);
    expect(mockPost).toHaveBeenCalledWith(postRequest);
  });
});
