import type { Handler, NextFn } from '@warp-drive/core/request';
import type { RequestContext } from '@warp-drive/core/types/request';

type MockResponder = (context: {
  params: Record<string, string>;
  body: unknown;
}) => unknown;

/**
 * Test double for the network layer.
 *
 * Rather than intercepting HTTP itself, the returned handler is plugged into
 * the WarpDrive request chain just before `Fetch`: any request it matches is
 * answered from the declared routes, anything else falls through and hits the
 * network as usual.
 *
 * Routes are keyed by `'<METHOD> /path/:param'`.
 */
export function mockApi(routes: Record<string, MockResponder>): Handler {
  const matchers = Object.entries(routes).map(([route, respond]) => {
    const [method, path] = route.split(' ');
    const params: string[] = [];
    const pattern = new RegExp(
      `^${path!.replace(/:(\w+)/g, (_match, name: string) => {
        params.push(name);
        return '([^/]+)';
      })}/?$`
    );

    return { method, pattern, params, respond };
  });

  return {
    request<T>(context: RequestContext, next: NextFn<T>) {
      const { url, method = 'GET', body } = context.request;
      const { pathname } = new URL(url ?? '', 'http://localhost');

      for (const matcher of matchers) {
        if (matcher.method !== method) {
          continue;
        }

        const match = matcher.pattern.exec(pathname);

        if (!match) {
          continue;
        }

        const params = Object.fromEntries(
          matcher.params.map((name, index) => [name, match[index + 1]!])
        );

        return Promise.resolve(
          matcher.respond({
            params,
            body: typeof body === 'string' ? JSON.parse(body) : body,
          }) as T
        );
      }

      return next(context.request);
    },
  };
}
