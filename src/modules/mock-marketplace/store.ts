import { NotificationType } from '@/shared/api/generated/model/notificationType';
import { OrderStatus } from '@/shared/api/generated/model/orderStatus';
import { VerificationStatus } from '@/shared/api/generated/model/verificationStatus';
import { VendorStatus } from '@/shared/api/generated/model/vendorStatus';
import type { SessionUser, UserRole } from '@/lib/auth';

type AuthProvider = 'email' | 'phone';
type ProductVariant = {
    id: string;
    name: string;
    priceDelta: number;
};

type MarketplaceUser = {
    id: string;
    email?: string;
    phone?: string;
    password?: string;
    fullName: string;
    role: 'BUYER' | 'VENDOR' | 'ADMIN';
    authProvider: AuthProvider;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
};

type MarketplaceVendor = {
    id: string;
    ownerUserId?: string;
    slug: string;
    businessName: string;
    description: string;
    phone: string;
    category: string;
    status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
    verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
    trustScore: number;
    rating: number;
    totalOrders: number;
    location: {
        id: string;
        state: string;
        city: string;
        addressLine1: string;
    } | null;
    createdAt: string;
    updatedAt: string;
    cacNumber?: string;
};

type MarketplaceProduct = {
    id: string;
    vendorId: string;
    slug: string;
    name: string;
    description: string;
    category: {
        id: string;
        name: string;
        slug: string;
    };
    price: number;
    currency: string;
    stockQuantity: number;
    tags: string[];
    isActive: boolean;
    isAvailable: boolean;
    images: Array<{ id: string; url: string }>;
    variants: ProductVariant[];
    createdAt: string;
    updatedAt: string;
    featured: boolean;
};

type CartItem = {
    id: string;
    productId: string;
    quantity: number;
    selectedVariantIds: string[];
};

type CartState = {
    id: string;
    currency: string;
    items: CartItem[];
    updatedAt: string;
};

type OrderRecord = {
    id: string;
    buyerId: string;
    vendorId: string;
    status: keyof typeof OrderStatus;
    totalAmount: number;
    currency: string;
    createdAt: string;
    deliveryAddress: string;
    items: CartItem[];
    timeline: Array<{
        id: string;
        title: string;
        status: keyof typeof OrderStatus;
        completedAt?: string;
    }>;
    paymentReference?: string;
};

type NotificationRecord = {
    id: string;
    userId: string;
    type: keyof typeof NotificationType;
    title: string;
    body: string;
    isRead: boolean;
    createdAt: string;
};

type PayoutRecord = {
    id: string;
    vendorId: string;
    amount: number;
    currency: string;
    status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
    reference: string;
    initiatedAt: string;
};

type VendorBalanceRecord = {
    vendorId: string;
    availableBalance: number;
    pendingBalance: number;
    currency: string;
};

type TransactionRecord = {
    id: string;
    vendorId: string;
    type: 'ORDER' | 'PAYOUT';
    amount: number;
    currency: string;
    status: 'SUCCESS' | 'PENDING';
    reference: string;
    createdAt: string;
};

const now = Date.now();

const categories = [
    { id: 'cat-energy', name: 'Energy', slug: 'energy' },
    { id: 'cat-packaging', name: 'Packaging', slug: 'packaging' },
    { id: 'cat-operations', name: 'Operations', slug: 'operations' },
    { id: 'cat-logistics', name: 'Logistics', slug: 'logistics' },
    { id: 'cat-analytics', name: 'Analytics', slug: 'analytics' }
] as const;

const users = new Map<string, MarketplaceUser>([
    [
        'buyer_001',
        {
            id: 'buyer_001',
            email: 'buyer@vendora.app',
            password: 'password123',
            fullName: 'Marketplace Buyer',
            role: 'BUYER',
            authProvider: 'email',
            isVerified: true,
            createdAt: new Date(now - 1000 * 60 * 60 * 24 * 90).toISOString(),
            updatedAt: new Date(now - 1000 * 60 * 60 * 4).toISOString()
        }
    ],
    [
        'vendor_001',
        {
            id: 'vendor_001',
            email: 'vendor@vendora.app',
            password: 'password123',
            fullName: 'Amina Balogun',
            role: 'VENDOR',
            authProvider: 'email',
            isVerified: true,
            createdAt: new Date(now - 1000 * 60 * 60 * 24 * 120).toISOString(),
            updatedAt: new Date(now - 1000 * 60 * 60 * 2).toISOString()
        }
    ],
    [
        'admin_001',
        {
            id: 'admin_001',
            email: 'admin@vendora.app',
            password: 'password123',
            fullName: 'Vendora Admin',
            role: 'ADMIN',
            authProvider: 'email',
            isVerified: true,
            createdAt: new Date(now - 1000 * 60 * 60 * 24 * 180).toISOString(),
            updatedAt: new Date(now - 1000 * 60 * 45).toISOString()
        }
    ]
]);

