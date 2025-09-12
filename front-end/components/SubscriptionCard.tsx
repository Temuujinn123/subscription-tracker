// components/SubscriptionCard.tsx
import Link from "next/link";

interface SubscriptionCardProps {
  subscription: Subscription;
  onDelete: (id: string) => void;
}

export default function SubscriptionCard({
  subscription,
  onDelete,
}: SubscriptionCardProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      entertainment:
        "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      productivity:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      utilities:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      education:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      health: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      other: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-colors duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
            {subscription.name}
          </h3>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            ${subscription.price}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            per {subscription.cycle}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
            subscription.category
          )}`}
        >
          {subscription.category}
        </span>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Next payment:{" "}
          <span className="font-medium">{subscription.nextPayment}</span>
        </p>
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        <Link
          href={`/edit-subscription/${subscription.id}`}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(subscription.id)}
          className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md text-sm hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
