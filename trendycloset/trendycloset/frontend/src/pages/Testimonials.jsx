const testimonials = [
  {
    name: "Sarah Kim",
    text: "TrendyCloset helped me find brands I love! Super smooth shopping experience.",
  },
  {
    name: "Daniel Owusu",
    text: "The platform makes it easy to discover new fashion. I use it all the time!",
  },
  {
    name: "Leila Rahman",
    text: "As a boutique owner, becoming a partner was one of my best business decisions.",
  },
];

export default function Testimonials() {
  return (
    <div className="min-h-screen bg-white px-4 py-16 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-zinc-900 mb-8">What People Are Saying</h1>
      <div className="space-y-6">
        {testimonials.map((t, index) => (
          <div
            key={index}
            className="border border-zinc-200 p-6 rounded-lg shadow-sm bg-white"
          >
            <p className="text-zinc-600 italic">"{t.text}"</p>
            <p className="text-zinc-900 font-semibold mt-2">— {t.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