const vendors = new Map<string, MarketplaceVendor>([
    [
        'vendor_store_1',
        {
            id: 'vendor_store_1',
            ownerUserId: 'vendor_001',
            slug: 'greengrid-supplies',
            businessName: 'GreenGrid Supplies',
            description:
                'Solar kits, backup power bundles, and installation-ready accessories for urban households.',
            phone: '+2348012340001',
            category: 'Energy',
            status: VendorStatus.ACTIVE,
            verificationStatus: VerificationStatus.VERIFIED,
            trustScore: 94,
            rating: 4.8,
            totalOrders: 328,
            location: {
                id: 'vendor_location_1',
                state: 'Lagos',
                city: 'Ikeja',
                addressLine1: '12 Allen Avenue, Ikeja'
            },
            createdAt: new Date(now - 1000 * 60 * 60 * 24 * 120).toISOString(),
            updatedAt: new Date(now - 1000 * 60 * 30).toISOString(),
            cacNumber: 'RC-4455602'
        }
    ],
    [
        'vendor_store_2',
        {
            id: 'vendor_store_2',
            slug: 'parcel-atelier',
            businessName: 'Parcel Atelier',
            description:
                'Packaging systems for premium brands that want consistent unboxing and low breakage.',
            phone: '+2348099100002',
            category: 'Packaging',
            status: VendorStatus.ACTIVE,
            verificationStatus: VerificationStatus.VERIFIED,
            trustScore: 89,
            rating: 4.5,
            totalOrders: 174,
            location: {
                id: 'vendor_location_2',
                state: 'FCT',
                city: 'Abuja',
                addressLine1: '8 Gimbiya Street, Wuse 2'
            },
            createdAt: new Date(now - 1000 * 60 * 60 * 24 * 60).toISOString(),
            updatedAt: new Date(now - 1000 * 60 * 45).toISOString(),
            cacNumber: 'RC-9021120'
        }
    ],
    [
        'vendor_store_3',
        {
            id: 'vendor_store_3',
            slug: 'stockpilot-tech',
            businessName: 'StockPilot Tech',
            description:
                'Barcode scanners, POS hardware, and warehouse tooling for fast-moving inventory teams.',
            phone: '+2348027700003',
            category: 'Operations',
            status: VendorStatus.ACTIVE,
            verificationStatus: VerificationStatus.PENDING,
            trustScore: 92,
            rating: 4.6,
            totalOrders: 221,
            location: {
                id: 'vendor_location_3',
                state: 'Rivers',
                city: 'Port Harcourt',
                addressLine1: '17 Aba Road, Port Harcourt'
            },
            createdAt: new Date(now - 1000 * 60 * 60 * 24 * 80).toISOString(),
            updatedAt: new Date(now - 1000 * 60 * 65).toISOString()
        }
    ]
]);

const products = new Map<string, MarketplaceProduct>([
    [
        'prod_1',
        {
            id: 'prod_1',
            vendorId: 'vendor_store_1',
            slug: 'solar-backup-kit',
            name: 'Solar Backup Kit',
            description: 'Reliable home backup power package for urban households.',
            category: categories[0],
            price: 280000,
            currency: 'NGN',
            stockQuantity: 14,
            tags: ['solar', 'backup', 'home'],
            isActive: true,
            isAvailable: true,
            images: [
                {
                    id: 'prod_1_img_1',
                    url: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=900&q=80'
                }
            ],
            variants: [
                { id: 'prod_1_var_1', name: '3-panel set', priceDelta: 0 },
                { id: 'prod_1_var_2', name: '5-panel set', priceDelta: 95000 }
            ],
            createdAt: new Date(now - 1000 * 60 * 60 * 24 * 18).toISOString(),
            updatedAt: new Date(now - 1000 * 60 * 60 * 6).toISOString(),
            featured: true
        }
    ],
    [
        'prod_2',
        {
            id: 'prod_2',
            vendorId: 'vendor_store_2',
            slug: 'premium-packaging-set',
            name: 'Premium Packaging Set',
            description: 'Elevated packaging suite for fashion, gifting, and premium fulfillment.',
            category: categories[1],
            price: 25000,
            currency: 'NGN',
            stockQuantity: 120,
            tags: ['packaging', 'premium', 'retail'],
            isActive: true,
            isAvailable: true,
            images: [
                {
                    id: 'prod_2_img_1',
                    url: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80'
                }
            ],
            variants: [
                { id: 'prod_2_var_1', name: '50-piece pack', priceDelta: 0 },
                { id: 'prod_2_var_2', name: '100-piece pack', priceDelta: 16000 }
            ],
            createdAt: new Date(now - 1000 * 60 * 60 * 24 * 12).toISOString(),
            updatedAt: new Date(now - 1000 * 60 * 60 * 5).toISOString(),
            featured: false
        }
    ],
    [
        'prod_3',
        {
            id: 'prod_3',
            vendorId: 'vendor_store_3',
            slug: 'warehouse-barcode-scanner',
            name: 'Warehouse Barcode Scanner',
            description: 'Fast scan throughput with rugged casing for heavy-duty inventory teams.',
            category: categories[2],
            price: 67000,
            currency: 'NGN',
            stockQuantity: 37,
            tags: ['warehouse', 'scanner', 'inventory'],
            isActive: true,
            isAvailable: true,
            images: [
                {
                    id: 'prod_3_img_1',
                    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80'
                }
            ],
            variants: [
                { id: 'prod_3_var_1', name: 'Standard', priceDelta: 0 },
                { id: 'prod_3_var_2', name: 'Extended battery', priceDelta: 12000 }
            ],
            createdAt: new Date(now - 1000 * 60 * 60 * 24 * 8).toISOString(),
            updatedAt: new Date(now - 1000 * 60 * 60 * 4).toISOString(),
            featured: true
        }
    ],
    [
        'prod_4',
        {
            id: 'prod_4',
            vendorId: 'vendor_store_1',
            slug: 'cold-chain-storage-box',
            name: 'Cold Chain Storage Box',
            description: 'Temperature-controlled container for last-mile food and pharma delivery.',
            category: categories[3],
            price: 142000,
            currency: 'NGN',
            stockQuantity: 10,
            tags: ['logistics', 'cold-chain', 'delivery'],
            isActive: true,
            isAvailable: true,
            images: [
                {
                    id: 'prod_4_img_1',
                    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80'
                }
            ],
            variants: [
                { id: 'prod_4_var_1', name: '120L', priceDelta: 0 },
                { id: 'prod_4_var_2', name: '240L', priceDelta: 54000 }
            ],
            createdAt: new Date(now - 1000 * 60 * 60 * 24 * 6).toISOString(),
            updatedAt: new Date(now - 1000 * 60 * 60 * 3).toISOString(),
            featured: true
        }
    ],
    [
        'prod_5',
        {
            id: 'prod_5',
            vendorId: 'vendor_store_1',
            slug: 'inventory-demand-forecast-pack',
            name: 'Inventory Demand Forecast Pack',
            description: 'Decision support dataset and dashboard template for weekly replenishment.',
            category: categories[4],
            price: 49000,
            currency: 'NGN',
            stockQuantity: 65,
            tags: ['analytics', 'forecasting', 'inventory'],
            isActive: true,
            isAvailable: true,
            images: [
                {
                    id: 'prod_5_img_1',
                    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80'
                }
            ],
            variants: [
                { id: 'prod_5_var_1', name: 'Starter', priceDelta: 0 },
                { id: 'prod_5_var_2', name: 'Team access', priceDelta: 18000 }
            ],
            createdAt: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
            updatedAt: new Date(now - 1000 * 60 * 60 * 2).toISOString(),
            featured: false
        }
    ]
]);

