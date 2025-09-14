import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import SubscriptionForm from "@/components/SubscriptionForm";

// Mock data - in a real app, you would fetch this from your API based on the ID
const mockSubscription: any = {
  id: 1,
  name: "Netflix",
  price: 15.99,
  cycle: "monthly",
  nextPayment: "2023-06-15",
  category: "entertainment",
};

export default function EditSubscription() {
  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      // In a real app, you would fetch the subscription data based on the ID
      setSubscription(mockSubscription);
    }
  }, [id]);

  const handleSubmit = async (data: RequestSub) => {
    setIsLoading(true);

    // In a real app, you would update this in your database via an API call
    console.log("Updating subscription:", data);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1000);
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  if (!user) {
    router.push("/login");
    return null;
  }

  if (!subscription) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <SubscriptionForm
        initialData={subscription}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
}
