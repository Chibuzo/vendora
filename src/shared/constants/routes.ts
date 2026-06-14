export const routes = {
  public: {
    home: '/',
    vendors: '/vendors',
    vendorDetail: (slug: string) => `/vendors/${slug}`,
    products: '/products',
    productDetail: (slug: string) => `/products/${slug}`,
    search: '/search'
  },
  auth: {
    login: '/login',
    signup: '/signup',
    forgotPassword: '/forgot-password'
  },
  onboarding: {
    root: '/onboarding',
    role: '/onboarding/role',
    vendorBusiness: '/onboarding/vendor/business',
    vendorLocation: '/onboarding/vendor/location',
    vendorStorefront: '/onboarding/vendor/storefront',
    vendorFirstProduct: '/onboarding/vendor/first-product',
    vendorSetup: '/onboarding/vendor/business',
    vendorVerification: '/vendor/verification',
    buyerVerification: '/onboarding/buyer/verification'
  },
  buyer: {
    home: '/home',
    cart: '/cart',
    checkout: '/checkout',
    orders: '/orders',
    orderDetail: (id: string) => `/orders/${id}`,
    account: '/account'
  },
  vendor: {
    dashboard: '/vendor/dashboard',
    products: '/vendor/products',
    newProduct: '/vendor/products/new',
    editProduct: (id: string) => `/vendor/products/${id}/edit`,
    orders: '/vendor/orders',
    payouts: '/vendor/payouts',
    analytics: '/vendor/analytics',
    settings: '/vendor/settings',
    verification: '/vendor/verification'
  },
  shared: {
    notifications: '/notifications',
    profile: '/profile'
  },
  admin: {
    dashboard: '/admin/dashboard'
  }
} as const;

export const publicNavigationRoutes = [
  routes.public.home,
  routes.public.vendors,
  routes.public.products,
  routes.public.search
] as const;

export const buyerProtectedRoutes = [
  routes.buyer.home,
  routes.buyer.cart,
  routes.buyer.checkout,
  routes.buyer.orders,
  routes.buyer.account
] as const;

export const vendorProtectedRoutes = ['/vendor'] as const;

export const sharedProtectedRoutes = [routes.shared.notifications, routes.shared.profile] as const;