const carts = new Map<string, CartState>([
    [
        'buyer_001',
        {
            id: 'cart_buyer_001',
            currency: 'NGN',
            items: [
                {
                    id: 'cart_item_1',
                    productId: 'prod_1',
                    quantity: 1,
                    selectedVariantIds: ['prod_1_var_1']
                },
                {
                    id: 'cart_item_2',
                    productId: 'prod_2',
                    quantity: 2,
                    selectedVariantIds: ['prod_2_var_1']
                }
            ],
            updatedAt: new Date(now - 1000 * 60 * 35).toISOString()
        }
    ]
]);

const orders = new Map<string, OrderRecord>([
    [
        'ord_1024',
        {
            id: 'ord_1024',
            buyerId: 'buyer_001',
            vendorId: 'vendor_store_1',
            status: OrderStatus.DELIVERED,
            totalAmount: 280000,
            currency: 'NGN',
            createdAt: new Date(now - 1000 * 60 * 60 * 24 * 10).toISOString(),
            deliveryAddress: '24 Admiralty Way, Lekki Phase 1, Lagos',
            items: [
                {
                    id: 'ord_1024_item_1',
                    productId: 'prod_1',
                    quantity: 1,
                    selectedVariantIds: ['prod_1_var_1']
                }
            ],
            timeline: [
                {
                    id: 'ord_1024_t_1',
                    title: 'Order placed',
                    status: OrderStatus.PENDING,
                    completedAt: new Date(now - 1000 * 60 * 60 * 24 * 10).toISOString()
                },
                {
                    id: 'ord_1024_t_2',
                    title: 'Payment confirmed',
                    status: OrderStatus.PAID,
                    completedAt: new Date(now - 1000 * 60 * 60 * 24 * 10 + 1000 * 60 * 20).toISOString()
                },
                {
                    id: 'ord_1024_t_3',
                    title: 'Delivered',
                    status: OrderStatus.DELIVERED,
                    completedAt: new Date(now - 1000 * 60 * 60 * 24 * 7).toISOString()
                }
            ],
            paymentReference: 'PAY-1024'
        }
    ],
    [
        'ord_1041',
        {
            id: 'ord_1041',
            buyerId: 'buyer_001',
            vendorId: 'vendor_store_2',
            status: OrderStatus.PROCESSING,
            totalAmount: 50000,
            currency: 'NGN',
            createdAt: new Date(now - 1000 * 60 * 60 * 24 * 5).toISOString(),
            deliveryAddress: '24 Admiralty Way, Lekki Phase 1, Lagos',
            items: [
                {
                    id: 'ord_1041_item_1',
                    productId: 'prod_2',
                    quantity: 2,
                    selectedVariantIds: ['prod_2_var_1']
                }
            ],
            timeline: [
                {
                    id: 'ord_1041_t_1',
                    title: 'Order placed',
                    status: OrderStatus.PENDING,
                    completedAt: new Date(now - 1000 * 60 * 60 * 24 * 5).toISOString()
                },
                {
                    id: 'ord_1041_t_2',
                    title: 'Processing',
                    status: OrderStatus.PROCESSING,
                    completedAt: new Date(now - 1000 * 60 * 60 * 24 * 4).toISOString()
                },
                {
                    id: 'ord_1041_t_3',
                    title: 'Out for delivery',
                    status: OrderStatus.SHIPPED
                }
            ],
            paymentReference: 'PAY-1041'
        }
    ]
]);

const notifications = new Map<string, NotificationRecord>([
    [
        'ntf_1',
        {
            id: 'ntf_1',
            userId: 'buyer_001',
            type: NotificationType.ORDER_UPDATE,
            title: 'Order update available',
            body: 'Your GreenGrid shipment was packed and handed over to the delivery partner.',
            isRead: false,
            createdAt: new Date(now - 1000 * 60 * 12).toISOString()
        }
    ],
    [
        'ntf_2',
        {
            id: 'ntf_2',
            userId: 'buyer_001',
            type: NotificationType.SYSTEM,
            title: 'Vendor verification changed',
            body: 'Parcel Atelier just received a higher trust badge after passing verification review.',
            isRead: true,
            createdAt: new Date(now - 1000 * 60 * 70).toISOString()
        }
    ],
    [
        'ntf_3',
        {
            id: 'ntf_3',
            userId: 'vendor_001',
            type: NotificationType.PAYOUT_UPDATE,
            title: 'Next payout window is ready',
            body: 'Withdrawals scheduled before 09:00 WAT will settle in the next payout cycle.',
            isRead: false,
            createdAt: new Date(now - 1000 * 60 * 45).toISOString()
        }
    ]
]);

const vendorBalances = new Map<string, VendorBalanceRecord>([
    [
        'vendor_store_1',
        {
            vendorId: 'vendor_store_1',
            availableBalance: 820000,
            pendingBalance: 145000,
            currency: 'NGN'
        }
    ]
]);

const payouts = new Map<string, PayoutRecord>([
    [
        'payout_1',
        {
            id: 'payout_1',
            vendorId: 'vendor_store_1',
            amount: 320000,
            currency: 'NGN',
            status: 'SUCCESS',
            reference: 'PAYOUT-001',
            initiatedAt: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString()
        }
    ]
]);

