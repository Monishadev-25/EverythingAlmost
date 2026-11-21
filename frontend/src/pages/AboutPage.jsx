import { Link } from 'react-router-dom';
import { ArrowRight, Award, CheckCircle, Feather, Heart, Leaf, Package, ShieldCheck, Sparkles, Star } from 'lucide-react';
import aboutBanner from '../assets/about-banner.jpg';

export function AboutPage() {
  const pillars = [
    {
      icon: Sparkles,
      title: 'Bespoke Artistry',
      description:
        'Every keepsake is customized with precision laser engraving, hand-poured botanical waxes, and artisan monogramming to tell your unique story.',
    },
    {
      icon: Feather,
      title: 'Crafted with Intention',
      description:
        'We believe gifts shouldn’t just look exquisite on the outside; they should evoke genuine warmth, tears of joy, and enduring memories.',
    },
    {
      icon: Leaf,
      title: 'Sustainably Minded',
      description:
        'Our packaging is 100% recyclable, printed with vegetable inks, using non-toxic soy wax and ethically sourced European hardwoods.',
    },
    {
      icon: Heart,
      title: 'Delight Guaranteed',
      description:
        'Every parcel is packed by hand and checked by our studio specialists. We offer our 30-day happiness guarantee on every non-custom item.',
    },
  ];

  const milestones = [
    { number: '50,000+', label: 'Keepsakes Delivered' },
    { number: '4.95 ★', label: 'Customer Delight Score' },
    { number: '100%', label: 'Hand-Finished in Britain' },
    { number: '£50+', label: 'Free Tracked UK Delivery' },
  ];

  const studioImages = [
    {
      url: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=600&auto=format&fit=crop&q=80',
      title: 'Artisan Workshop',
      caption: 'Where memories are brought to life by dedicated craftspeople.',
    },
    {
      url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80',
      title: 'Sub-Surface Laser Engraving',
      caption: 'Micro-point optical glass engraving with unmatched clarity.',
    },
    {
      url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80',
      title: 'Hand-Poured Soy Wax',
      caption: 'Pure organic essential oils infused with soothing fragrances.',
    },
  ];

  const reviews = [
    {
      quote:
        'The 3D crystal photo block of my grandparents’ wedding day brought my mother to tears on Christmas morning. The detail and packaging were nothing short of breathtaking.',
      author: 'Charlotte Harrison',
      location: 'Cotswolds, UK',
      stars: 5,
    },
    {
      quote:
        'Finally a gifting company that treats every order like a work of art. The monogrammed candle and amber packaging feel like a luxury boutique in Mayfair.',
      author: 'James Alistair',
      location: 'Edinburgh, Scotland',
      stars: 5,
    },
    {
      quote:
        'Super fast UK delivery and customer care went above and beyond when I needed a custom engraving date adjusted at the last minute. Outstanding service!',
      author: 'Priya Mehta',
      location: 'London, UK',
      stars: 5,
    },
  ];

  return (
    <div className="bg-[#faf7f2] text-[#241c18] min-h-screen">
      {/* 1. Hero Section */}
      <section
        className="relative overflow-hidden py-16 sm:py-24 border-b border-[#ebdccd] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${aboutBanner})` }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#784d2f] font-semibold tracking-widest uppercase bg-[#eedecf]/90 px-3 py-1 rounded-full border border-[#dfc9b5]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Heritage & Purpose</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#241c18] font-normal tracking-tight leading-tight">
            Thoughtful Gifts for the People Who Matter Most
          </h1>
          <p className="text-sm sm:text-base text-[#5c483b] max-w-2xl mx-auto leading-relaxed">
            Everything Almost was founded with a singular vision: to replace generic presents with meaningful, deeply personal keepsakes that celebrate life’s milestones and everyday bonds.
          </p>
        </div>
      </section>

      {/* 2. Brand Story Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <div className="text-xs font-bold uppercase tracking-wider text-[#784d2f]">
              Handcrafted in the United Kingdom
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#241c18] font-normal leading-snug">
              Every celebration tells a story. We help you engrave it forever.
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-[#5c493c] leading-relaxed">
              <p>
                From our studio in London, our team of designers, engravers, and candle makers craft bespoke keepsakes designed to outlast passing trends. Whether it’s an anniversary crystal engraved with your cherished wedding portrait, or an aromatherapy candle hand-poured with calming lavender and vanilla, each piece receives personal attention.
              </p>
              <p>
                We believe the magic of gift-giving happens the moment the satin ribbon is untied. That’s why every order includes gift-ready packaging, custom handwritten gift notes, and eco-conscious presentation as standard.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#ebdccd]">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#784d2f] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-[#241c18]">Artisan Quality</h4>
                  <p className="text-[11px] text-[#786454]">Tested for timeless durability</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#784d2f] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-[#241c18]">Custom Made</h4>
                  <p className="text-[11px] text-[#786454]">Tailored with names & dates</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80"
                alt="Luxury gift packaging"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[#241a15] text-[#e8dbcc] p-6 rounded-2xl shadow-xl max-w-xs hidden sm:block border border-[#3e2e25]">
              <p className="font-serif text-lg text-[#f1e4d3] leading-snug">
                “Gifting is the poetry of connection.”
              </p>
              <p className="text-[11px] text-[#ad9683] mt-2">— The Everything Almost Studio</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Four Core Pillars */}
      <section className="bg-[#f5ede2] py-16 sm:py-20 border-y border-[#ebdccd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#784d2f]">
              Our Guiding Principles
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#241c18] font-normal">
              Why Choose Everything Almost?
            </h2>
            <p className="text-xs sm:text-sm text-[#6d5747]">
              Every order reflects our uncompromising commitment to artistry, sustainability, and personal care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="bg-[#faf7f2] border border-[#e5d4c1] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="w-10 h-10 rounded-xl bg-[#ede0d1] text-[#784d2f] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </span>
                    <h3 className="font-serif text-base font-semibold text-[#241c18]">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-[#6e5849] leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Numbers / Milestone Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#241a15] rounded-3xl p-8 sm:p-12 text-[#e8dbcc] border border-[#3e2e25] shadow-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-[#3d2f26]">
            {milestones.map((item, idx) => (
              <div key={item.label} className={idx > 0 ? 'pt-6 lg:pt-0' : ''}>
                <div className="font-serif text-3xl sm:text-4xl font-normal text-[#f4e7d7]">
                  {item.number}
                </div>
                <div className="text-xs text-[#aa9581] mt-1 font-medium tracking-wide">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Inside Our Studio */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#784d2f]">
            Behind the Scenes
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#241c18] font-normal">
            Inside Our London Studio
          </h2>
          <p className="text-xs text-[#735e50]">
            From concept design to final ribbon tie, take a glimpse into how our gifts are made.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {studioImages.map((img) => (
            <div
              key={img.title}
              className="bg-white rounded-2xl overflow-hidden border border-[#e5d4c1] shadow-sm group hover:shadow-md transition-shadow"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 space-y-1">
                <h3 className="font-serif text-sm font-semibold text-[#241c18]">{img.title}</h3>
                <p className="text-xs text-[#715c4d]">{img.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Customer Testimonials */}
      <section className="bg-[#f5ede2] py-16 border-t border-[#ebdccd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#784d2f]">
              Recipient Stories
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#241c18] font-normal">
              Words From Our Customers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <div
                key={i}
                className="bg-[#faf7f2] border border-[#e5d4c1] rounded-2xl p-6 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-[#b58840]">
                    {[...Array(r.stars)].map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#46372d] italic leading-relaxed">
                    “{r.quote}”
                  </p>
                </div>
                <div className="pt-4 border-t border-[#ebdccd] mt-4">
                  <div className="text-xs font-semibold text-[#241c18]">{r.author}</div>
                  <div className="text-[11px] text-[#8c7766]">{r.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Bottom CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center space-y-6">
        <h2 className="font-serif text-3xl sm:text-4xl text-[#241c18] font-normal">
          Ready to Create an Unforgettable Gift?
        </h2>
        <p className="text-xs sm:text-sm text-[#6d5747] max-w-lg mx-auto">
          Explore our complete collection of personalized gifts, aromatherapy candles, and holiday gift hampers.
        </p>
        <div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#784d2f] hover:bg-[#623c22] text-white px-8 py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider transition-colors shadow-lg"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

