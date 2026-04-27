// src/components/landing/PricingTabs.jsx

import { useMemo, useState } from "react";
import {
  Check,
  Sparkles,
  Crown,
  Link,
  Rocket,
  Gem
} from "lucide-react";

export default function PricingTabs({
  texts,
  initialRate
}) {
  const [billing, setBilling] = useState("monthly");
  const [currency, setCurrency] = useState("MXN");
  

  // Live rate from Astro server
const usdRate = Number(initialRate);

  const formatPrice = (mxn) => {
    if (currency === "MXN") {
      return mxn.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }

    return (mxn / usdRate).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const plans = useMemo(() => {
    if (billing === "onetime") {
  return [
    {
      name: texts.starter,
      price: 499,
      desc: texts.starterDesc,
      cta: texts.getStarted,
      items: [
        "Foto artista",
        "Logo",
        "Redes sociales",
        "Bio premium",
        texts.oneTimeNote
      ]
    },
    {
      name: texts.pro,
      price: 899,
      desc: texts.proDesc,
      featured: true,
      cta: texts.getStarted,
      items: [
        "Tracks section",
        "Releases",
        "Featured track",
        "Themes",
        texts.oneTimeNote
      ]
    },
    {
      name: texts.max,
      price: 1499,
      desc: texts.maxDesc,
      crown: true,
      cta: texts.getStarted,
      items: [
        "Videos",
        "Merch",
        "Collabs",
        "Brand setup",
        texts.oneTimeNote
      ]
    }
  ];
}

if (billing === "yearly") {
  return [
    {
      name: texts.starter,
      price: 999,
      desc: texts.starterDesc,
      cta: texts.getStarted,
      items: ["Artist page", "Themes", "Links", "Support"]
    },
    {
      name: texts.pro,
      price: 1430,
      desc: texts.proDesc,
      featured: true,
      cta: texts.getStarted,
      items: ["Tracks", "Releases", "Videos", "Priority support"]
    },
    {
      name: texts.max,
      price: 2870,
      desc: texts.maxDesc,
      crown: true,
      cta: texts.getStarted,
      items: ["Everything in Pro", "Merch", "Collabs", "VIP support"]
    }
  ];
}

    return [
      {
        name: texts.free,
        price: 0,
        desc: texts.freeDesc,
        cta: texts.start,
        items: ["Bio", "Links", "Contacto"]
      },
      {
        name: texts.starter,
        price: 149,
        desc: texts.starterDesc,
        cta: texts.getStarted,
        items: [
          "Artist photo",
          "Logo",
          "Links",
          "Contact"
        ]
      },
      {
        name: texts.pro,
        price: 249,
        desc: texts.proDesc,
        featured: true,
        cta: texts.getStarted,
        items: [
          "Themes",
          "Tracks",
          "Releases",
          "Videos"
        ]
      },
      {
        name: texts.max,
        price: 499,
        desc: texts.maxDesc,
        cta: texts.getStarted,
        items: [
          "Everything in Pro",
          "Merch",
          "Collabs",
          "VIP support"
        ]
      }
    ];
  }, [billing, texts]);

  return (
    <div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between mb-10">

        {/* Billing */}
        <div className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-1 flex-wrap gap-1">

          {[
            ["monthly", texts.monthly],
            ["yearly", texts.yearly],
            ["onetime", texts.onetime]
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setBilling(key)}
              className={`px-4 h-11 rounded-xl text-sm transition ${
                billing === key
                  ? "bg-white text-black font-medium"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}

        </div>

        {/* Currency */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">

          <div className="flex items-center gap-3">

            <span className="text-sm text-zinc-500">
              {texts.currency}
            </span>

            <div className="p-1 rounded-2xl border border-white/10 bg-white/5 flex gap-1">

              <button
                onClick={() => setCurrency("MXN")}
                className={`px-4 h-10 rounded-xl text-sm transition ${
                  currency === "MXN"
                    ? "bg-white text-black font-medium"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                MXN
              </button>

              <button
                onClick={() => setCurrency("USD")}
                className={`px-4 h-10 rounded-xl text-sm transition ${
                  currency === "USD"
                    ? "bg-white text-black font-medium"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                USD
              </button>

            </div>

          </div>

          <span className="text-xs text-zinc-500">
            1 USD = {usdRate.toFixed(2)} MXN
          </span>

        </div>

      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {plans.map((plan, index) => {
          const featured = plan.featured;

          return (
            <div
              key={index}
              className={`relative rounded-3xl border p-8 transition duration-300 hover:-translate-y-1 ${
                featured
                  ? "border-violet-500/40 bg-violet-500/5 shadow-2xl shadow-violet-500/10 scale-[1.02]"
                  : plan.crown
                  ? "border-yellow-500/20 bg-white/5"
                  : "border-white/10 bg-white/5"
              }`}
            >

              {featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 h-9 rounded-full bg-white text-black text-sm font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {texts.mostPopular}
                </div>
              )}

              {plan.crown && (
                <div className="absolute top-5 right-5">
                  <Crown className="w-5 h-5 text-yellow-400" />
                </div>
              )}

              <div className="flex items-center gap-2">

  {plan.name === texts.free && (
    <Link className="w-5 h-5 text-zinc-400" />
  )}

  {plan.name === texts.starter && (
    <Rocket className="w-5 h-5 text-cyan-400" />
  )}

  {plan.name === texts.pro && (
    <Gem className="w-5 h-5 text-violet-400" />
  )}

  {plan.name === texts.max && (
    <Crown className="w-5 h-5 text-yellow-400" />
  )}

  <h3 className="text-white text-xl font-semibold">
    {plan.name}
  </h3>

</div>

              <p className="text-zinc-400 mt-2 text-sm min-h-10">
                {plan.desc}
              </p>

              <div className="mt-5 text-4xl font-semibold text-white">
                {formatPrice(plan.price)}
              </div>

              <div className="text-zinc-500 text-sm mt-1">
                {billing === "yearly"
                  ? texts.yearlyLabel
                  : billing === "onetime"
                  ? ""
                  : texts.monthlyLabel}
              </div>

              <ul className="mt-8 space-y-3 text-sm text-zinc-300">

                {plan.items.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <Check className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}

              </ul>

              <button
                className={`mt-8 w-full py-3 rounded-2xl font-medium transition ${
                  featured
                    ? "bg-white text-black hover:scale-[1.02]"
                    : "border border-white/10 text-white hover:bg-white/10"
                }`}
              >
                {plan.cta}
              </button>

            </div>
          );
        })}

      </div>

    </div>
  );
}