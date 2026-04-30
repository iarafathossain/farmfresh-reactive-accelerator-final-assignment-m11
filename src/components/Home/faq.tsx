"use client";

import { useState } from "react";

const items = [
  {
    value: "freshness",
    question: "How fresh is the produce I receive?",
    answer: [
      "Our produce is sourced directly",
      "From local farmers and harvested",
      "Only after your order is placed,",
      "Ensuring maximum freshness and quality.",
    ],
  },
  {
    value: "delivery",
    question: "How does delivery work?",
    answer: [
      "Once you place an order, farmers",
      "Prepare your items and we deliver",
      "Them straight to your doorstep",
      "Within 24–48 hours, depending on your location.",
    ],
  },
  {
    value: "farmers",
    question: "Can I choose or know the farmers I buy from?",
    answer: [
      "Yes! You can view farmer profiles,",
      "learn about their practices, and",
      "choose produce from specific local",
      "farmers you trust.",
    ],
  },
  {
    value: "pricing",
    question: "Are your prices competitive?",
    answer: [
      "By connecting you directly with farmers,",
      "we eliminate middlemen - giving you",
      "fair prices while ensuring farmers",
      "earn more for their produce.",
    ],
  },
  {
    value: "availability",
    question: "What if an item is out of stock?",
    answer: [
      "Since we depend on seasonal harvests,",
      "availability may vary. If an item is",
      "unavailable, we’ll suggest fresh",
      "alternatives or notify you when it’s back in stock.",
    ],
  },
];

function AccordionItem({
  value,
  question,
  answer,
  openValue,
  onToggle,
}: {
  value: string;
  question: string;
  answer: string[];
  openValue: string | null;
  onToggle: (val: string) => void;
}) {
  const isOpen = openValue === value;

  return (
    <div className="shadow-lg p-4 rounded-lg">
      <button
        onClick={() => onToggle(value)}
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-4 py-5 text-left text-base transition-colors duration-200 ${
          isOpen
            ? "text-green-700 dark:text-green-500"
            : "text-stone-800 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-500"
        }`}
      >
        <span>{question}</span>
        <span
          className={`flex-shrink-0 w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? "bg-green-700 border-green-700 text-white rotate-45"
              : "border-current text-current"
          }`}
        >
          <svg
            viewBox="0 0 10 10"
            className="w-2.5 h-2.5 stroke-current fill-none stroke-2"
            strokeLinecap="round"
          >
            <line x1="5" y1="1" x2="5" y2="9" />
            <line x1="1" y1="5" x2="9" y2="5" />
          </svg>
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="list-disc list-inside text-sm font-light text-stone-500 dark:text-gray-300 leading-relaxed pb-5 pr-10">
            {answer.map((line, index) => (
              <li key={index} className="mb-1">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  const [open, setOpen] = useState<string | null>("freshness");

  const handleToggle = (val: string) => {
    setOpen((prev) => (prev === val ? null : val));
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Customer Questions Frequently Asked
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Answers to common questions about our service and how we work with
            local farmers
          </p>
        </div>
        <div>
          {items.map((item) => (
            <AccordionItem
              key={item.value}
              {...item}
              openValue={open}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