const transactions = new Map<string, TransactionRecord>([
    [
        'txn_1',
        {
            id: 'txn_1',
            vendorId: 'vendor_store_1',
            type: 'ORDER',
            amount: 280000,
            currency: 'NGN',
            status: 'SUCCESS',
            reference: 'PAY-1024',
            createdAt: new Date(now - 1000 * 60 * 60 * 24 * 10).toISOString()
        }
    ]
]);

function clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
}

function slugify(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function normalizeText(value?: string | null) {
    return value?.trim().toLowerCase() ?? '';
}

function getVendorById(vendorId: string) {
    const vendor = vendors.get(vendorId);

    if (!vendor) {
        throw new Error('Vendor not found.');
    }

    return vendor;
}

function getProductById(productId: string) {
    const product = products.get(productId);

    if (!product) {
        throw new Error('Product not found.');
    }

    return product;
}

function getUserById(userId: string) {
    const user = users.get(userId);

    if (!user) {
        throw new Error('User not found there.');
    }

    return user;
}

function getVendorForUser(userId: string) {
    return [...vendors.values()].find((vendor) => vendor.ownerUserId === userId) ?? null;
}

function calculateVariantDelta(product: MarketplaceProduct, selectedVariantIds: string[]) {
    return selectedVariantIds.reduce((total, variantId) => {
        const variant = product.variants.find((entry) => entry.id === variantId);
        return total + (variant?.priceDelta ?? 0);
    }, 0);
}

function toVendorCard(vendor: MarketplaceVendor) {
    return {
        id: vendor.id,
        slug: vendor.slug,
        businessName: vendor.businessName,
        location: vendor.location ? `${vendor.location.city}, ${vendor.location.state}` : 'Remote',
        trustScore: vendor.trustScore,
        rating: vendor.rating,
        totalOrders: vendor.totalOrders,
        verificationStatus: vendor.verificationStatus,
        description: vendor.description,
        category: vendor.category,
        phone: vendor.phone
    };
}

function toProductCard(product: MarketplaceProduct) {
    const vendor = getVendorById(product.vendorId);

    return {
        id: product.id,
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price,
        currency: product.currency,
        category: product.category.name,
        vendorId: vendor.id,
        vendorName: vendor.businessName,
        vendorSlug: vendor.slug,
        location: vendor.location ? `${vendor.location.city}, ${vendor.location.state}` : 'Remote',
        trustScore: vendor.trustScore,
        rating: vendor.rating,
        reviewCount: Math.max(18, Math.round(vendor.totalOrders / 4)),
        imageUrl: product.images[0]?.url ?? '',
        images: product.images,
        variants: product.variants,
        stockQuantity: product.stockQuantity,
        isAvailable: product.isAvailable,
        tags: product.tags,
        featured: product.featured
    };
}

function toResolvedCart(userId: string) {
    const cart = carts.get(userId) ?? {
        id: `cart_${userId}`,
        currency: 'NGN',
        items: [],
        updatedAt: new Date().toISOString()
    };

    const items = cart.items.map((item) => {
        const product = getProductById(item.productId);
        const unitPrice = product.price + calculateVariantDelta(product, item.selectedVariantIds);

        return {
            ...item,
            unitPrice,
            totalPrice: unitPrice * item.quantity,
            product: toProductCard(product)
        };
    });

    return clone({
        id: cart.id,
        currency: cart.currency,
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: items.reduce((sum, item) => sum + item.totalPrice, 0),
        items,
        updatedAt: cart.updatedAt
    });
}

function buildOrderView(order: OrderRecord) {
    const vendor = getVendorById(order.vendorId);

    return clone({
        id: order.id,
        buyerId: order.buyerId,
        vendorId: order.vendorId,
        status: order.status,
        totalAmount: order.totalAmount,
        currency: order.currency,
        createdAt: order.createdAt,
        deliveryAddress: order.deliveryAddress,
        paymentReference: order.paymentReference,
        vendor: toVendorCard(vendor),
        items: order.items.map((item) => {
            const product = getProductById(item.productId);
            const unitPrice = product.price + calculateVariantDelta(product, item.selectedVariantIds);

            return {
                ...item,
                unitPrice,
                totalPrice: unitPrice * item.quantity,
                product: toProductCard(product)
            };
        }),
        timeline: order.timeline
    });
}

function createTimeline(status: OrderRecord['status']) {
    const stages: Array<{ status: OrderRecord['status']; title: string }> = [
        { status: OrderStatus.PENDING, title: 'Order placed' },
        { status: OrderStatus.PAID, title: 'Payment confirmed' },
        { status: OrderStatus.PROCESSING, title: 'Processing' },
        { status: OrderStatus.SHIPPED, title: 'Dispatched' },
        { status: OrderStatus.DELIVERED, title: 'Delivered' }
    ];
    const activeIndex = stages.findIndex((stage) => stage.status === status);

    return stages.map((stage, index) => ({
        id: `${stage.status}_${index}`,
        title: stage.title,
        status: stage.status,
        completedAt: index <= activeIndex ? new Date().toISOString() : undefined
    }));
}

export function listCategories() {
    return clone(categories);
}

export function findUserByEmail(email: string) {
    return clone(
        [...users.values()].find((user) => normalizeText(user.email) === normalizeText(email)) ?? null
    );
}

export function findUserByPhone(phone: string) {
    return clone(
        [...users.values()].find((user) => normalizeText(user.phone) === normalizeText(phone)) ?? null
    );
}

export function findUserById(userId: string) {
    return clone(users.get(userId) ?? null);
}

export function validateUserPassword(email: string, password: string) {
    const existing = [...users.values()].find((user) => normalizeText(user.email) === normalizeText(email));
    return Boolean(existing && existing.password === password);
}

export function createEmailUser(input: { email: string; password: string; fullName?: string }) {
    const id = `user_${crypto.randomUUID()}`;
    const createdAt = new Date().toISOString();
    const user: MarketplaceUser = {
        id,
        email: input.email,
        password: input.password,
        fullName: input.fullName?.trim() ?? '',
        role: 'BUYER',
        authProvider: 'email',
        isVerified: true,
        createdAt,
        updatedAt: createdAt
    };

    users.set(id, user);
    return clone(user);
}

export function createPhoneUser(input: { phone: string }) {
    const id = `user_${crypto.randomUUID()}`;
    const createdAt = new Date().toISOString();
    const user: MarketplaceUser = {
        id,
        phone: input.phone,
        fullName: '',
        role: 'BUYER',
        authProvider: 'phone',
        isVerified: true,
        createdAt,
        updatedAt: createdAt
    };

    users.set(id, user);
    return clone(user);
}

export function updateUserProfile(
    userId: string,
    payload: Partial<Pick<MarketplaceUser, 'fullName' | 'role' | 'email' | 'phone'>>
) {
    const user = getUserById(userId);
    const nextUser: MarketplaceUser = {
        ...user,
        ...payload,
        updatedAt: new Date().toISOString()
    };

    users.set(userId, nextUser);
    return clone(nextUser);
}

export function mapUserToSessionUser(user: MarketplaceUser): SessionUser {
    return {
        id: user.id,
        name: user.fullName || 'Vendora User',
        role: user.role.toLowerCase() as UserRole,
        email: user.email ?? `${user.phone ?? user.id}@vendora.local`,
        tenantId: 'core'
    };
}

export function mapUserToApiUser(user: MarketplaceUser) {
    return clone({
        id: user.id,
        email: user.email ?? null,
        phone: user.phone ?? null,
        fullName: user.fullName,
        avatarUrl: null,
        authProvider: user.authProvider.toUpperCase(),
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    });
}

export function isOnboardingCompleteForUser(userId: string) {
    const user = getUserById(userId);

    if (!user.fullName) {
        return false;
    }

    if (user.role !== 'VENDOR') {
        return true;
    }

    const vendor = getVendorForUser(userId);
    return Boolean(vendor && vendor.location && vendor.cacNumber);
}

export function getHomeData() {
    const popularVendors = [...vendors.values()]
        .sort((left, right) => right.trustScore - left.trustScore)
        .slice(0, 3)
        .map(toVendorCard);
    const recommendedProducts = [...products.values()]
        .sort((left, right) => Number(right.featured) - Number(left.featured) || right.price - left.price)
        .slice(0, 4)
        .map(toProductCard);

    return clone({
        popularVendors,
        recommendedProducts,
        categories: categories.map((category) => category.name)
    });
}

export function getVendorDirectory(filters: { state?: string; category?: string; sort?: string }) {
    const items = [...vendors.values()]
        .filter((vendor) => {
            const matchesState = !filters.state || normalizeText(vendor.location?.state) === normalizeText(filters.state);
            const matchesCategory = !filters.category || normalizeText(vendor.category) === normalizeText(filters.category);
            return matchesState && matchesCategory;
        })
        .sort((left, right) => {
            if (filters.sort === 'rating') {
                return right.rating - left.rating;
            }

            return right.trustScore - left.trustScore;
        })
        .map(toVendorCard);

    return clone({
        items,
        filters: {
            states: [...new Set([...vendors.values()].map((vendor) => vendor.location?.state).filter(Boolean))],
            categories: [...new Set([...vendors.values()].map((vendor) => vendor.category))]
        }
    });
}

export function getVendorDetails(slug: string) {
    const vendor = [...vendors.values()].find((entry) => entry.slug === slug);

    if (!vendor) {
        return null;
    }

    const vendorProducts = [...products.values()]
        .filter((product) => product.vendorId === vendor.id)
        .map(toProductCard);

    return clone({
        vendor: {
            ...toVendorCard(vendor),
            description: vendor.description,
            phone: vendor.phone,
            address: vendor.location?.addressLine1 ?? '',
            state: vendor.location?.state ?? '',
            city: vendor.location?.city ?? '',
            trustBreakdown: [
                { label: 'Verification', score: vendor.verificationStatus === 'VERIFIED' ? 96 : 72 },
                { label: 'Fulfillment', score: Math.min(99, 78 + Math.round(vendor.rating * 4)) },
                { label: 'Repeat orders', score: Math.min(98, 68 + Math.round(vendor.totalOrders / 8)) }
            ]
        },
        products: vendorProducts
    });
}

export function getProductCatalog(filters: {
    q?: string;
    category?: string;
    state?: string;
    vendorId?: string;
    sort?: string;
}) {
    const search = normalizeText(filters.q);
    const items = [...products.values()]
        .filter((product) => {
            const vendor = getVendorById(product.vendorId);
            const matchesSearch =
                !search ||
                [
                    product.name,
                    product.description,
                    product.category.name,
                    vendor.businessName,
                    ...product.tags
                ]
                    .join(' ')
                    .toLowerCase()
                    .includes(search);
            const matchesCategory =
                !filters.category || normalizeText(product.category.name) === normalizeText(filters.category);
            const matchesState =
                !filters.state || normalizeText(vendor.location?.state) === normalizeText(filters.state);
            const matchesVendor = !filters.vendorId || product.vendorId === filters.vendorId;

            return matchesSearch && matchesCategory && matchesState && matchesVendor;
        })
        .sort((left, right) => {
            switch (filters.sort) {
                case 'price-asc':
                    return left.price - right.price;
                case 'price-desc':
                    return right.price - left.price;
                case 'rating':
                    return getVendorById(right.vendorId).rating - getVendorById(left.vendorId).rating;
                default:
                    return Number(right.featured) - Number(left.featured);
            }
        })
        .map(toProductCard);

    return clone({
        items,
        filters: {
            categories: [...new Set([...products.values()].map((product) => product.category.name))],
            states: [...new Set([...vendors.values()].map((vendor) => vendor.location?.state).filter(Boolean))]
        }
    });
}

export function getProductDetails(slug: string) {
    const product = [...products.values()].find((entry) => entry.slug === slug);

    if (!product) {
        return null;
    }

    const vendor = getVendorById(product.vendorId);
    const relatedProducts = [...products.values()]
        .filter((entry) => entry.vendorId === vendor.id && entry.id !== product.id)
        .slice(0, 3)
        .map(toProductCard);

    return clone({
        product: {
            ...toProductCard(product),
            vendor: toVendorCard(vendor),
            description: product.description,
            variants: product.variants,
            tags: product.tags,
            trustBadge: vendor.verificationStatus === 'VERIFIED' ? 'verified' : 'high-trust'
        },
        relatedProducts
    });
}

export function searchMarketplace(filters: {
    q?: string;
    category?: string;
    state?: string;
    verifiedOnly?: boolean;
}) {
    const query = normalizeText(filters.q);
    const vendorItems = getVendorDirectory({
        state: filters.state,
        category: filters.category
    }).items.filter((vendor) => {
        const matchesQuery =
            !query ||
            [vendor.businessName, vendor.location, vendor.category].join(' ').toLowerCase().includes(query);
        const matchesVerified = !filters.verifiedOnly || vendor.verificationStatus === 'VERIFIED';
        return matchesQuery && matchesVerified;
    });
    const productItems = getProductCatalog({
        q: filters.q,
        category: filters.category,
        state: filters.state
    }).items.filter((product) => {
        if (!filters.verifiedOnly) {
            return true;
        }

        return product.trustScore >= 90;
    });

    return clone({
        query: filters.q ?? '',
        vendors: vendorItems,
        products: productItems
    });
}

export function getSearchSuggestions(query: string) {
    const results = searchMarketplace({ q: query });

    return clone({
        vendors: results.vendors.slice(0, 3),
        products: results.products.slice(0, 3),
        categories: categories.filter((category) => normalizeText(category.name).includes(normalizeText(query)))
    });
}

export function getCart(userId: string) {
    return toResolvedCart(userId);
}

export function addCartItem(
    userId: string,
    payload: { productId: string; quantity: number; selectedVariantIds?: string[] }
) {
    const cart = carts.get(userId) ?? {
        id: `cart_${userId}`,
        currency: 'NGN',
        items: [],
        updatedAt: new Date().toISOString()
    };
    const selectedVariantIds = [...(payload.selectedVariantIds ?? [])].sort();
    const existingItem = cart.items.find((item) => {
        return (
            item.productId === payload.productId &&
            [...item.selectedVariantIds].sort().join('|') === selectedVariantIds.join('|')
        );
    });

    if (existingItem) {
        existingItem.quantity += payload.quantity;
    } else {
        cart.items.push({
            id: `cart_item_${crypto.randomUUID()}`,
            productId: payload.productId,
            quantity: payload.quantity,
            selectedVariantIds
        });
    }

    cart.updatedAt = new Date().toISOString();
    carts.set(userId, cart);
    return toResolvedCart(userId);
}

export function updateCartItem(
    userId: string,
    itemId: string,
    payload: { quantity?: number; selectedVariantIds?: string[] }
) {
    const cart = carts.get(userId);

    if (!cart) {
        return toResolvedCart(userId);
    }

    cart.items = cart.items
        .map((item) =>
            item.id === itemId
                ? {
                    ...item,
                    quantity: payload.quantity ?? item.quantity,
                    selectedVariantIds: [...(payload.selectedVariantIds ?? item.selectedVariantIds)]
                }
                : item
        )
        .filter((item) => item.quantity > 0);
    cart.updatedAt = new Date().toISOString();
    carts.set(userId, cart);
    return toResolvedCart(userId);
}

export function removeCartItem(userId: string, itemId: string) {
    const cart = carts.get(userId);

    if (!cart) {
        return toResolvedCart(userId);
    }

    cart.items = cart.items.filter((item) => item.id !== itemId);
    cart.updatedAt = new Date().toISOString();
    carts.set(userId, cart);
    return toResolvedCart(userId);
}

export function listBuyerOrders(userId: string) {
    return clone(
        [...orders.values()]
            .filter((order) => order.buyerId === userId)
            .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
            .map(buildOrderView)
    );
}

export function getOrderDetails(userId: string, orderId: string) {
    const order = orders.get(orderId);

    if (!order || (order.buyerId !== userId && getVendorForUser(userId)?.id !== order.vendorId)) {
        return null;
    }

    return buildOrderView(order);
}

export function createOrder(
    userId: string,
    payload: {
        vendorId: string;
        deliveryAddress: string;
        items: Array<{ productId: string; quantity: number; selectedVariantIds?: string[] }>;
    }
) {
    const createdAt = new Date().toISOString();
    const totalAmount = payload.items.reduce((sum, item) => {
        const product = getProductById(item.productId);
        return sum + (product.price + calculateVariantDelta(product, item.selectedVariantIds ?? [])) * item.quantity;
    }, 0);
    const id = `ord_${Math.floor(Math.random() * 9000 + 1000)}`;
    const record: OrderRecord = {
        id,
        buyerId: userId,
        vendorId: payload.vendorId,
        status: OrderStatus.PENDING,
        totalAmount,
        currency: 'NGN',
        createdAt,
        deliveryAddress: payload.deliveryAddress,
        items: payload.items.map((item) => ({
            id: `order_item_${crypto.randomUUID()}`,
            productId: item.productId,
            quantity: item.quantity,
            selectedVariantIds: [...(item.selectedVariantIds ?? [])]
        })),
        timeline: createTimeline(OrderStatus.PENDING),
        paymentReference: `PAY-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
    };

    orders.set(id, record);

    const vendor = getVendorById(payload.vendorId);
    vendors.set(payload.vendorId, {
        ...vendor,
        totalOrders: vendor.totalOrders + 1,
        updatedAt: createdAt
    });

    const vendorBalance = vendorBalances.get(payload.vendorId);

    if (vendorBalance) {
        vendorBalances.set(payload.vendorId, {
            ...vendorBalance,
            pendingBalance: vendorBalance.pendingBalance + totalAmount
        });
    }

    const userCart = carts.get(userId);

    if (userCart) {
        const purchasedKeys = new Set(payload.items.map((item) => item.productId));
        userCart.items = userCart.items.filter((item) => !purchasedKeys.has(item.productId));
        userCart.updatedAt = createdAt;
        carts.set(userId, userCart);
    }

    const notificationId = `ntf_${crypto.randomUUID()}`;

    notifications.set(notificationId, {
        id: notificationId,
        userId,
        type: NotificationType.ORDER_UPDATE,
        title: 'Order created successfully',
        body: `Your order ${id} is now awaiting payment confirmation.`,
        isRead: false,
        createdAt
    });

    return buildOrderView(record);
}

export function initializePayment(amount: number, email?: string) {
    const reference = `VND-${crypto.randomUUID().slice(0, 10).toUpperCase()}`;
    return clone({
        authorizationUrl: `https://paystack.com/pay/${reference.toLowerCase()}?email=${encodeURIComponent(email ?? 'buyer@vendora.app')}&amount=${amount}`,
        accessCode: reference,
        reference,
        expiresAt: new Date(Date.now() + 1000 * 60 * 30).toISOString()
    });
}

