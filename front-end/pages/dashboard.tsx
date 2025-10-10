import { useEffect } from "react";
import SubscriptionCard from "@/components/SubscriptionCard";
import StatsCard from "@/components/StatsCard";
import {
  useDeleteSubMutation,
  useGetSubsQuery,
  useGetSubStatsQuery,
} from "@/services/subsciption";
import toast from "react-hot-toast";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/services/store";

export default function Dashboard() {
  const { token } = useSelector((state: RootState) => state.auth);

  const { data, isLoading } = useGetSubsQuery(undefined, {
    skip: !token,
  });
  const { data: statsData, isLoading: statsIsLoading } = useGetSubStatsQuery(
    undefined,
    {
      skip: !token,
    },
  );

  const [handleDelete] = useDeleteSubMutation();

  useEffect(() => {
    if (isLoading || statsIsLoading) {
      toast.loading("Loading...");
    } else {
      toast.remove();
    }
  }, [isLoading, statsIsLoading]);

  const deleteHandler = (id: number) => {
    toast.promise(
      async () => {
        const response = await handleDelete(id);

        if (response.error) {
          console.error("Failed to register: ", response.error);

          if ("data" in response.error) {
            throw new Error(String(response.error.data));
          }

          throw new Error("Failed to register.");
        }
      },
      {
        loading: "Loading...",
        success: <b>Success</b>,
        error: (err) => <b>{err.message}</b>,
      },
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          Dashboard
        </h2>
        <Link href="/subscriptions/add">
          <button
            type="button"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            + Add Subscription
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Monthly"
          value={`$${(statsData?.totalMonthly || 0).toFixed(2)}`}
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          // trend={{ value: 5.2, isPositive: false }}
        />

        <StatsCard
          title="Active Subscriptions"
          value={statsData?.activeCount || 0}
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
          }
          // trend={{ value: 12.5, isPositive: true }}
        />

        <StatsCard
          title="Next Payment"
          value={`$${(statsData?.nextPayment || 0).toFixed(2)}`}
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Your Subscriptions
          </h3>
        </div>

        {data && data?.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You don&apos;t have any subscriptions yet.
            </p>
            <Link href="/subscriptions/add">
              <button
                type="button"
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
              >
                Add your first subscription
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {data &&
              data.map((sub) => (
                <SubscriptionCard
                  key={sub.id}
                  subscription={sub}
                  onDelete={deleteHandler}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
