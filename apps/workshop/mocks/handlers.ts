import { rest } from 'msw';

export const handlers = [
  rest.get('/user', (req, res, ctx) => {
    return res(
      ctx.json({
        firstName: 'Neil',
        lastName: 'Maverick',
      })
    );
  }),
];