export function listNotifications(userId: string) {
    return clone(
        [...notifications.values()]
            .filter((notification) => notification.userId === userId)
            .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
    );
}

export function markNotificationAsRead(userId: string, notificationId: string) {
    const notification = notifications.get(notificationId);

    if (!notification || notification.userId !== userId) {
        return null;
    }

    notifications.set(notificationId, {
        ...notification,
        isRead: true
    });

    return clone(notifications.get(notificationId)!);
}

export function upsertVendorForUser(
    userId: string,
    payload: { businessName: string; description: string; phone: string; category: string }
) {
    const existing = getVendorForUser(userId);
    const createdAt = existing?.createdAt ?? new Date().toISOString();
    const nextVendor: MarketplaceVendor = {
        id: existing?.id ?? `vendor_store_${crypto.randomUUID()}`,
        ownerUserId: userId,
        slug: existing?.slug ?? slugify(payload.businessName),
        businessName: payload.businessName,
        description: payload.description,
        phone: payload.phone,
        category: payload.category,
        status: existing?.status ?? VendorStatus.PENDING,
        verificationStatus: existing?.verificationStatus ?? VerificationStatus.PENDING,
        trustScore: existing?.trustScore ?? 78,
        rating: existing?.rating ?? 4.2,
        totalOrders: existing?.totalOrders ?? 0,
        location: existing?.location ?? null,
        createdAt,
        updatedAt: new Date().toISOString(),
        cacNumber: existing?.cacNumber
    };

    vendors.set(nextVendor.id, nextVendor);
    return clone(nextVendor);
}

