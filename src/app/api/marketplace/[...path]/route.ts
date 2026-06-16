import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/config/env';
import { readSessionState, SESSION_STATE_COOKIE } from '@/lib/auth';
import { toApiEnvelope } from '@/lib/api-client';
import { proxyToBackend } from '@/lib/server-api';
import {
  addCartItem,
  createOrder,
  createVendorProduct,
  deleteVendorProduct,
  getCart,
  getHomeData,
  getOrderDetails,
  getProductCatalog,
  getProductDetails,
  removeCartItem,
  getSearchSuggestions,
  getVendorAnalytics,
  getVendorDashboard,
  getVendorDetails,
  getVendorDirectory,
  getVendorPayoutData,
  initializePayment,
  listBuyerOrders,
  listCategories,
  listNotifications,
  listVendorOrders,
  listVendorProducts,
  markNotificationAsRead,
  searchMarketplace,
  submitVendorVerification,
  updateCartItem,
  updateVendorLocation,
  updateVendorOrderStatus,
  updateVendorProduct,
  upsertVendorForUser,
  withdrawVendorBalance
} from '@/modules/mock-marketplace/store';

function response<T>(data: T, status = 200) {
  return NextResponse.json(toApiEnvelope(data), { status });
}

function error(message: string, status = 400, code = 'BAD_REQUEST') {
  return NextResponse.json(
    toApiEnvelope<null>(null, undefined, {
      code,
      message
    }),
    { status }
  );
}

function getSessionUserId(request: NextRequest) {
  return readSessionState(request.cookies.get(SESSION_STATE_COOKIE)?.value)?.user.id ?? null;
}

function requireUserId(request: NextRequest) {
  const userId = getSessionUserId(request);

  if (!userId) {
    throw new Error('UNAUTHORIZED');
  }

  return userId;
}

function unauthorized() {
  return error('You must be signed in to continue.', 401, 'UNAUTHORIZED');
}

function proxyPath(request: NextRequest, path: string[]) {
  const nestedPath = path.join('/');
  return `/marketplace/${nestedPath}${request.nextUrl.search}`;
}

export async function GET(
  request: NextRequest,
  { params }: Readonly<{ params: Promise<{ path: string[] }> }>
) {
  const { path } = await params;
  
  // ALWAYS USE MOCKS FOR MARKETPLACE ENDPOINTS UNTIL BACKEND IS READY
  // if (!env.NEXT_PUBLIC_ENABLE_MOCKS) {
  //   return proxyToBackend(request, proxyPath(request, path));
  // }

  const [resource, identifier] = path;
  const query = request.nextUrl.searchParams;

  try {
    if (resource === 'home') {
      return response(getHomeData());
    }

    if (resource === 'categories') {
      return response(listCategories());
    }

    if (resource === 'vendors' && !identifier) {
      return response(
        getVendorDirectory({
          state: query.get('state') ?? undefined,
          category: query.get('category') ?? undefined,
          sort: query.get('sort') ?? undefined
        })
      );
    }

    if (resource === 'vendors' && identifier) {
      const data = getVendorDetails(identifier);
      return data ? response(data) : error('Vendor not found.', 404, 'NOT_FOUND');
    }

    if (resource === 'products' && !identifier) {
      return response(
        getProductCatalog({
          q: query.get('q') ?? undefined,
          category: query.get('category') ?? undefined,
          state: query.get('state') ?? undefined,
          vendorId: query.get('vendorId') ?? undefined,
          sort: query.get('sort') ?? undefined
        })
      );
    }

    if (resource === 'products' && identifier) {
      const data = getProductDetails(identifier);
      return data ? response(data) : error('Product not found.', 404, 'NOT_FOUND');
    }

    if (resource === 'search' && identifier === 'suggestions') {
      return response(getSearchSuggestions(query.get('q') ?? ''));
    }

    if (resource === 'search') {
      return response(
        searchMarketplace({
          q: query.get('q') ?? undefined,
          category: query.get('category') ?? undefined,
          state: query.get('state') ?? undefined,
          verifiedOnly: query.get('verifiedOnly') === 'true'
        })
      );
    }

    if (resource === 'cart') {
      return response(getCart(requireUserId(request)));
    }

    if (resource === 'orders' && !identifier) {
      return response(listBuyerOrders(requireUserId(request)));
    }

    if (resource === 'orders' && identifier) {
      const order = getOrderDetails(requireUserId(request), identifier);
      return order ? response(order) : error('Order not found.', 404, 'NOT_FOUND');
    }

    if (resource === 'notifications') {
      return response(listNotifications(requireUserId(request)));
    }

    if (resource === 'vendor' && identifier === 'dashboard') {
      const data = getVendorDashboard(requireUserId(request));
      return data ? response(data) : error('Vendor dashboard unavailable.', 404, 'NOT_FOUND');
    }

    if (resource === 'vendor' && identifier === 'products') {
      return response(listVendorProducts(requireUserId(request)));
    }

    if (resource === 'vendor' && identifier === 'orders') {
      return response(listVendorOrders(requireUserId(request)));
    }

    if (resource === 'vendor' && identifier === 'payouts') {
      const data = getVendorPayoutData(requireUserId(request));
      return data ? response(data) : error('Payout data unavailable.', 404, 'NOT_FOUND');
    }

    if (resource === 'vendor' && identifier === 'analytics') {
      const data = getVendorAnalytics(requireUserId(request));
      return data ? response(data) : error('Analytics unavailable.', 404, 'NOT_FOUND');
    }

    return error('Resource not found.', 404, 'NOT_FOUND');
  } catch (caught) {
    if (caught instanceof Error && caught.message === 'UNAUTHORIZED') {
      return unauthorized();
    }

    return error(caught instanceof Error ? caught.message : 'Request failed.', 500, 'SERVER_ERROR');
  }
}

