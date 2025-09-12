import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import SubscriptionForm from "@/components/SubscriptionForm";

export default function AddSubscription() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (data: Omit<Subscription, "id">) => {
    setIsLoading(true);

    // In a real app, you would save this to your database via an API call
    console.log("Adding subscription:", data);

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

  return (
    <div className="max-w-md mx-auto">
      <SubscriptionForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
}