export function updateVendorLocation(userId: string, payload: { state: string; city: string; address: string }) {
    const vendor = getVendorForUser(userId);

    if (!vendor) {
        throw new Error('Vendor profile not found.');
    }

    const nextVendor: MarketplaceVendor = {
        ...vendor,
        location: {
            id: vendor.location?.id ?? `vendor_location_${crypto.randomUUID()}`,
            state: payload.state,
            city: payload.city,
            addressLine1: payload.address
        },
        updatedAt: new Date().toISOString()
    };

    vendors.set(vendor.id, nextVendor);
    return clone(nextVendor);
}

export function submitVendorVerification(userId: string, cacNumber: string) {
    const vendor = getVendorForUser(userId);

    if (!vendor) {
        throw new Error('Vendor profile not found.');
    }

    const nextVendor: MarketplaceVendor = {
        ...vendor,
        cacNumber,
        verificationStatus: VerificationStatus.PENDING,
        trustScore: Math.max(vendor.trustScore, 84),
        updatedAt: new Date().toISOString()
    };

    vendors.set(vendor.id, nextVendor);

    const notificationId = `ntf_${crypto.randomUUID()}`;

    notifications.set(notificationId, {
        id: notificationId,
        userId,
        type: NotificationType.SYSTEM,
        title: 'Verification submitted',
        body: 'Your CAC details are under review. We will notify you when verification is complete.',
        isRead: false,
        createdAt: new Date().toISOString()
    });

    return clone(nextVendor);
}

