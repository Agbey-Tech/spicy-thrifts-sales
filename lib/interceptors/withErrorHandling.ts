import { NextRequest, NextResponse } from "next/server";

type RouteHandler<TParams = unknown> = (
  req: NextRequest,
  context: { params: TParams },
) => Promise<Response> | Response;

function resolveStatus(message: string) {
  switch (message) {
    case "AUTH_REQUIRED":
    case "UNAUTHORIZED":
      return 401;
    case "FORBIDDEN":
      return 403;
    case "NOT_FOUND":
      return 404;
    case "VALIDATION_ERROR":
      return 422;
    default:
      return 400;
  }
}

export function withErrorHandling<TParams = unknown>(
  handler: RouteHandler<TParams>,
): RouteHandler<TParams> {
  return async (req: NextRequest, context: { params: TParams }) => {
    try {
      return await handler(req, context);
    } catch (error: any) {
      const message = error?.message || "Unknown error";
      const status = resolveStatus(message);

      return NextResponse.json({ success: false, error: message }, { status });
    }
  };
}
