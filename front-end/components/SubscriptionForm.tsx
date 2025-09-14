import { useState } from "react";
import toast from "react-hot-toast";

interface SubscriptionFormProps {
  initialData?: Partial<Subscription>;
  onSubmit: (data: RequestSub) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function SubscriptionForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: SubscriptionFormProps) {
  const [formData, setFormData] = useState<RequestSub>({
    name: initialData?.name || "",
    price: initialData?.price || "",
    billingCycle: initialData?.billingCycle || "monthly",
    nextBillingDate: initialData?.nextBillingDate || "",
    category: initialData?.category || "entertainment",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (formData.name.trim() === "")
      return toast.error("Please enter Service Name");

    if (formData.price == 0) return toast.error("Please enter Price");

    if (formData.billingCycle.trim() === "")
      return toast.error("Please enter Billing Cycle");

    if (formData.nextBillingDate.trim() === "")
      return toast.error("Please enter Next Payment Date");

    if (formData.category.trim() === "")
      return toast.error("Please enter Category");

    onSubmit({
      ...formData,
      price: parseFloat(formData.price as string),
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {initialData?.id ? "Edit Subscription" : "Add New Subscription"}
      </h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Service Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Price
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                $
              </span>
            </div>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              step="0.01"
              required
              className="block w-full pl-7 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="billingCycle"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Billing Cycle
          </label>
          <select
            id="billingCycle"
            name="billingCycle"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            value={formData.billingCycle}
            onChange={handleChange}
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        <div className="relative">
          <label
            htmlFor="nextBillingDate"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Next Payment Date
          </label>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            id="nextBillingDate"
            name="nextBillingDate"
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            value={formData.nextBillingDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="entertainment">Entertainment</option>
            <option value="productivity">Productivity</option>
            <option value="utilities">Utilities</option>
            <option value="education">Education</option>
            <option value="health">Health & Fitness</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isLoading
              ? "Saving..."
              : initialData?.id
              ? "Update"
              : "Add Subscription"}
          </button>
        </div>
      </div>
    </div>
  );
}