export function getVendorDashboard(userId: string) {
    const vendor = getVendorForUser(userId);

    if (!vendor) {
        return null;
    }

    const vendorOrders = [...orders.values()].filter((order) => order.vendorId === vendor.id);
    const vendorProducts = [...products.values()].filter((product) => product.vendorId === vendor.id);
    const totalRevenue = vendorOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const topProducts = vendorProducts
        .map((product, index) => ({
            name: product.name,
            unitsSold: 12 + index * 9,
            revenue: (12 + index * 9) * product.price,
            trustStatus: vendor.verificationStatus === 'VERIFIED' ? 'verified' : 'high-trust'
        }))
        .slice(0, 3);

    return clone({
        vendor: toVendorCard(vendor),
        stats: {
            revenue: totalRevenue,
            orders: vendorOrders.length,
            rating: vendor.rating,
            balance: vendorBalances.get(vendor.id)?.availableBalance ?? 0
        },
        revenuePoints: [
            { label: 'Mon', value: 95000 },
            { label: 'Tue', value: 126000 },
            { label: 'Wed', value: 182000 },
            { label: 'Thu', value: 148000 },
            { label: 'Fri', value: 214000 }
        ],
        orderPoints: [
            { label: 'Mon', value: 4 },
            { label: 'Tue', value: 6 },
            { label: 'Wed', value: 9 },
            { label: 'Thu', value: 7 },
            { label: 'Fri', value: 11 }
        ],
        topProducts,
        recentOrders: vendorOrders.slice(0, 5).map(buildOrderView)
    });
}

