export const vendorDirectory = [
  {
    slug: 'beautiful-hair-ng',
    name: 'Beautiful Hair NG',
    specialty: 'Beauty',
    location: 'Lagos',
    trustScore: 96,
    description: 'Verified Lagos hair vendor for wigs, bundles, revamps, and bridal styling.'
  },
  {
    slug: 'crafted-by-zara',
    name: 'Crafted by Zara',
    specialty: 'Fashion',
    location: 'Abuja',
    trustScore: 91,
    description: 'Ready-to-wear adire, modest sets, and made-to-measure occasion pieces.'
  },
  {
    slug: 'kitchen-mama-ph',
    name: 'Kitchen Mama PH',
    specialty: 'Food & Groceries',
    location: 'Port Harcourt',
    trustScore: 90,
    description: 'Meal prep, soup bowls, and party trays with verified delivery history.'
  }
] as const;

export const buyerOrders = [
  { id: 'ord_1024', vendor: 'Beautiful Hair NG', total: 'NGN 85,000', status: 'Delivered', date: 'Mar 18' },
  { id: 'ord_1041', vendor: 'Kitchen Mama PH', total: 'NGN 37,000', status: 'Processing', date: 'Mar 22' },
  { id: 'ord_1098', vendor: 'Crafted by Zara', total: 'NGN 42,000', status: 'In transit', date: 'Mar 26' }
] as const;

export const notificationsFeed = [
  {
    id: 'ntf_1',
    title: 'Order update available',
    description: 'Beautiful Hair NG confirmed your booking and shared preparation notes.',
    time: '12m ago'
  },
  {
    id: 'ntf_2',
    title: 'Vendor verification changed',
    description: 'Kitchen Mama PH just received a higher trust badge after passing verification review.',
    time: '1h ago'
  },
  {
    id: 'ntf_3',
    title: 'Cart price alert',
    description: 'One item in your cart now qualifies for a vendor discount threshold.',
    time: '3h ago'
  }
] as const;
