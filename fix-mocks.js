const fs = require('fs');

// Fix store.ts
const file = 'c:/vendora/src/modules/mock-marketplace/store.ts';
let content = fs.readFileSync(file, 'utf8');

const globalDecl = `
const globalForMockStore = globalThis as unknown as {
    __vendoraMockUsers: Map<string, MarketplaceUser>;
    __vendoraMockVendors: Map<string, MarketplaceVendor>;
    __vendoraMockProducts: Map<string, MarketplaceProduct>;
    __vendoraMockCarts: Map<string, CartState>;
    __vendoraMockOrders: Map<string, OrderRecord>;
    __vendoraMockNotifications: Map<string, NotificationRecord>;
    __vendoraMockVendorBalances: Map<string, VendorBalanceRecord>;
    __vendoraMockPayouts: Map<string, PayoutRecord>;
    __vendoraMockTransactions: Map<string, TransactionRecord>;
};
`;

content = content.replace('const users = new Map<string, MarketplaceUser>([', globalDecl + '\nconst users = globalForMockStore.__vendoraMockUsers ?? new Map<string, MarketplaceUser>([');
content = content.replace('const vendors = new Map<string, MarketplaceVendor>([', 'const vendors = globalForMockStore.__vendoraMockVendors ?? new Map<string, MarketplaceVendor>([');
content = content.replace('const products = new Map<string, MarketplaceProduct>([', 'const products = globalForMockStore.__vendoraMockProducts ?? new Map<string, MarketplaceProduct>([');
content = content.replace('const carts = new Map<string, CartState>([', 'const carts = globalForMockStore.__vendoraMockCarts ?? new Map<string, CartState>([');
content = content.replace('const orders = new Map<string, OrderRecord>([', 'const orders = globalForMockStore.__vendoraMockOrders ?? new Map<string, OrderRecord>([');
content = content.replace('const notifications = new Map<string, NotificationRecord>([', 'const notifications = globalForMockStore.__vendoraMockNotifications ?? new Map<string, NotificationRecord>([');
content = content.replace('const vendorBalances = new Map<string, VendorBalanceRecord>([', 'const vendorBalances = globalForMockStore.__vendoraMockVendorBalances ?? new Map<string, VendorBalanceRecord>([');
content = content.replace('const payouts = new Map<string, PayoutRecord>([', 'const payouts = globalForMockStore.__vendoraMockPayouts ?? new Map<string, PayoutRecord>([');
content = content.replace('const transactions = new Map<string, TransactionRecord>([', 'const transactions = globalForMockStore.__vendoraMockTransactions ?? new Map<string, TransactionRecord>([');

const assigns = `
if (process.env.NODE_ENV !== 'production') {
    globalForMockStore.__vendoraMockUsers = users;
    globalForMockStore.__vendoraMockVendors = vendors;
    globalForMockStore.__vendoraMockProducts = products;
    globalForMockStore.__vendoraMockCarts = carts;
    globalForMockStore.__vendoraMockOrders = orders;
    globalForMockStore.__vendoraMockNotifications = notifications;
    globalForMockStore.__vendoraMockVendorBalances = vendorBalances;
    globalForMockStore.__vendoraMockPayouts = payouts;
    globalForMockStore.__vendoraMockTransactions = transactions;
}
`;

content = content.replace(/\]\);\s*function clone<T>\(value: T\): T \{/, ']);\n' + assigns + '\nfunction clone<T>(value: T): T {');

fs.writeFileSync(file, content);

// Fix auth-service.ts
const file2 = 'c:/vendora/src/modules/auth/services/auth-service.ts';
let content2 = fs.readFileSync(file2, 'utf8');

const globalDecl2 = `
const globalForAuthMock = globalThis as unknown as {
    __vendoraMockOtpChallenges: Map<string, MockOtpChallengeRecord>;
    __vendoraMockRefreshSessions: Map<string, MockRefreshSessionRecord>;
};
`;

content2 = content2.replace('const mockOtpChallenges = new Map<string, MockOtpChallengeRecord>();', globalDecl2 + '\nconst mockOtpChallenges = globalForAuthMock.__vendoraMockOtpChallenges ?? new Map<string, MockOtpChallengeRecord>();');
content2 = content2.replace('const mockRefreshSessions = new Map<string, MockRefreshSessionRecord>();', 'const mockRefreshSessions = globalForAuthMock.__vendoraMockRefreshSessions ?? new Map<string, MockRefreshSessionRecord>();');

const assigns2 = `
if (process.env.NODE_ENV !== 'production') {
    globalForAuthMock.__vendoraMockOtpChallenges = mockOtpChallenges;
    globalForAuthMock.__vendoraMockRefreshSessions = mockRefreshSessions;
}
`;

content2 = content2.replace('const mockRefreshSessions = globalForAuthMock.__vendoraMockRefreshSessions ?? new Map<string, MockRefreshSessionRecord>();', 'const mockRefreshSessions = globalForAuthMock.__vendoraMockRefreshSessions ?? new Map<string, MockRefreshSessionRecord>();\n' + assigns2);

fs.writeFileSync(file2, content2);

console.log('Done!');