export function listVendorProducts(userId: string) {
    const vendor = getVendorForUser(userId);

    if (!vendor) {
        return [];
    }

    return clone(
        [...products.values()]
            .filter((product) => product.vendorId === vendor.id)
            .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))
            .map(toProductCard)
    );
}

export function createVendorProduct(
    userId: string,
    payload: { name: string; description: string; category: string; price: number; stockQuantity: number }
) {
    const vendor = getVendorForUser(userId);

    if (!vendor) {
        throw new Error('Vendor profile not found.');
    }

    const category = categories.find((entry) => entry.name === payload.category) ?? {
        id: `cat_${slugify(payload.category)}`,
        name: payload.category,
        slug: slugify(payload.category)
    };
    const createdAt = new Date().toISOString();
    const nextProduct: MarketplaceProduct = {
        id: `prod_${crypto.randomUUID()}`,
        vendorId: vendor.id,
        slug: slugify(payload.name),
        name: payload.name,
        description: payload.description,
        category,
        price: payload.price,
        currency: 'NGN',
        stockQuantity: payload.stockQuantity,
        tags: [payload.category.toLowerCase()],
        isActive: true,
        isAvailable: payload.stockQuantity > 0,
        images: [
            {
                id: `img_${crypto.randomUUID()}`,
                url: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80'
            }
        ],
        variants: [{ id: `var_${crypto.randomUUID()}`, name: 'Standard', priceDelta: 0 }],
        createdAt,
        updatedAt: createdAt,
        featured: false
    };

    products.set(nextProduct.id, nextProduct);
    return clone(toProductCard(nextProduct));
}

export function updateVendorProduct(
    userId: string,
    productId: string,
    payload: Partial<{ name: string; description: string; category: string; price: number; stockQuantity: number }>
) {
    const vendor = getVendorForUser(userId);
    const product = getProductById(productId);

    if (!vendor || product.vendorId !== vendor.id) {
        throw new Error('Product not found.');
    }

    const nextCategory = payload.category
        ? categories.find((entry) => entry.name === payload.category) ?? {
            id: `cat_${slugify(payload.category)}`,
            name: payload.category,
            slug: slugify(payload.category)
        }
        : product.category;
    const nextProduct: MarketplaceProduct = {
        ...product,
        name: payload.name ?? product.name,
        slug: payload.name ? slugify(payload.name) : product.slug,
        description: payload.description ?? product.description,
        category: nextCategory,
        price: payload.price ?? product.price,
        stockQuantity: payload.stockQuantity ?? product.stockQuantity,
        isAvailable: (payload.stockQuantity ?? product.stockQuantity) > 0,
        updatedAt: new Date().toISOString()
    };

    products.set(product.id, nextProduct);
    return clone(toProductCard(nextProduct));
}

export function deleteVendorProduct(userId: string, productId: string) {
    const vendor = getVendorForUser(userId);
    const product = products.get(productId);

    if (!vendor || !product || product.vendorId !== vendor.id) {
        throw new Error('Product not found.');
    }

    products.delete(productId);
}

export function listVendorOrders(userId: string) {
    const vendor = getVendorForUser(userId);

    if (!vendor) {
        return [];
    }

    return clone(
        [...orders.values()]
            .filter((order) => order.vendorId === vendor.id)
            .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
            .map(buildOrderView)
    );
}

export function updateVendorOrderStatus(userId: string, orderId: string, status: OrderRecord['status']) {
    const vendor = getVendorForUser(userId);
    const order = orders.get(orderId);

    if (!vendor || !order || order.vendorId !== vendor.id) {
        throw new Error('Order not found.');
    }

    const nextOrder: OrderRecord = {
        ...order,
        status,
        timeline: createTimeline(status)
    };

    orders.set(orderId, nextOrder);
    return buildOrderView(nextOrder);
}

export function getVendorPayoutData(userId: string) {
    const vendor = getVendorForUser(userId);

    if (!vendor) {
        return null;
    }

    return clone({
        balance: vendorBalances.get(vendor.id) ?? {
            vendorId: vendor.id,
            availableBalance: 0,
            pendingBalance: 0,
            currency: 'NGN'
        },
        payouts: [...payouts.values()]
            .filter((entry) => entry.vendorId === vendor.id)
            .sort((left, right) => Date.parse(right.initiatedAt) - Date.parse(left.initiatedAt)),
        transactions: [...transactions.values()]
            .filter((entry) => entry.vendorId === vendor.id)
            .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
    });
}

export function withdrawVendorBalance(userId: string, amount: number) {
    const vendor = getVendorForUser(userId);

    if (!vendor) {
        throw new Error('Vendor profile not found.');
    }

    const balance = vendorBalances.get(vendor.id);

    if (!balance || amount > balance.availableBalance) {
        throw new Error('Insufficient balance.');
    }

    const payout: PayoutRecord = {
        id: `payout_${crypto.randomUUID()}`,
        vendorId: vendor.id,
        amount,
        currency: balance.currency,
        status: 'PROCESSING',
        reference: `PAYOUT-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
        initiatedAt: new Date().toISOString()
    };

    payouts.set(payout.id, payout);
    vendorBalances.set(vendor.id, {
        ...balance,
        availableBalance: balance.availableBalance - amount,
        pendingBalance: balance.pendingBalance + amount
    });

    return clone(payout);
}

export function getVendorAnalytics(userId: string) {
    const dashboard = getVendorDashboard(userId);

    if (!dashboard) {
        return null;
    }

    return clone({
        summary: {
            totalRevenue: dashboard.stats.revenue,
            totalOrders: dashboard.stats.orders,
            totalPaidOrders: Math.max(0, dashboard.stats.orders - 1),
            totalDeliveredOrders: Math.max(0, dashboard.stats.orders - 2),
            totalCancelledOrders: 1,
            totalReviews: 78,
            averageRating: dashboard.stats.rating,
            totalUnitsSold: 264
        },
        revenuePoints: dashboard.revenuePoints,
        orderPoints: dashboard.orderPoints,
        topProducts: dashboard.topProducts
    });
}
