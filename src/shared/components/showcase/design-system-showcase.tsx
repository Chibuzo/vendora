'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

import { Alert } from '@/shared/components/feedback/alert';
import { EmptyState } from '@/shared/components/feedback/empty-state';
import { SkeletonLoader } from '@/shared/components/feedback/skeleton-loader';
import { useToast } from '@/shared/components/feedback/toast';
import { FormField, FormHelper, FormLabel } from '@/shared/components/forms/form-field';
import { PasswordInput } from '@/shared/components/forms/password-input';
import { FilterPanel } from '@/shared/components/discovery/filter-panel';
import { SearchInput } from '@/shared/components/discovery/search-input';
import { SortDropdown } from '@/shared/components/discovery/sort-dropdown';
import { OrdersChart } from '@/shared/components/dashboard/orders-chart';
import { RevenueChart } from '@/shared/components/dashboard/revenue-chart';
import { StatCard } from '@/shared/components/dashboard/stat-card';
import { TopProductsTable } from '@/shared/components/dashboard/top-products-table';
import { CartItemCard } from '@/shared/components/marketplace/cart-item-card';
import { OrderCard } from '@/shared/components/marketplace/order-card';
import { ProductCard } from '@/shared/components/marketplace/product-card';
import { VendorCard } from '@/shared/components/marketplace/vendor-card';
import { ProgressBar } from '@/shared/components/onboarding/progress-bar';
import { RoleSelector } from '@/shared/components/onboarding/role-selector';
import { StepIndicator } from '@/shared/components/onboarding/step-indicator';
import { VerificationStatusBadge } from '@/shared/components/onboarding/verification-status-badge';
import { Badge } from '@/shared/components/ui/badge';
import { Button, buttonVariants } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/shared/components/ui/drawer';
import { Input } from '@/shared/components/ui/input';
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger
} from '@/shared/components/ui/modal';
import { RadioGroup, RadioOption } from '@/shared/components/ui/radio-group';
import { Select } from '@/shared/components/ui/select';
import { Switch } from '@/shared/components/ui/switch';
import { Textarea } from '@/shared/components/ui/textarea';

const filterSections = [
  {
    title: 'Category',
    options: [
      { label: 'Energy', value: 'energy', count: 24 },
      { label: 'Logistics', value: 'logistics', count: 18 },
      { label: 'Packaging', value: 'packaging', count: 12 }
    ]
  },
  {
    title: 'Trust level',
    options: [
      { label: 'Verified only', value: 'verified' },
      { label: 'High trust', value: 'high-trust' },
      { label: 'New vendors', value: 'new' }
    ]
  }
] as const;

