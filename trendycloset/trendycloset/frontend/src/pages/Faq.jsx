import { useState } from 'react';

const faqs = [
  {
    question: "How do I become a partner?",
    answer: "Click on 'Become a Partner' on the homepage and fill out the signup form. Once approved, you can start uploading your products."
  },
  {
    question: "How can I track my order?",
    answer: "After placing an order, you'll receive an email with a tracking number and updates through your TrendyCloset dashboard."
  },
  {
    question: "Is TrendyCloset available worldwide?",
    answer: "We currently support shipping in selected countries. More regions are being added soon!"
  },
  {
    question: "Can I return items?",
    answer: "Yes, we offer a 14-day return window on most products. Check the return policy for each item."
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white px-4 py-16 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-zinc-900 mb-8">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-zinc-200 rounded-md p-4">
            <button
              onClick={() => toggle(index)}
              className="w-full text-left font-semibold text-zinc-800 focus:outline-none"
            >
              {faq.question}
            </button>
            {openIndex === index && (
              <p className="mt-2 text-zinc-600">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
 