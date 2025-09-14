interface Subscription {
  id: number;
  name: string;
  price: number;
  billingCycle: string;
  nextBillingDate: string;
  email?: string;
  category: string;
  isActive?: boolean;
  createdAt: Date;
  updateAt: Date;
}

interface RequestSub {
  name: string;
  price: number | string;
  billingCycle: string;
  nextBillingDate: string;
  category: string;
}