export function DesignSystemShowcase() {
  const { showToast } = useToast();
  const [role, setRole] = React.useState<'buyer' | 'vendor'>('vendor');
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>(['verified']);
  const [notifications, setNotifications] = React.useState(true);
  const [audience, setAudience] = React.useState('buyers');

  return (
    <div className="space-y-10">
      <section className="surface grid gap-8 px-6 py-8 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="grid gap-2">
            <Badge variant="outline">Vendora UI Kit</Badge>
            <h2 className="font-display text-4xl font-semibold tracking-[-0.05em] text-foreground">
              Trust-first marketplace components with premium restraint.
            </h2>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              The kit ships with primitives, overlays, onboarding flows, and marketplace-specific blocks ready for App Router usage.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() =>
                showToast({
                  title: 'Vendor approved',
                  description: 'A new verified storefront is ready for discovery.',
                  variant: 'success'
                })
              }
            >
              Trigger toast
            </Button>
            <Link href="/vendors" className={buttonVariants({ variant: 'secondary' })}>
              Browse vendors
            </Link>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-5">
            <div className="grid gap-4 rounded-[var(--radius-2xl)] border border-border/70 bg-surface-muted/80 p-5">
              <div className="flex flex-wrap gap-3">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge variant="primary">Reliable</Badge>
                <Badge variant="accent">Premium vendors</Badge>
                <Badge variant="info">Discovery</Badge>
                <Badge variant="success">Verified</Badge>
              </div>
              <Alert variant="info" title="Accessibility first">
                Focus states, keyboard support, and readable contrast are built into the defaults.
              </Alert>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Business email" placeholder="vendor@vendora.ng" />
              <Select
                label="Business category"
                placeholder="Choose a category"
                options={[
                  { label: 'Energy', value: 'energy' },
                  { label: 'Retail', value: 'retail' },
                  { label: 'Operations', value: 'operations' }
                ]}
              />
              <PasswordInput label="Password" value="Vendora@123" readOnly />
              <Textarea label="Business summary" placeholder="Tell buyers why they can trust this storefront." />
            </div>
          </div>

          <div className="grid gap-4 rounded-[var(--radius-2xl)] border border-border/70 bg-card/90 p-5">
            <FormField>
              <FormLabel>Preference controls</FormLabel>
              <FormHelper>Typed APIs, composable structure, and predictable focus behavior.</FormHelper>
            </FormField>
            <Checkbox
              checked
              label="Show verified vendors first"
              description="Prioritize merchants with completed onboarding and trust review."
            />
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
              label="Realtime risk alerts"
              description="Flag disputes, payout issues, or suspicious activity immediately."
            />
            <RadioGroup value={audience} onValueChange={setAudience} className="grid gap-3">
              <RadioOption value="buyers" label="Buyer messaging" description="Optimize for discovery and confidence." />
              <RadioOption value="vendors" label="Vendor messaging" description="Optimize for credibility and operations." />
            </RadioGroup>
            <div className="flex flex-wrap gap-3">
              <Modal>
                <ModalTrigger asChild>
                  <Button variant="secondary">Open modal</Button>
                </ModalTrigger>
                <ModalContent>
                  <ModalHeader>
                    <ModalTitle>Verification review</ModalTitle>
                    <ModalDescription>Use modals for focused confirmation moments in trust workflows.</ModalDescription>
                  </ModalHeader>
                  <Alert variant="success" title="Documents complete">
                    CAC registration, payout account, and location proof are attached and validated.
                  </Alert>
                  <ModalFooter>
                    <Button variant="secondary">Request changes</Button>
                    <Button>Approve vendor</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="ghost">Open drawer</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Cart drawer</DrawerTitle>
                    <DrawerDescription>Use drawers for side-task flows like cart review and buyer order summaries.</DrawerDescription>
                  </DrawerHeader>
                  <CartItemCard
                    image="https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=900&q=80"
                    name="Solar Backup Kit"
                    vendor="GreenGrid Supplies"
                    quantity={2}
                    price={280000}
                  />
                  <DrawerFooter>
                    <Button width="full">Checkout</Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">Discovery</p>
            <h3 className="font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">
              Search and refinement patterns for trust-aware browsing.
            </h3>
          </div>
          <SortDropdown
            size="sm"
            defaultValue="trust"
            options={[
              { label: 'Trust score', value: 'trust' },
              { label: 'Newest', value: 'newest' },
              { label: 'Price: low to high', value: 'price-asc' }
            ]}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <FilterPanel
            sections={filterSections.map((section) => ({ ...section, options: [...section.options] }))}
            selectedValues={selectedFilters}
            onToggleValue={(value, checked) =>
              setSelectedFilters((current) =>
                checked ? [...current, value] : current.filter((item) => item !== value)
              )
            }
          />
          <div className="grid gap-6">
            <SearchInput
              placeholder="Search trusted suppliers, categories, or products"
              suggestions={['Solar backup kit', 'Verified packaging vendors', 'Cold chain storage', 'POS terminals']}
            />
            <div className="grid gap-6 lg:grid-cols-2">
              <ProductCard
                image="https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=900&q=80"
                name="Solar Backup Kit"
                price={280000}
                originalPrice={320000}
                vendor="GreenGrid Supplies"
                rating={4.8}
                reviewCount={128}
                trustStatus="verified"
                description="Reliable home backup power package for urban households and premium apartments."
                category="Energy"
              />
              <VendorCard
                businessName="Parcel Atelier"
                trustScore={91}
                rating={4.7}
                reviewCount={64}
                location="Lekki, Lagos"
                verificationStatus="high-trust"
                tagline="Premium packaging and fulfillment materials."
              />
            </div>
            <ProductCard
              variant="list"
              image="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80"
              name="Cold Chain Storage Box"
              price={142000}
              vendor="Northline Logistics"
              rating={4.5}
              reviewCount={42}
              trustStatus="verified"
              description="Temperature-controlled container built for last-mile delivery teams handling food and pharma."
              category="Logistics"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="surface grid gap-5 px-6 py-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">Onboarding</p>
              <h3 className="font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">Clear progress with visible trust milestones.</h3>
            </div>
            <VerificationStatusBadge status="pending" />
          </div>
          <StepIndicator
            currentStep={2}
            steps={[
              { id: 'profile', label: 'Profile' },
              { id: 'role', label: 'Role' },
              { id: 'setup', label: 'Business setup' },
              { id: 'verification', label: 'Verification' }
            ]}
          />
          <div className="grid gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Completion</span>
              <span className="font-medium text-foreground">72%</span>
            </div>
            <ProgressBar value={72} />
          </div>
          <RoleSelector value={role} onValueChange={setRole} />
        </div>

        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="Verified payouts" value="N8.4M" change={18} description="Healthy settlement flow this month" />
            <StatCard label="Completed orders" value="1,284" change={9} description="Driven by repeat buyer demand" />
            <StatCard label="Trust score" value="94/100" change={4} description="Improved after verification review" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <RevenueChart
              total={8400000}
              points={[
                { label: 'Jan', value: 320000 },
                { label: 'Feb', value: 490000 },
                { label: 'Mar', value: 640000 },
                { label: 'Apr', value: 710000 },
                { label: 'May', value: 850000 }
              ]}
            />
            <OrdersChart
              total={1284}
              points={[
                { label: 'Jan', value: 84 },
                { label: 'Feb', value: 126 },
                { label: 'Mar', value: 142 },
                { label: 'Apr', value: 166 },
                { label: 'May', value: 192 }
              ]}
            />
          </div>
          <TopProductsTable
            items={[
              { name: 'Solar Backup Kit', unitsSold: 84, revenue: 23520000, trustStatus: 'verified' },
              { name: 'POS Terminal Bundle', unitsSold: 120, revenue: 11400000, trustStatus: 'high-trust' },
              { name: 'Cold Chain Storage Box', unitsSold: 41, revenue: 5822000, trustStatus: 'verified' }
            ]}
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <OrderCard
          orderNumber="#VND-2048"
          status="in-transit"
          items={['Solar Backup Kit', 'Installation package', 'Delivery insurance']}
          totalAmount={612000}
        />
        <div className="grid gap-6">
          <EmptyState
            title="No disputes to review"
            description="Trust workflows stay calm when verified vendors complete orders cleanly and buyers get proactive updates."
            action={
              <Button variant="secondary" leftIcon={<ShieldCheck className="h-4 w-4" />}>
                View trust policies
              </Button>
            }
          />
          <SkeletonLoader showAvatar />
        </div>
      </section>
    </div>
  );
}
