/**
 * Mock customer reviews for Aura Living products.
 *
 * Each review record is keyed by `productId` which matches the `id` field
 * of the corresponding entry in `src/data/products.ts`.
 *
 * Reviews cover 12 products (3 BESTSELLER, 3 NEW, 3 SALE, and 3 other
 * popular products). Each product has 4–6 reviews with a realistic mix of
 * ratings (≈60% 5★, ≈25% 4★, ≈10% 3★, ≈5% 2★), Pakistani author names,
 * Pakistani city locations, and dates spanning the last 6 months.
 *
 * Helpers:
 *   - getReviewsForProduct(productId) → Review[]
 *   - getAverageRating(productId)    → number (0 when no reviews)
 */

export interface Review {
  id: string;
  productId: string;
  author: string;
  location?: string; // e.g. "Lahore", "Karachi"
  rating: number; // 1-5
  title: string;
  body: string;
  date: string; // ISO date (YYYY-MM-DD)
  verified: boolean; // true if verified purchase
  helpful: number; // helpful count
}

export const reviews: Review[] = [
  /* ═══════════════════════════════════════════════════════════════
     Product 1 — Hammered Brass Table Lamp (NEW)
     ═══════════════════════════════════════════════════════════════ */
  {
    id: 'r001',
    productId: '1',
    author: 'Ayesha Khan',
    location: 'Lahore',
    rating: 5,
    title: 'Stunning addition to my living room',
    body: 'The hammered brass finish is even more beautiful in person. The warm glow it casts in the evening is exactly what I wanted for my reading corner. Delivery was quick (3 days to Lahore) and packaging was very secure.',
    date: '2025-05-15',
    verified: true,
    helpful: 12,
  },
  {
    id: 'r002',
    productId: '1',
    author: 'Omar Farooq',
    location: 'Islamabad',
    rating: 5,
    title: 'Quality craftsmanship — feels premium',
    body: 'I was a bit hesitant about the price, but the weight and finish of the brass base immediately justifies it. The linen shade diffuses light softly. Pairs beautifully with my walnut side table. Highly recommend for anyone upgrading their living space.',
    date: '2025-04-28',
    verified: true,
    helpful: 8,
  },
  {
    id: 'r003',
    productId: '1',
    author: 'Fatima Ali',
    location: 'Karachi',
    rating: 4,
    title: 'Beautiful lamp, slight delay in delivery',
    body: 'The lamp itself is gorgeous — the hand-hammered texture is unique to each piece which I love. Took about 6 days to reach Karachi instead of the promised 3-5, but customer support was responsive when I followed up. Worth the wait overall.',
    date: '2025-03-12',
    verified: true,
    helpful: 5,
  },
  {
    id: 'r004',
    productId: '1',
    author: 'Bilal Ahmed',
    location: 'Rawalpindi',
    rating: 5,
    title: 'Exactly as pictured, maybe better',
    body: 'Bought this as a housewarming gift for my sister. She absolutely loved it. The brass has a warm antique tone rather than a flashy polished look, which suits both modern and traditional interiors. Comes well-packaged with styrofoam moulds.',
    date: '2025-02-20',
    verified: true,
    helpful: 3,
  },
  {
    id: 'r005',
    productId: '1',
    author: 'Zainab Hassan',
    location: 'Multan',
    rating: 3,
    title: 'Pretty but smaller than expected',
    body: 'The lamp is well-made and looks elegant, but I expected it to be a bit taller based on the photos. At 45cm it works on a small console but feels lost on my large side table. Still keeping it as the quality is good. Just check dimensions carefully.',
    date: '2025-01-08',
    verified: false,
    helpful: 2,
  },

  /* ═══════════════════════════════════════════════════════════════
     Product 5 — Industrial Wall Sconce (NEW)
     ═══════════════════════════════════════════════════════════════ */
  {
    id: 'r006',
    productId: '5',
    author: 'Usman Tariq',
    location: 'Lahore',
    rating: 5,
    title: 'Perfect for my bedside reading nook',
    body: 'The adjustable arm is the killer feature. I can angle it exactly where I need light without disturbing my wife. The aged brass + matte black combo looks industrial-chic. Installation hardware was included and fit my standard electrical box.',
    date: '2025-05-02',
    verified: true,
    helpful: 15,
  },
  {
    id: 'r007',
    productId: '5',
    author: 'Maryam Iqbal',
    location: 'Karachi',
    rating: 4,
    title: 'Solid sconce, wish it came with a bulb',
    body: 'Beautiful sconce and very sturdy. The arm pivots smoothly without drooping. Only complaint is that it does not ship with an LED bulb — would have been a nice touch at this price point. Otherwise very happy with the purchase.',
    date: '2025-04-15',
    verified: true,
    helpful: 7,
  },
  {
    id: 'r008',
    productId: '5',
    author: 'Hassan Raza',
    location: 'Faisalabad',
    rating: 5,
    title: 'Excellent value for the quality',
    body: 'Bought two of these flanking my hallway mirror. They completely transformed the space. The matte black finish is consistent and the brass detail adds warmth. Electrician charged me a fair bit to install but the sconces themselves are great value.',
    date: '2025-03-05',
    verified: true,
    helpful: 9,
  },
  {
    id: 'r009',
    productId: '5',
    author: 'Sana Malik',
    location: 'Islamabad',
    rating: 3,
    title: 'Nice design but installation instructions vague',
    body: 'The sconce is well-made and looks great on the wall, but the installation guide was a single-page diagram that was hard to follow. Had to look up a YouTube tutorial. Once up though, it works beautifully. Three stars only because of the documentation.',
    date: '2025-02-09',
    verified: false,
    helpful: 1,
  },

  /* ═══════════════════════════════════════════════════════════════
     Product 9 — Terracotta Herb Pot Set (NEW)
     ═══════════════════════════════════════════════════════════════ */
  {
    id: 'r010',
    productId: '9',
    author: 'Hira Yousuf',
    location: 'Lahore',
    rating: 5,
    title: 'My kitchen windowsill finally looks alive',
    body: 'These pots are the perfect size for herbs — I have basil, mint and coriander growing happily. The drainage hole + matching saucer is a thoughtful touch. The matte glaze has a beautiful earthy tone that complements my wooden kitchen counter.',
    date: '2025-05-20',
    verified: true,
    helpful: 18,
  },
  {
    id: 'r011',
    productId: '9',
    author: 'Danish Pirzada',
    location: 'Peshawar',
    rating: 5,
    title: 'Well-made, no chips or cracks on arrival',
    body: 'Ordered two sets — one for myself and one for my mother. Both arrived perfectly intact thanks to the sturdy packaging. The terracotta is properly fired (no porous leaking). The graduated sizes look great arranged together.',
    date: '2025-04-22',
    verified: true,
    helpful: 6,
  },
  {
    id: 'r012',
    productId: '9',
    author: 'Rabia Anwar',
    location: 'Karachi',
    rating: 4,
    title: 'Lovely pots, slightly smaller than imagined',
    body: 'Quality of the glaze and the drainage is excellent. They are a bit smaller than I pictured — fine for herbs or small succulents but not for a full-size plant. Still, three pots at this price is great value. Would buy again.',
    date: '2025-03-18',
    verified: true,
    helpful: 4,
  },
  {
    id: 'r013',
    productId: '9',
    author: 'Asad Mehmood',
    location: 'Multan',
    rating: 2,
    title: 'One pot arrived cracked',
    body: 'The pots themselves are nice but one of the three arrived with a hairline crack along the rim. Customer service did send a replacement within a week, which I appreciated. The other two pots are fine. Just be aware shipping can be rough.',
    date: '2025-01-25',
    verified: true,
    helpful: 3,
  },

  /* ═══════════════════════════════════════════════════════════════
     Product 2 — Smoked Glass Pendant Light (BESTSELLER)
     ═══════════════════════════════════════════════════════════════ */
  {
    id: 'r014',
    productId: '2',
    author: 'Nida Saleem',
    location: 'Lahore',
    rating: 5,
    title: 'The moody glow is unreal over our dining table',
    body: 'We hung three of these in a row over our 6-seater dining table and the effect is exactly what I had pinned on Pinterest. The smoked glass softens the Edison bulb into a warm amber pool. Guests always comment on it. Best home purchase this year.',
    date: '2025-05-18',
    verified: true,
    helpful: 24,
  },
  {
    id: 'r015',
    productId: '2',
    author: 'Talha Iqbal',
    location: 'Islamabad',
    rating: 5,
    title: 'Solid brass canopy, high-quality fixture',
    body: 'I have installed a lot of light fixtures and this one is genuinely well-built. The brass canopy is heavy gauge, not flimsy sheet metal. The glass dome is hand-blown with subtle ripples that catch light beautifully. Worth the investment.',
    date: '2025-04-30',
    verified: true,
    helpful: 11,
  },
  {
    id: 'r016',
    productId: '2',
    author: 'Mahnoor Rashid',
    location: 'Karachi',
    rating: 4,
    title: 'Gorgeous light, cord could be longer',
    body: 'The pendant itself is stunning and the smoked glass is darker than I expected (in a good way). The only issue is the included cord is only about 1.5m which was too short for our 3m ceiling. Had to buy an extension kit separately. Otherwise perfect.',
    date: '2025-03-25',
    verified: true,
    helpful: 6,
  },
  {
    id: 'r017',
    productId: '2',
    author: 'Fahad Khan',
    location: 'Rawalpindi',
    rating: 5,
    title: 'Converted my wife into a home-decor fan',
    body: 'Bought this as a surprise for our anniversary and she has not stopped sending photos to her sisters. The brass detail ages gracefully — we have had it for 4 months and it has developed a lovely patina. Highly recommend pairing with a warm LED filament bulb.',
    date: '2025-02-14',
    verified: true,
    helpful: 14,
  },
  {
    id: 'r018',
    productId: '2',
    author: 'Saba Qureshi',
    location: 'Faisalabad',
    rating: 4,
    title: 'Beautiful but requires a pro to install',
    body: 'The pendant is gorgeous and well-packaged. However, it is heavier than a typical pendant light and our electrician had to reinforce the ceiling rose. Not a DIY job for most people. The smoked glass is the highlight — gives such a moody atmosphere at night.',
    date: '2025-01-12',
    verified: false,
    helpful: 4,
  },

  /* ═══════════════════════════════════════════════════════════════
     Product 7 — Adjustable Brass Reading Lamp (BESTSELLER)
     ═══════════════════════════════════════════════════════════════ */
  {
    id: 'r019',
    productId: '7',
    author: 'Adnan Aslam',
    location: 'Lahore',
    rating: 5,
    title: 'The marble base is the real star',
    body: 'I read for an hour every night and this lamp is the perfect companion. The marble base is genuinely heavy — it does not tip no matter how far I extend the arm. The articulating joints hold their position without drooping. Worth every rupee.',
    date: '2025-05-22',
    verified: true,
    helpful: 21,
  },
  {
    id: 'r020',
    productId: '7',
    author: 'Ayesha Khan',
    location: 'Islamabad',
    rating: 5,
    title: 'Better than the imported lamp I was considering',
    body: 'I was eyeing a similar lamp from a foreign brand at 3x the price. Decided to try Aura Living first and I am so glad I did. The brass has a beautiful warm tone and the pivoting shade lets me direct light onto my book without lighting up the whole room.',
    date: '2025-04-18',
    verified: true,
    helpful: 13,
  },
  {
    id: 'r021',
    productId: '7',
    author: 'Imran Sheikh',
    location: 'Karachi',
    rating: 5,
    title: 'Solid, beautiful, functional',
    body: 'Three things I look for in a reading lamp: stability, light direction and aesthetics. This one nails all three. The weighted marble base is a smart design choice. Brass looks even better in person — slight antiqued finish, not flashy. Highly recommend.',
    date: '2025-03-30',
    verified: true,
    helpful: 9,
  },
  {
    id: 'r022',
    productId: '7',
    author: 'Hira Yousuf',
    location: 'Multan',
    rating: 4,
    title: 'Great lamp, inline switch could be smoother',
    body: 'Love the design and the marble base is properly heavy. The inline switch on the cord feels a bit stiff — you have to push firmly to click it. Otherwise no complaints. The brass has developed a slight patina after a few months which I personally like.',
    date: '2025-02-26',
    verified: false,
    helpful: 3,
  },
  {
    id: 'r023',
    productId: '7',
    author: 'Hassan Raza',
    location: 'Gujranwala',
    rating: 3,
    title: 'Beautiful but mine arrived with a scratched base',
    body: 'The lamp is gorgeous and functions well, but the marble base had a visible scratch on one side. Customer service offered a 15% refund or a replacement base — I took the refund and turned the scratched side to the wall. Quality control could be tighter.',
    date: '2025-01-15',
    verified: true,
    helpful: 5,
  },

  /* ═══════════════════════════════════════════════════════════════
     Product 11 — Hand-Painted Tall Ceramic Planter (BESTSELLER)
     ═══════════════════════════════════════════════════════════════ */
  {
    id: 'r024',
    productId: '11',
    author: 'Maryam Iqbal',
    location: 'Lahore',
    rating: 5,
    title: 'The arabesque pattern is hand-painted, not printed',
    body: 'I was skeptical about the "hand-painted" claim until I received it. Up close you can see the brush strokes — every planter is slightly different. The blue and white combo looks gorgeous against my terracotta wall. Holds my snake plant perfectly.',
    date: '2025-05-25',
    verified: true,
    helpful: 27,
  },
  {
    id: 'r025',
    productId: '11',
    author: 'Usman Tariq',
    location: 'Karachi',
    rating: 5,
    title: 'Became the centerpiece of our entryway',
    body: 'We placed this by the front door with a tall dracaena and it immediately elevates the space. The planter is properly weighted — does not topple even when my kids brush past it. Drainage hole works as described. Packaging was excellent.',
    date: '2025-04-26',
    verified: true,
    helpful: 12,
  },
  {
    id: 'r026',
    productId: '11',
    author: 'Zainab Hassan',
    location: 'Islamabad',
    rating: 5,
    title: 'Even more beautiful than the photos',
    body: 'The photos do not do justice to the depth of the cobalt blue. The gold accents on the rim catch light beautifully. I bought one, loved it, and immediately ordered a second for the other side of my fireplace. Friends keep asking where I got them.',
    date: '2025-04-02',
    verified: true,
    helpful: 16,
  },
  {
    id: 'r027',
    productId: '11',
    author: 'Danish Pirzada',
    location: 'Faisalabad',
    rating: 4,
    title: 'Beautiful planter, drainage hole is small',
    body: 'The hand-painting is exquisite and the planter feels solid. The only minor issue is the drainage hole is quite small — water can pool if you over-water. Easy fix with a layer of gravel at the bottom. Overall very happy with the purchase.',
    date: '2025-03-10',
    verified: true,
    helpful: 5,
  },
  {
    id: 'r028',
    productId: '11',
    author: 'Rabia Anwar',
    location: 'Multan',
    rating: 5,
    title: 'Bought for my mother — she cried',
    body: 'Got this for my mother on Mother\'s Day. She has been collecting blue-and-white ceramics for years and she was genuinely emotional when she saw it. The arabesque pattern reminded her of her grandmother\'s tiles. Quality is museum-worthy.',
    date: '2025-02-08',
    verified: true,
    helpful: 19,
  },
  {
    id: 'r029',
    productId: '11',
    author: 'Talha Iqbal',
    location: 'Peshawar',
    rating: 3,
    title: 'Pattern was not centered on mine',
    body: 'The planter is beautiful and well-made, but the arabesque pattern on mine is slightly off-center — the motif is shifted about 2cm to one side. Not enough to return but noticeable if you look closely. Otherwise solid quality and a good size.',
    date: '2025-01-04',
    verified: false,
    helpful: 2,
  },

  /* ═══════════════════════════════════════════════════════════════
     Product 3 — Crystal Drop Chandelier (SALE)
     ═══════════════════════════════════════════════════════════════ */
  {
    id: 'r030',
    productId: '3',
    author: 'Nida Saleem',
    location: 'Lahore',
    rating: 5,
    title: 'Statement piece for our formal dining room',
    body: 'We had been looking for a chandelier for our new dining room and this one caught my eye during the sale. The crystal drops are real glass (not plastic) and the brass frame is properly polished. Installation took about 2 hours with an electrician. Stunning.',
    date: '2025-05-10',
    verified: true,
    helpful: 17,
  },
  {
    id: 'r031',
    productId: '3',
    author: 'Omar Farooq',
    location: 'Islamabad',
    rating: 5,
    title: 'Sparkles beautifully when lit',
    body: 'The way the crystals refract light at night is magical. Every dinner party someone asks about it. The brass frame has held up well after 4 months — no tarnishing yet. Got it on sale which makes it even sweeter. Highly recommend.',
    date: '2025-04-12',
    verified: true,
    helpful: 8,
  },
  {
    id: 'r032',
    productId: '3',
    author: 'Sana Malik',
    location: 'Karachi',
    rating: 4,
    title: 'Gorgeous chandelier, assembly takes patience',
    body: 'The chandelier itself is beautiful and the crystals are good quality. But each crystal is individually wrapped and needs to be hand-strung onto the frame. Took my electrician and me about 3 hours total. The end result is worth it but be prepared to invest the time.',
    date: '2025-03-08',
    verified: true,
    helpful: 6,
  },
  {
    id: 'r033',
    productId: '3',
    author: 'Asad Mehmood',
    location: 'Rawalpindi',
    rating: 4,
    title: 'Beautiful but verify your ceiling height first',
    body: 'The chandelier is gorgeous and looks much more expensive than the sale price. The only caveat: it hangs down about 60cm from the ceiling once installed. Our dining room has a 3m ceiling so it works, but in a standard 2.7m room it would feel low. Measure first.',
    date: '2025-02-18',
    verified: false,
    helpful: 4,
  },

  /* ═══════════════════════════════════════════════════════════════
     Product 8 — Stained Glass Table Lamp (SALE)
     ═══════════════════════════════════════════════════════════════ */
  {
    id: 'r034',
    productId: '8',
    author: 'Fatima Ali',
    location: 'Lahore',
    rating: 5,
    title: 'Tiffany-style beauty at a fair price',
    body: 'My grandmother had a similar Tiffany lamp and this one captures that same warmth. The amber and emerald glass is genuinely stained (not painted). At night it casts a mosaic glow on the wall that is just gorgeous. The sale price made it a no-brainer.',
    date: '2025-05-05',
    verified: true,
    helpful: 14,
  },
  {
    id: 'r035',
    productId: '8',
    author: 'Imran Sheikh',
    location: 'Karachi',
    rating: 4,
    title: 'Beautiful colors, base is a bit light',
    body: 'The stained glass shade is the highlight — the colors are rich and the brass leading is neatly done. The base could be heavier though; it feels slightly top-heavy when adjusting the switch. I added felt pads which helped. Overall a lovely accent lamp.',
    date: '2025-04-08',
    verified: true,
    helpful: 5,
  },
  {
    id: 'r036',
    productId: '8',
    author: 'Hira Yousuf',
    location: 'Islamabad',
    rating: 5,
    title: 'Perfect for our traditional living room',
    body: 'Our living room has carved wood furniture and this lamp fits right in. The stained glass colors are warm jewel tones that look authentic. Uses a standard bulb. Sale price was great. Packaging kept the glass safe during shipping. No complaints.',
    date: '2025-03-15',
    verified: true,
    helpful: 7,
  },
  {
    id: 'r037',
    productId: '8',
    author: 'Bilal Ahmed',
    location: 'Faisalabad',
    rating: 3,
    title: 'Pretty lamp but colors are darker than photos',
    body: 'The lamp is well-made and the stained glass is genuine. However, in person the amber and emerald are quite a bit darker than they appear in the product photos. During the day it almost looks black until you turn the lamp on. Just be aware of that.',
    date: '2025-02-02',
    verified: false,
    helpful: 2,
  },

  /* ═══════════════════════════════════════════════════════════════
     Product 14 — Bamboo Plant Stand Trio (SALE)
     ═══════════════════════════════════════════════════════════════ */
  {
    id: 'r038',
    productId: '14',
    author: 'Mahnoor Rashid',
    location: 'Lahore',
    rating: 5,
    title: 'Finally my balcony has visual height',
    body: 'These graduated bamboo stands transformed my apartment balcony. I have a tall snake plant on the highest, a fern on the middle, and trailing pothos on the lowest. The bamboo is smooth and well-finished. Folds flat for storage which is a bonus.',
    date: '2025-05-12',
    verified: true,
    helpful: 11,
  },
  {
    id: 'r039',
    productId: '14',
    author: 'Adnan Aslam',
    location: 'Karachi',
    rating: 4,
    title: 'Good value, holds medium plants fine',
    body: 'Bought two sets during the sale. They look elegant and the bamboo is properly treated (no splintering). The largest stand holds a 12-inch pot without wobbling. The smallest stand feels a bit narrow for anything beyond a 6-inch pot. Solid overall.',
    date: '2025-04-19',
    verified: true,
    helpful: 4,
  },
  {
    id: 'r040',
    productId: '14',
    author: 'Zainab Hassan',
    location: 'Islamabad',
    rating: 5,
    title: 'Better than the plastic stands I had before',
    body: 'I was using cheap plastic plant stands before and these are a huge upgrade. The natural bamboo warms up the corner of my living room. The graduated heights create a nice tiered display. They came fully assembled which I appreciated.',
    date: '2025-03-22',
    verified: true,
    helpful: 6,
  },
  {
    id: 'r041',
    productId: '14',
    author: 'Danish Pirzada',
    location: 'Multan',
    rating: 3,
    title: 'Pretty but the joints loosened after a month',
    body: 'The bamboo is beautiful and the stands look great initially. After about a month of use I noticed the joints on the tallest stand had loosened slightly. Tightened them up with a screwdriver and they have been fine since. Decent for the sale price.',
    date: '2025-02-11',
    verified: false,
    helpful: 1,
  },

  /* ═══════════════════════════════════════════════════════════════
     Product 6 — Frosted Glass Globe Lamp (no badge, popular)
     ═══════════════════════════════════════════════════════════════ */
  {
    id: 'r042',
    productId: '6',
    author: 'Saba Qureshi',
    location: 'Lahore',
    rating: 5,
    title: 'The soft glow is perfect for a bedside lamp',
    body: 'I wanted a lamp that would not blind me when I turned it on at night, and the frosted globe does exactly that. The light is even and diffuse, no harsh shadows. The slim brass base is unobtrusive on my nightstand. Excellent purchase.',
    date: '2025-05-08',
    verified: true,
    helpful: 9,
  },
  {
    id: 'r043',
    productId: '6',
    author: 'Hassan Raza',
    location: 'Karachi',
    rating: 5,
    title: 'Minimalist perfection',
    body: 'My apartment is Scandinavian-style and this lamp fits right in. The frosted globe eliminates glare from the bulb. Brass base is slim and modern. The switch has a satisfying click. Pairs well with a warm 2700K LED. Highly recommend.',
    date: '2025-04-14',
    verified: true,
    helpful: 7,
  },
  {
    id: 'r044',
    productId: '6',
    author: 'Ayesha Khan',
    location: 'Islamabad',
    rating: 4,
    title: 'Beautiful lamp, globe can get warm',
    body: 'The frosted globe gives a beautifully even light and the brass base is well-finished. The globe does get noticeably warm with a 60W bulb — switched to a 9W LED and that solved it. Otherwise a gorgeous minimalist lamp.',
    date: '2025-03-19',
    verified: false,
    helpful: 3,
  },
  {
    id: 'r045',
    productId: '6',
    author: 'Talha Iqbal',
    location: 'Faisalabad',
    rating: 4,
    title: 'Great lamp for the price',
    body: 'For a frosted glass lamp at this price point, this is excellent value. The globe is genuine frosted glass (not plastic). Brass base has a clean polished finish. Would have liked a dimmer option but at this price I cannot complain. Recommended.',
    date: '2025-02-05',
    verified: true,
    helpful: 2,
  },

  /* ═══════════════════════════════════════════════════════════════
     Product 10 — Hanging Glass Terrarium (no badge, popular)
     ═══════════════════════════════════════════════════════════════ */
  {
    id: 'r046',
    productId: '10',
    author: 'Maryam Iqbal',
    location: 'Lahore',
    rating: 5,
    title: 'My air plants are thriving in it',
    body: 'I hung two of these in my kitchen window with air plants inside. The geometric diamond shape casts beautiful shadows when the sun comes through. The brass frame is solid and the rope hanger is adjustable. Packaging kept the glass safe.',
    date: '2025-05-19',
    verified: true,
    helpful: 10,
  },
  {
    id: 'r047',
    productId: '10',
    author: 'Fahad Khan',
    location: 'Karachi',
    rating: 5,
    title: 'Floating garden in my reading corner',
    body: 'Hung three of these at different heights in my reading corner with tiny ferns. The effect is exactly what I wanted — a floating garden. The brass frame complements my other Aura Living brass pieces. Hanging hardware included.',
    date: '2025-04-20',
    verified: true,
    helpful: 8,
  },
  {
    id: 'r048',
    productId: '10',
    author: 'Fatima Ali',
    location: 'Islamabad',
    rating: 4,
    title: 'Beautiful, opening is a bit small',
    body: 'The terrarium itself is well-made and the geometric shape is striking. The opening for placing plants inside is quite small — works fine for air plants and small succulents but anything larger needs tweezers. Otherwise excellent quality.',
    date: '2025-03-14',
    verified: false,
    helpful: 3,
  },
  {
    id: 'r049',
    productId: '10',
    author: 'Usman Tariq',
    location: 'Multan',
    rating: 3,
    title: 'Glass cracked after a month',
    body: 'The terrarium looked beautiful and worked well for about 5 weeks. Then I noticed a small crack in the glass near the brass joint — possibly from temperature changes near my window. Aura Living offered a discount on a replacement. Design is nice but glass is thin.',
    date: '2025-02-04',
    verified: true,
    helpful: 2,
  },

  /* ═══════════════════════════════════════════════════════════════
     Product 18 — Hammered Brass Decorative Bowl (no badge, popular)
     ═══════════════════════════════════════════════════════════════ */
  {
    id: 'r050',
    productId: '18',
    author: 'Zainab Hassan',
    location: 'Lahore',
    rating: 5,
    title: 'Perfect catchall for our entryway',
    body: 'I keep this by the front door for keys, spare change, and the mail. The hammered texture catches light beautifully every time I walk in. It has developed a subtle patina after 3 months which I love. Looks far more expensive than it was.',
    date: '2025-05-14',
    verified: true,
    helpful: 13,
  },
  {
    id: 'r051',
    productId: '18',
    author: 'Omar Farooq',
    location: 'Islamabad',
    rating: 5,
    title: 'Beautiful fruit bowl for the dining table',
    body: 'We use this as a fruit bowl on our dining table and it gets comments every time we have guests. The hammered finish is consistent across the surface. Brass is food-safe for dry items (we keep apples and oranges in it). Properly weighted — does not slide.',
    date: '2025-04-23',
    verified: true,
    helpful: 9,
  },
  {
    id: 'r052',
    productId: '18',
    author: 'Bilal Ahmed',
    location: 'Karachi',
    rating: 4,
    title: 'Lovely bowl, develops patina quickly',
    body: 'The bowl is well-made and the hammered texture is gorgeous. Be aware that the brass develops a patina fairly quickly — within a month I noticed darker patches. This is a feature not a flaw, but if you want the shiny look you will need to polish it occasionally.',
    date: '2025-03-27',
    verified: true,
    helpful: 5,
  },
  {
    id: 'r053',
    productId: '18',
    author: 'Hira Yousuf',
    location: 'Faisalabad',
    rating: 4,
    title: 'Great centerpiece, smaller than expected',
    body: 'The hammered detail is beautiful and the brass quality is good. The bowl is on the smaller side — works as a catchall or for small fruit but is not large enough to be a true centerpiece on a big dining table. Check the dimensions before buying.',
    date: '2025-02-15',
    verified: false,
    helpful: 2,
  },
];

/**
 * Returns all reviews for a given product, in the order they were authored
 * (oldest first in this file). Consumers are expected to sort as needed.
 */
export function getReviewsForProduct(productId: string): Review[] {
  return reviews.filter((r) => r.productId === productId);
}

/**
 * Returns the average star rating across all reviews for a product.
 * Returns 0 when the product has no reviews.
 */
export function getAverageRating(productId: string): number {
  const productReviews = getReviewsForProduct(productId);
  if (productReviews.length === 0) return 0;
  return productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
}
