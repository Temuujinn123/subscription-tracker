import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import SubscriptionForm from "@/components/SubscriptionForm";
import {
  useGetSubDetailQuery,
  useUpdateSubMutation,
} from "@/services/subsciption";
import toast from "react-hot-toast";

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
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading } = useGetSubDetailQuery(Number(id), { skip: !id });

  const [handleUpdate, { isLoading: updateIsLoading }] = useUpdateSubMutation();

  const handleSubmit = async (requestData: RequestSub) => {
    toast.promise(
      async () => {
        const response = await handleUpdate({
          id: Number(id),
          body: requestData,
        });

        if ("error" in response) {
          console.error(response.error);

          throw new Error("Failed to update subscription");
        }
      },
      {
        loading: "Loading...",
        success: () => {
          router.push("/dashboard");

          return <b>Success</b>;
        },
        error: (err) => <b>{err.message}</b>,
      }
    );
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  return (
    <div className="max-w-md mx-auto">
      <SubscriptionForm
        initialData={data}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading || updateIsLoading}
      />
    </div>
  );
}
