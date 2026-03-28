export const vendorDirectory = [
  {
    slug: 'greengrid-supplies',
    name: 'GreenGrid Supplies',
    specialty: 'Energy systems',
    location: 'Lagos',
    trustScore: 94,
    description: 'Solar kits, backup power bundles, and installation-ready accessories for urban households.'
  },
  {
    slug: 'parcel-atelier',
    name: 'Parcel Atelier',
    specialty: 'Premium packaging',
    location: 'Abuja',
    trustScore: 89,
    description: 'Packaging systems for premium brands that want consistent unboxing and low breakage.'
  },
  {
    slug: 'stockpilot-tech',
    name: 'StockPilot Tech',
    specialty: 'Retail operations',
    location: 'Port Harcourt',
    trustScore: 92,
    description: 'Barcode scanners, POS hardware, and warehouse tooling for fast-moving inventory teams.'
  }
] as const;

export const buyerOrders = [
  { id: 'ord_1024', vendor: 'GreenGrid Supplies', total: 'NGN 280,000', status: 'Delivered', date: 'Mar 18' },
  { id: 'ord_1041', vendor: 'Parcel Atelier', total: 'NGN 25,000', status: 'Processing', date: 'Mar 22' },
  { id: 'ord_1098', vendor: 'StockPilot Tech', total: 'NGN 67,000', status: 'In transit', date: 'Mar 26' }
] as const;

export const notificationsFeed = [
  {
    id: 'ntf_1',
    title: 'Order update available',
    description: 'Your GreenGrid shipment was packed and handed over to the delivery partner.',
    time: '12m ago'
  },
  {
    id: 'ntf_2',
    title: 'Vendor verification changed',
    description: 'Parcel Atelier just received a higher trust badge after passing verification review.',
    time: '1h ago'
  },
  {
    id: 'ntf_3',
    title: 'Cart price alert',
    description: 'One item in your cart now qualifies for a vendor discount threshold.',
    time: '3h ago'
  }
] as const;
