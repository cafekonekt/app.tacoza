import Image from "next/image";

export const metadata = {
  title: "Loading",
};

// Function to generate a random quote server-side
const getRandomQuote = () => {
  const foodQuotes = [
    "Savor the spice, taste the tradition.",
    "A bite of India in every dish.",
    "Flavors that dance on your tongue.",
    "India's spices, the heart of every meal.",
    "A feast of colors and flavors.",
    "From street food to royal feasts, India has it all.",
    "Every dish tells a story.",
    "Spices that speak to the soul.",
    "Indian food: A symphony of flavors.",
    "Taste the culture, one bite at a time.",
    "Curry, the ultimate comfort food.",
    "Naan-stop deliciousness.",
    "Masala magic in every bite.",
    "Spicy, sweet, and everything in between.",
    "From Tandoor to your table.",
    "Where every meal is a celebration.",
    "Indian food: A journey of taste.",
    "Dal to dessert, always a delight.",
    "A spice for every mood.",
    "Satisfy your soul, Indian style.",
  ];
  return foodQuotes[Math.floor(Math.random() * foodQuotes.length)];
};

export default function Loading() {
  // Generate the random quote
  const quote = getRandomQuote();
  return (
    <main className="h-screen w-full flex flex-col items-center justify-center gap-4 loader-container">
      <div className="text-muted-foreground/70 font-semibold text-sm animate-pulse">
        {quote}
      </div>
      <Image
        src="/loader.gif"
        alt="loading"
        width={50}
        height={50}
        className="opacity-80"
        draggable={false}
      />
    </main>
  );
}