export async function POST(
  request: NextRequest,
  { params }: Readonly<{ params: Promise<{ path: string[] }> }>
) {
  const { path } = await params;

  // ALWAYS USE MOCKS FOR MARKETPLACE ENDPOINTS UNTIL BACKEND IS READY
  // if (!env.NEXT_PUBLIC_ENABLE_MOCKS) {
  //   return proxyToBackend(request, proxyPath(request, path));
  // }

  const [resource, identifier, nested] = path;

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    if (resource === 'cart' && identifier === 'items') {

    if (resource === 'vendor' && identifier === 'products') {
      return response(
        createVendorProduct(requireUserId(request), {
          name: String(body.name ?? ''),
          description: String(body.description ?? ''),
          category: String(body.category ?? ''),
          price: Number(body.price ?? 0),
          stockQuantity: Number(body.stockQuantity ?? 0)
        }),
        201
      );
    }

    if (resource === 'vendor' && identifier === 'payouts') {
      return response(withdrawVendorBalance(requireUserId(request), Number(body.amount ?? 0)), 201);
    }

    return error('Resource not found.', 404, 'NOT_FOUND');
  } catch (caught) {
    if (caught instanceof Error && caught.message === 'UNAUTHORIZED') {
      return unauthorized();
    }

    return error(caught instanceof Error ? caught.message : 'Request failed.', 400, 'SERVER_ERROR');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: Readonly<{ params: Promise<{ path: string[] }> }>
) {
  const { path } = await params;

  // ALWAYS USE MOCKS FOR MARKETPLACE ENDPOINTS UNTIL BACKEND IS READY
  // if (!env.NEXT_PUBLIC_ENABLE_MOCKS) {
  //   return proxyToBackend(request, proxyPath(request, path));
  // }

  const [resource, identifier, nested] = path;

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    if (resource === 'cart' && identifier === 'items' && nested) {
      return response(
        updateCartItem(requireUserId(request), nested, {
          quantity: typeof body.quantity === 'number' ? body.quantity : undefined,
          selectedVariantIds: Array.isArray(body.selectedVariantIds) ? body.selectedVariantIds.map(String) : undefined
        })
      );
    }

    if (resource === 'notifications' && identifier) {
      const notification = markNotificationAsRead(requireUserId(request), identifier);
      return notification
        ? response(notification)
        : error('Notification not found.', 404, 'NOT_FOUND');
    }

    if (resource === 'vendor' && identifier === 'products' && nested) {
      return response(
        updateVendorProduct(requireUserId(request), nested, {
          name: typeof body.name === 'string' ? body.name : undefined,
          description: typeof body.description === 'string' ? body.description : undefined,
          category: typeof body.category === 'string' ? body.category : undefined,
          price: typeof body.price === 'number' ? body.price : undefined,
          stockQuantity: typeof body.stockQuantity === 'number' ? body.stockQuantity : undefined
        })
      );
    }

    if (resource === 'vendor' && identifier === 'orders' && nested) {
      return response(
        updateVendorOrderStatus(requireUserId(request), nested, String(body.status ?? 'PENDING') as never)
      );
    }

    return error('Resource not found.', 404, 'NOT_FOUND');
  } catch (caught) {
    if (caught instanceof Error && caught.message === 'UNAUTHORIZED') {
      return unauthorized();
    }

    return error(caught instanceof Error ? caught.message : 'Request failed.', 400, 'SERVER_ERROR');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: Readonly<{ params: Promise<{ path: string[] }> }>
) {
  const { path } = await params;

  // ALWAYS USE MOCKS FOR MARKETPLACE ENDPOINTS UNTIL BACKEND IS READY
  // if (!env.NEXT_PUBLIC_ENABLE_MOCKS) {
  //   return proxyToBackend(request, proxyPath(request, path));
  // }

  const [resource, identifier, nested] = path;

  try {
    if (resource === 'cart' && identifier === 'items' && nested) {
      return response(removeCartItem(requireUserId(request), nested));
    }

    if (resource === 'vendor' && identifier === 'products' && nested) {
      deleteVendorProduct(requireUserId(request), nested);
      return response({ success: true });
    }

    return error('Resource not found.', 404, 'NOT_FOUND');
  } catch (caught) {
    if (caught instanceof Error && caught.message === 'UNAUTHORIZED') {
      return unauthorized();
    }

    return error(caught instanceof Error ? caught.message : 'Request failed.', 400, 'SERVER_ERROR');
  }
}
