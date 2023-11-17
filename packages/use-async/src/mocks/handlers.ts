import { http, HttpResponse } from 'msw';

export const handlers = [
  http.all('http://network-error.com', () => {
    return HttpResponse.error();
  }),

  http.all('http://200.com', () => {
    return HttpResponse.json({ data: 'success' });
  }),

  http.all('http://500-error.com', () => {
    return HttpResponse.json(null, { status: 500 });
  }),
];
