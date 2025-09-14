import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import SubscriptionCard from "@/components/SubscriptionCard";
import StatsCard from "@/components/StatsCard";

export default function Dashboard() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [totalMonthly, setTotalMonthly] = useState(0);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // if (!user) {
    //   router.push("/login");
    //   return;
    // }

    // Mock data - in a real app, you would fetch this from your API
    const mockSubscriptions: Subscription[] = [
      {
        id: "1",
        name: "Netflix",
        price: 15.99,
        cycle: "monthly",
        nextPayment: "2023-06-15",
        category: "entertainment",
      },
      {
        id: "2",
        name: "Spotify",
        price: 9.99,
        cycle: "monthly",
        nextPayment: "2023-06-20",
        category: "music",
      },
      {
        id: "3",
        name: "Adobe Creative Cloud",
        price: 52.99,
        cycle: "monthly",
        nextPayment: "2023-07-01",
        category: "productivity",
      },
    ];

    setSubscriptions(mockSubscriptions);
    setTotalMonthly(
      mockSubscriptions.reduce((total, sub) => total + sub.price, 0)
    );
  }, [user, router]);

  const handleDelete = (id: string) => {
    setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
  };

  // if (!user) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          Dashboard
        </h2>
        <button
          onClick={() => router.push("/subscriptions/add")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + Add Subscription
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Monthly"
          value={`$${totalMonthly.toFixed(2)}`}
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
          trend={{ value: 5.2, isPositive: false }}
        />

        <StatsCard
          title="Active Subscriptions"
          value={subscriptions.length}
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
          trend={{ value: 12.5, isPositive: true }}
        />

        <StatsCard
          title="Next Payment"
          value="$15.99"
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

        {subscriptions.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You don't have any subscriptions yet.
            </p>
            <button
              onClick={() => router.push("/add-subscription")}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
            >
              Add your first subscription
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {subscriptions.map((sub) => (
              <SubscriptionCard
                key={sub.id}
                subscription={sub}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
