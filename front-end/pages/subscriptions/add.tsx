import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import SubscriptionForm from "@/components/SubscriptionForm";
import { useCreateSubMutation } from "@/services/subsciption";
import toast from "react-hot-toast";

export default function AddSubscription() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const [handleCreateSub, { isLoading: createIsLoading }] =
    useCreateSubMutation();

  const handleSubmit = async (data: RequestSub) => {
    setIsLoading(true);

    toast.promise(createSubHandler(data), {
      loading: "Loading...",
      success: <b>Success</b>,
      error: (err) => <b>{err.message}</b>,
    });

    setIsLoading(false);
  };

  const createSubHandler = async (data: RequestSub) => {
    const response = await handleCreateSub(data);

    if ("error" in response && response.error) {
      console.error("Failed to create sub: ", response.error);

      if ("data" in response.error) {
        throw new Error(String(response.error.data));
      }

      throw new Error("Failed to create sub.");
    }

    router.push("/dashboard");
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto">
      <SubscriptionForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading || createIsLoading}
      />
    </div>
  );
}
