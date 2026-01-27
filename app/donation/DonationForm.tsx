"use client";

import { useState } from "react";

import { useCheckout } from "@moneydevkit/nextjs";

interface DonationAmountPreset {
  amount: number;
  label: string;
  description?: string;
}

interface DonationFormProps {
  amountPresets: DonationAmountPreset[];
  currency: "SAT" | "USD";
}

export function DonationForm({ amountPresets, currency }: DonationFormProps) {
  const { navigate, isNavigating } = useCheckout();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustom, setIsCustom] = useState(false);

  const handlePresetSelect = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustom(false);
    setCustomAmount("");
  };

  const handleCustomSelect = () => {
    setIsCustom(true);
    setSelectedAmount(null);
  };

  const handleDonate = () => {
    const amount = isCustom ? parseInt(customAmount, 10) : selectedAmount;

    if (!amount || amount <= 0) {
      return;
    }

    navigate({
      type: "AMOUNT",
      title: "Builder Vancouver Donation",
      description: `Thank you for supporting Builder Vancouver with ${amount.toLocaleString()} sats!`,
      amount: amount,
      currency: currency,
      successUrl: "/donation/success",
      metadata: {
        donationType: "donation",
        campaign: "general-fund",
        donationAmount: amount,
      },
    });
  };

  const currentAmount = isCustom ? parseInt(customAmount, 10) || 0 : selectedAmount || 0;
  const isValidAmount = currentAmount > 0;

  return (
    <div className="space-y-6">
      {/* Preset Amounts */}
      <div className="grid grid-cols-2 gap-4">
        {amountPresets.map((preset) => (
          <button
            key={preset.amount}
            onClick={() => handlePresetSelect(preset.amount)}
            className={`p-4 rounded-xl border transition-all ${
              selectedAmount === preset.amount && !isCustom
                ? "border-orange-400 bg-orange-400/10"
                : "border-neutral-800 bg-neutral-900 hover:border-neutral-700"
            }`}
          >
            <span className="block text-xl font-semibold text-neutral-100">
              {preset.label}
            </span>
            {preset.description && (
              <span className="block text-sm text-neutral-400 mt-1">
                {preset.description}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Custom Amount */}
      <div
        className={`p-4 rounded-xl border transition-all ${
          isCustom
            ? "border-orange-400 bg-orange-400/10"
            : "border-neutral-800 bg-neutral-900"
        }`}
      >
        <button
          onClick={handleCustomSelect}
          className="w-full text-left mb-3"
        >
          <span className="text-sm font-medium text-neutral-300">
            Custom Amount
          </span>
        </button>
        {isCustom && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Enter amount"
              min="1"
              className="flex-1 px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-orange-400"
            />
            <span className="text-neutral-400 font-medium">sats</span>
          </div>
        )}
      </div>

      {/* Donate Button */}
      <button
        onClick={handleDonate}
        disabled={!isValidAmount || isNavigating}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
          isValidAmount && !isNavigating
            ? "bg-orange-400 text-neutral-950 hover:bg-orange-300"
            : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
        }`}
      >
        {isNavigating ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </span>
        ) : isValidAmount ? (
          `Donate ${currentAmount.toLocaleString()} sats`
        ) : (
          "Select an amount"
        )}
      </button>

      {/* Lightning Info */}
      <p className="text-center text-sm text-neutral-500">
        Payments are processed via Lightning Network using Money Dev Kit.
        <br />
        Any Lightning-enabled wallet can be used.
      </p>
    </div>
  );
}
