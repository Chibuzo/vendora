'use client';

import { Mail } from 'lucide-react';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
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
import { Textarea } from '@/shared/components/ui/textarea';

export function OnboardingRequestModal() {
  return (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="primary">Request onboarding review</Button>
      </ModalTrigger>
      <ModalContent size="sm">
        <ModalHeader>
          <Badge variant="secondary" size="sm">
            Vendor onboarding
          </Badge>
          <ModalTitle className="mt-3">Share onboarding intent</ModalTitle>
          <ModalDescription>
            Example usage of the design-system modal and form controls. Replace this with your real tenant, KYC, and payout intake flow.
          </ModalDescription>
        </ModalHeader>
        <div className="grid gap-4">
          <Input label="Business email" placeholder="owner@brand.com" type="email" leadingIcon={<Mail className="h-4 w-4" />} />
          <Input label="Store name" placeholder="Vendora Home" />
          <Textarea
            label="What are you planning to sell?"
            placeholder="Furniture, apparel, digital goods, or cross-border inventory..."
            helperText="Keep this lightweight for now; a fuller compliance intake can follow."
          />
        </div>
        <ModalFooter>
          <Button variant="outline">Save draft</Button>
          <Button>Submit request</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
