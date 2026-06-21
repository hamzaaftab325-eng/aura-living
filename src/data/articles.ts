export interface Article {
  slug: string;
  title: string;
  excerpt: string; // 1-2 sentence summary
  body: string; // markdown-style content with ## headings and paragraphs
  category: 'styling' | 'care' | 'trends' | 'lifestyle' | 'behind-the-scenes';
  tags: string[];
  author: { name: string; role: string };
  date: string; // ISO date
  readingTime: number; // minutes
  coverImage: string; // path like /images/blog/article-1.webp
  featured?: boolean;
}

export const articles: Article[] = [
  {
    slug: 'how-to-style-a-console-table',
    title: 'How to Style a Console Table: 5 Designer-Approved Looks',
    excerpt:
      'A console table is the most versatile stage in your home. Here are five designer-approved arrangements that work in entryways, hallways, and behind sofas.',
    body: `## Why the Console Table Matters

The console table is the unsung hero of the well-styled home. Narrow enough to tuck into a hallway, low enough to sit behind a sofa, and elegant enough to anchor an entryway — it is the stage where the first impression of your home is set. In Pakistani homes, where entryways are often tight and living rooms do double duty as formal receiving spaces, the console is the single most hardworking piece of furniture you can own.

The trick is to treat the console like a vignette rather than a surface for clutter. A great console styling tells a small story in three layers: a tall anchor, a medium sculptural piece, and a low decorative detail. Get the proportions right and the rest follows.

## Look 1 — The Entryway Anchor

For a foyer console, start with a round mirror hung six to eight inches above the table. The mirror bounces light into narrow hallways and gives you a last-minute check before you head out. Below it, place a tall table lamp on one side — brass or ceramic, around 60cm tall — and pair it with a low, wide bowl on the other. The bowl can hold keys, a single stem of jasmine, or nothing at all.

- Mirror: round, 50–60cm diameter
- Lamp: 55–65cm tall, brass or ceramic base
- Bowl: shallow ceramic or hand-painted porcelain
- Optional: a stack of two art books underneath the bowl for height

Avoid the temptation to fill every inch. Negative space is what makes the vignette feel intentional rather than crowded.

## Look 2 — The Behind-the-Sofa Library

When a console sits behind a floating sofa, it becomes a library bar. Keep the surface low so sightlines across the room stay clear. Use a pair of matching table lamps — symmetry reads as formal and grounded — and a small cluster of three to five books between them. Top the books with a small brass object: a paperweight, a tiny bowl, or a sculptural finial.

This is also the perfect spot for a small tray with a decanter and two glasses. Even if you do not drink, the silhouette of cut crystal against brass is its own reward.

## Look 3 — The Gallery Wall Base

Let the console be the foundation of a larger composition. Hang a salon-style gallery wall above it — five to nine framed pieces in a mix of sizes — and let the console hold just two objects: a substantial lamp and a single tall vase with branches. The art carries the visual weight; the console simply grounds it.

The vase should be roughly two-thirds the height of the lamp. Anything shorter will look like an afterthought; anything taller will fight the lamp for attention.

## Look 4 — The Minimalist Stone Top

For a modern, almost gallery-like feel, choose a console with a stone top — marble, travertine, or our hand-finished onyx. Style it with a single object: one sculptural ceramic, one bronze figure, or one tall bud vase with a single stem. The stone does the talking; the object simply marks the spot.

This look works best in homes with clean architecture and a restrained palette. If your living room already has patterned rugs and layered textiles, this minimalist console will feel underdressed. Save it for the calmest corner of the house.

## Look 5 — The Seasonal Display

The console is the easiest place in the house to mark the seasons without redecorating everything. In spring, a cluster of three bud vases with sweet peas. In monsoon, a low bowl of floating candles. In winter, a tall brass candlestick with a single beeswax pillar. Swap one element every three months and the rest of the room feels fresh.

The key to seasonal styling is restraint. One change is enough. Two changes start to look like a shop window; three changes look like a sale.

## Common Mistakes to Avoid

- **Too many small objects.** Three strong pieces beat ten small ones every time.
- **Lamp too short.** A 30cm lamp looks like a toy on a 80cm console. Go tall.
- **Mirror hung too high.** The bottom of the mirror should sit 10–15cm above the table.
- **Ignoring the wall.** The wall above the console is part of the composition. Use it.

## Final Thoughts

Styling a console is not about following rules — it is about understanding proportion, restraint, and the rhythm of objects. Once you have the three-layer formula in your head (tall, medium, low), you can riff on it for the rest of your life. The console will be the most photographed surface in your home. Give it the love it deserves.`,
    category: 'styling',
    tags: ['console table', 'entryway', 'styling', 'vignette', 'living room'],
    author: { name: 'Ayesha Khan', role: 'Lead Stylist' },
    date: '2025-07-14',
    readingTime: 6,
    coverImage: '/images/blog/article-1.webp',
    featured: true,
  },
  {
    slug: 'candle-care-101-soy-candles-last-longer',
    title: 'Candle Care 101: Make Your Soy Candles Last 50% Longer',
    excerpt:
      'A few small habits can extend the life of your hand-poured soy candles by weeks. Here is the complete care routine our studio swears by.',
    body: `## Why Soy Wax Deserves Better Care

Soy wax is the cleanest-burning wax available — it produces no soot, holds fragrance beautifully, and is fully biodegradable. But soy is also softer than paraffin, which means it is more forgiving in some ways and more demanding in others. A poorly cared-for soy candle can tunnel, smoke, or lose its scent in a matter of hours. A well-cared-for one will burn cleanly for 50% longer than the label promises.

The good news is that the care routine is simple. Four habits, practiced every burn, will transform how your candles perform.

## The First Burn Is Everything

The first time you light a soy candle, let it burn until the entire surface is liquid — edge to edge. For a standard 200g candle, this takes about two hours. For a 500g candle, plan on three to four.

This is called the "memory burn" and it is the single most important thing you will ever do for a candle. Wax has memory: it will only ever melt as far as it melted the first time. If you let it pool to the edges on burn one, every subsequent burn will follow suit. If you snuff it after 30 minutes, you have just created a permanent tunnel that no amount of later burning will fix.

- 200g candle: 2 hours for the first burn
- 500g candle: 3–4 hours for the first burn
- Never burn longer than 4 hours — the wick will mushroom and smoke

## Trim the Wick Every Single Time

Before every burn — every single one — trim the wick to 5mm. Not 1cm, not "approximately." 5mm. A long wick produces a tall flame that burns too hot, which scorches the fragrance oils and creates soot. A short wick produces a small, even flame that vaporises the fragrance gently.

Use a wick trimmer, not scissors. Wick trimmers are angled to reach into the jar and cut flat, leaving a clean edge. Scissors mangle the wick and leave debris in the wax.

After trimming, brush the charred tip out of the wax with a clean tissue. Any debris left in the pool will smoke when you light the candle.

## Keep It Away from Drafts

A draft — from a ceiling fan, an open window, an air conditioner — makes the flame flicker, which makes the wax melt unevenly, which makes the candle tunnel. Soy wax is particularly sensitive because it melts at a low temperature; even a gentle breeze can blow the flame sideways and burn one side of the jar while the other side stays solid.

If you must burn a candle near a fan, rotate the jar 90 degrees every half hour. This is not ideal, but it is better than letting the candle burn lopsided.

## Extinguish Properly

Never blow out a candle. Blowing sprays liquid wax across the surface, scatters soot into the air, and can deform the wick. Use a candle snuffer — a small bell-shaped tool that smothers the flame — or dip the wick into the wax pool with a wick dipper and lift it back up. Both methods produce zero smoke and leave the wick coated in fresh wax, which makes the next lighting easier.

If you do not own a snuffer, place a non-flammable lid on the jar for three seconds. The lack of oxygen will put the flame out gently.

## Storage Matters

Soy wax is a sponge for fragrance — both its own and everyone else's. Store candles with the lid on, in a cool, dark place. Do not store them in the kitchen (they will absorb cooking smells) or in direct sunlight (the wax will yellow and the fragrance will fade).

A scented candle stored correctly will keep its full strength for two years. A scented candle stored in a sunny window will be half its strength in three months.

## When to Stop Burning

Stop burning a container candle when 1cm of wax remains. Below that, the flame gets too close to the glass, the wax overheats, and the jar can crack. The remaining 1cm is not waste — you can scoop it out with a spoon, melt it in a wax warmer, and enjoy the last few hours of fragrance.

## The 50% Longer Claim

Here is the math. A 200g soy candle, burned carelessly (short first burn, untrimmed wicks, blown out), will give you roughly 25 hours of burn time. The same candle, burned with the four habits above, will give you 38–42 hours. That is not a marketing number — it is the actual difference between a tunneled candle and a clean one.

Buy fewer candles. Burn them better.`,
    category: 'care',
    tags: ['candles', 'soy wax', 'care', 'home fragrance'],
    author: { name: 'Mariam Raza', role: 'Product Care Specialist' },
    date: '2025-08-02',
    readingTime: 5,
    coverImage: '/images/blog/article-2.webp',
  },
  {
    slug: 'choosing-the-right-lamp-size',
    title: 'Choosing the Right Lamp Size for Any Room',
    excerpt:
      'Too tall and it shouts. Too short and it disappears. Here is the sizing formula that takes the guesswork out of every lamp purchase.',
    body: `## The Two Numbers That Matter

When you are shopping for a lamp, two dimensions matter more than any other: the total height of the lamp (including shade and base), and the diameter of the shade. Everything else — finish, switch type, bulb wattage — is secondary. Get the height and the shade right and the lamp will look correct in any room. Get them wrong and no amount of styling will save it.

The rule of thumb is the **three-thirds rule**: the lamp should be roughly one-third the height of the surface it sits on, one-third the height of whatever it is next to (a sofa arm, a headboard, a piece of art), and one-third the height of the wall space above it. You do not have to hit all three exactly, but you should hit at least two.

## Table Lamps for Living Rooms

For a console table or side table that is 75–80cm tall, choose a lamp that is 55–65cm tall overall. Anything shorter will look like a toy. Anything taller will block sightlines and feel top-heavy.

The shade should be roughly two-thirds the height of the base. So if the base is 40cm, the shade should be 25–28cm tall. The shade diameter should be about 2.5cm wider than the base on each side — this keeps the proportions honest.

- Console table 75cm: lamp 55–65cm tall
- Side table 60cm: lamp 45–55cm tall
- Nightstand 55cm: lamp 40–50cm tall
- Desk 75cm: lamp 35–45cm tall (lower so it does not block the monitor)

## The Sofa Test

If the lamp is going next to a sofa, sit on the sofa and look at the lamp. The bottom of the shade should be at eye level or just below. If the shade is above eye level, you will see the bulb — which is uncomfortable and unflattering. If the shade is well below eye level, you will be reading in your own shadow.

Most sofa arms are 60–65cm tall, which means the lamp on the side table next to the sofa should be 55–65cm tall overall. If your side table is short (50cm), buy a taller lamp (65cm). If your side table is tall (75cm), buy a shorter lamp (50cm). The total height of table-plus-lamp should land around 115–125cm — roughly the eye level of a seated adult.

## Floor Lamps

Floor lamps should be 150–170cm tall overall. Below 150cm, the light source is below eye level for anyone standing, which feels dim and awkward. Above 170cm, the lamp starts to feel like a streetlight and the light becomes too overhead.

For reading floor lamps (the kind with a swing arm or a directional shade), the bottom of the shade should sit around 120–130cm off the floor — just above shoulder height when you are seated. This throws the light onto your book without casting your head in shadow.

For ambient floor lamps (the kind with a paper or fabric shade that throws light up and down), the shade itself should be 35–45cm tall and the lamp overall should be 155–165cm. These are the lamps that replace overhead lighting in a living room; they need to be tall enough to actually illuminate the room.

## Bedside Lamps

Bedside lamps are the most commonly mis-sized lamp in the home. The mistake is buying a lamp that is too short. Your nightstand is probably 50–55cm tall, your mattress is 55–60cm, and your head, when you are sitting up reading, is around 110–120cm off the floor. The lamp needs to clear the pillow and throw light onto your lap, which means the bottom of the shade should sit at 110–120cm off the floor. Subtract the nightstand height (55cm) and you get a lamp height of 55–65cm.

If you buy a 35cm lamp for your bedside — which is what most people do, because it looks small and unobtrusive in the shop — you will end up reading in your own shadow within a week. Go tall.

## Pendant and Ceiling Lights

For a dining table pendant, the bottom of the shade should sit 70–85cm above the table surface. This is high enough that no one's view is blocked but low enough that the light actually illuminates the food. For a hallway pendant, the bottom of the shade should sit at least 210cm above the floor — any lower and tall guests will hit their heads.

For living room flush mounts or semi-flush mounts, allow at least 220cm of clearance from the floor to the bottom of the fixture. In rooms with low ceilings (under 240cm), stick with flush mounts; semi-flush mounts need at least 260cm to look correct.

## Final Advice

Buy the lamp for the room you have, not the room you wish you had. Measure your table, your sofa, your ceiling, and your eye level before you shop. Bring a tape measure to the store. The lamp that looks perfect in a 4-metre showroom will look like a toothpick in a 2.7-metre Karachi apartment.

A well-sized lamp disappears into the room. A poorly sized lamp is the only thing you see.`,
    category: 'styling',
    tags: ['lighting', 'lamps', 'sizing', 'interior design'],
    author: { name: 'Ayesha Khan', role: 'Lead Stylist' },
    date: '2025-08-21',
    readingTime: 7,
    coverImage: '/images/blog/article-3.webp',
  },
  {
    slug: 'monsoon-care-for-indoor-plants',
    title: "Monsoon Care for Indoor Plants: A Pakistani Homeowner's Guide",
    excerpt:
      'The monsoon brings relief from the heat — and a wave of fungal infections for your indoor plants. Here is how to keep your greenery thriving through July and August.',
    body: `## The Monsoon Challenge

The Pakistani monsoon is a strange season for indoor plants. The temperature drops ten degrees, the humidity jumps from 40% to 90%, and the light dims as clouds settle in for weeks. Plants that were thriving on a sunny windowsill in June suddenly start yellowing, drooping, or growing a mysterious white fuzz on their soil.

The good news: monsoon is not inherently bad for plants. Many tropical species — pothos, philodendron, monstera, snake plants — actually love the humidity. The bad news: the same humidity that feeds them also feeds fungi, bacteria, and pests. The trick is to manage water, light, and airflow with monsoon-specific rules.

## Watering: Less, Not More

This is the counterintuitive part. The monsoon feels wet, so you would think your plants need less water — but actually they need much less water, because the combination of high humidity and low light means the soil takes far longer to dry out. A snake plant that drank its water in four days in June might take ten days in August.

The rule of thumb in monsoon: **water half as often as you did in summer**. If you were watering every Sunday, switch to every other Sunday. If you were watering when the top inch of soil was dry, switch to watering when the top three inches are dry.

- Snake plants, ZZ, pothos: every 14–21 days
- Philodendron, monstera: every 10–14 days
- Ferns, calatheas: every 7–10 days (they still love moisture)
- Succulents, cacti: every 21–30 days — basically pause watering

Never water in the evening. Water in the morning so the surface has the day to dry. Evening watering in monsoon guarantees fungal growth overnight.

## Light: Chase the Brightest Spot

Cloud cover reduces indoor light by 30–60% depending on your windows. A south-facing window that gave your plant 8 hours of direct sun in May might give it 3 hours of weak filtered light in August. Move plants closer to the glass, clean the windows (a dirty window can block 20% of light), and rotate pots every few days so all sides get their turn.

If you have a plant that was barely making it in a dim corner in June, the monsoon will finish it off. Move it now to the brightest spot in the house — even if that spot is not where you want it aesthetically. Plants are not decorative objects in monsoon; they are patients.

## Airflow: The Forgotten Ingredient

Stagnant humid air is the perfect incubator for fungal spores. A small fan running on low speed in the room — not pointed at the plants, just circulating the air — cuts fungal infections by 70%. If you do not have a fan, open windows on dry afternoons when the rain pauses.

Avoid crowding plants together. In summer, a cluster of pots looks lush and beautiful. In monsoon, that same cluster is a petri dish. Give every plant at least 15cm of clearance on all sides.

## Spotting Trouble Early

Walk your plants every Sunday morning and look for these signs:

- **Yellowing lower leaves:** overwatering. Skip the next two waterings.
- **White fuzz on soil surface:** fungal growth. Scrape off the top 1cm of soil, replace with fresh dry soil, and reduce watering.
- **Brown crispy leaf edges:** humidity is too high and the plant cannot transpire. Increase airflow.
- **Soft black patches on leaves:** bacterial rot. Cut the affected leaves off immediately with sterilised scissors and isolate the plant.
- **Tiny webs under leaves:** spider mites, which love monsoon. Wipe leaves with a dilute neem oil solution every five days.

## The Plants That Love Monsoon

Not everything struggles. These plants will actually look better in August than they did in May:

- Pothos (money plant) — loves the humidity, will push new growth
- Philodendron — same family, same love of moisture
- Calathea and Maranta — prayer plants thrive in 80%+ humidity
- Ferns — Boston, maidenhair, and bird's nest ferns all rejoice
- Peace lily — will bloom more freely in the humidity

If you have been wanting to add a calathea to your collection, August is the month. It will establish twice as fast as it would in April.

## The Plants to Watch Closely

- Succulents and cacti — pause watering almost entirely
- Snake plants (Sansevieria) — root rot risk is highest in monsoon
- Fiddle leaf fig — hates the drop in light, will drop leaves
- Rubber plant — watch for powdery mildew on the leaves

## After the Monsoon

When the rains end in September, do not immediately return to your summer watering schedule. The transition takes two to three weeks. Increase water gradually, move plants back from the glass (the October sun is stronger than August), and inspect every plant for pests that took hold during the humid weeks.

A monsoon that is survived well leaves your plants stronger, bushier, and more resilient. A monsoon that is survived poorly leaves you with an empty pot and a lesson learned. The difference is mostly about water.`,
    category: 'care',
    tags: ['plants', 'monsoon', 'indoor plants', 'pakistan', 'care'],
    author: { name: 'Sana Ahmed', role: 'Plant Care Specialist' },
    date: '2025-07-28',
    readingTime: 7,
    coverImage: '/images/blog/article-4.webp',
  },
  {
    slug: '2025-home-decor-trends',
    title: '2025 Home Decor Trends: What is In and What is Out',
    excerpt:
      'The era of grey-on-grey minimalism is over. Here is what is actually showing up in designer homes in 2025 — and what to retire from your living room.',
    body: `## The Big Shift

If you have been watching interiors closely, you already know the story: 2025 is the year maximalism finally won. Not the chaotic, cluttered maximalism of the early 2010s — a more disciplined version, where every object is chosen with intention and the room tells a story. The cold grey-on-grey minimalist look that dominated Pinterest from 2018 to 2023 is officially over. In its place: warmth, texture, colour, and a return to craft.

Here is what is in, what is out, and what to do about it.

## What Is In

### Warm Metallics

Brass, bronze, and unlacquered copper are everywhere. The cool chrome and polished nickel of the 2010s have been retired. Warm metals age beautifully — they develop a patina that tells the story of the home — and they pair well with the warm wood tones and cream textiles that define the current palette.

The trick with warm metals is to mix them sparingly. One brass lamp, one bronze picture frame, one copper vase in a room is plenty. Three or more and the room starts to look like a jewellery shop.

### Handcrafted Ceramics

Mass-produced ceramics are out. Hand-thrown, slightly imperfect, deeply individual pieces are in. The interest in craft is partly aesthetic — a hand-thrown bowl has a soul that a machine-made bowl does not — and partly ethical. Buyers want to know who made their objects, where, and how.

Lahore and Multan are producing some of the most interesting ceramics in South Asia right now. Look for pieces with visible throwing marks, irregular glazes, and a sense of the maker's hand.

### Layered Textiles

The single-texture room (one rug, one set of cushions, one throw) is over. The 2025 room layers textiles: a flatweave kilim over a jute base, a silk cushion against a linen one, a wool throw over a velvet armchair. The mix should feel accidental, even if it is not.

- Layer a small rug over a large one — kilim on jute, Persian on sisal
- Mix cushion fabrics: silk, linen, wool, velvet, in a constrained palette
- Drape a throw diagonally, never square — the diagonal reads as effortless
- Add one textile with fringe or tassels — the movement softens the room

### Earthy, Grounded Colour

Cool greys are out. Warm creams, soft terracottas, deep olive greens, and the colour of dried roses are in. The palette is earthy and slightly faded, as if everything has been gently sun-bleached. Think of a Mediterranean village at sunset, not a Scandinavian showroom.

If you are repainting, look at limewash paints — they have a soft, chalky finish that absorbs light beautifully and develops depth over time. They are more expensive than emulsion, but they transform a room in a way that emulsion cannot.

### Curved Furniture

The sharp, boxy silhouettes of mid-century modern are being softened. Curved sofas, round dining tables, arched mirrors, and bulbous ceramic lamps are in. The curve is more inviting, more human, and more forgiving in small Pakistani apartments where a sharp-edged sofa feels like an obstacle.

### Statement Stone

A single beautiful piece of stone — a marble coffee table, a travertine console, an onyx side table — anchors a room. The stone does not have to be expensive; it has to be interesting. Look for slabs with strong veining, unusual colour, or visible fossils.

## What Is Out

### Cool Grey Everything

The all-grey room — grey walls, grey sofa, grey rug, grey cushions — is the look that defined 2018 to 2022 and is now actively working against you. If your home still looks like this, the cheapest upgrade you can make is a warm-toned rug and a set of cream cushions. The grey will instantly read as more intentional.

### Word Art

"Live Laugh Love," "Bless This Mess," "Home Sweet Home" — these mass-produced word signs are firmly out. Replace them with actual art, even if it is a single framed print. The wall is not a place for motivational posters.

### Faux Industrial

The galvanised-metal-shelving, edison-bulb, factory-cart-coffee-table look was fun for a decade. It is over. The reclaimed industrial aesthetic now reads as dated rather than edgy. If you have an edison bulb fixture, swap the bulbs for warm white globes — the fixture will instantly feel more current.

### All-White Kitchens

The all-white kitchen — white cabinets, white counters, white backsplash, white floor — is being replaced by kitchens with warmth. Two-tone cabinets (warm wood lower, cream upper), stone counters with visible movement, and tile backsplashes in earthy colours are all in. The all-white kitchen looks like a showroom; the new kitchen looks like a place where someone actually cooks.

### Matching Furniture Sets

The five-piece matching bedroom set, the matching dining table and sideboard, the matching sofa and loveseat — these are the surest sign of a room that was furnished in a single shopping trip. The 2025 room mixes pieces from different eras, different woods, and different sources. It takes longer to assemble, but it is the difference between a room and a showroom.

## How to Update Without Replacing Everything

You do not need to gut your home. Start with three changes:

1. **Repaint the walls.** Swap cool grey for warm cream. One weekend, huge impact.
2. **Replace the rug.** Trade a solid grey rug for a vintage Persian or a warm kilim. The rug is the largest piece of colour in the room.
3. **Add one warm metal.** A brass lamp, a bronze mirror frame, a copper vase. One is enough to shift the temperature of the room.

These three changes will take a 2019-grey-on-grey room and bring it 70% of the way to 2025. The rest is a matter of slowly replacing matching sets with found pieces, layering textiles, and learning to leave negative space.

The trend cycle will move on, as it always does. But the underlying shift — away from cold minimalism and toward warm, handcrafted, story-rich interiors — is not a trend. It is a correction, and it is here to stay.`,
    category: 'trends',
    tags: ['trends', '2025', 'colour', 'styling', 'interior design'],
    author: { name: 'Ayesha Khan', role: 'Lead Stylist' },
    date: '2025-08-09',
    readingTime: 8,
    coverImage: '/images/blog/article-5.webp',
  },
  {
    slug: 'art-of-layering-lighting',
    title: 'The Art of Layering Lighting: Ambient, Task, and Accent',
    excerpt:
      'A well-lit room is never lit by a single source. Here is the three-layer lighting system that turns a flat room into a layered, living space.',
    body: `## Why One Light Is Never Enough

The most common lighting mistake in Pakistani homes is the single overhead fixture. One ceiling light, dead centre of the room, throws an even wash of light that flattens every surface, kills every shadow, and makes the room feel like an office. It is functional and lifeless.

A well-lit room is built in three layers, each with a different job: ambient light to fill the space, task light to do work, and accent light to highlight beauty. Get all three layers right and the room glows. Get only the first layer right and the room is merely illuminated.

## Layer 1: Ambient Light

Ambient light is the foundation. It is the light you walk into when you flip the switch — the general illumination that lets you see the room. In most homes, this is a ceiling fixture: a flush mount, a semi-flush mount, or a pendant.

The ambient layer should be warm (2700K–3000K), dimmable, and soft. Avoid bare bulbs and clear glass shades — they create harsh shadows and glare. Look for shades in opal glass, fabric, or frosted acrylic that diffuse the light evenly.

For rooms larger than 4×4 metres, a single ambient fixture will not be enough. Layer in a second ambient source: a floor lamp that throws light up onto the ceiling (an "uplight"), or a pair of wall sconces that wash the walls with light. The goal is to fill the room with a soft glow that has no obvious source.

- Ceiling height under 2.7m: flush mount
- Ceiling height 2.7–3.0m: semi-flush mount
- Ceiling height over 3.0m: pendant or chandelier
- Living room: pair the ceiling light with at least one uplight floor lamp

## Layer 2: Task Light

Task light is the workhorse. It is the focused, directional light that lets you read, cook, work, or apply makeup without straining your eyes. Task light is brighter than ambient light (often 3000K–3500K), more directional, and always positioned close to the work surface.

In a living room, task light is the table lamp next to the reading chair — the one with the bottom of the shade at shoulder height. In a kitchen, task light is the under-cabinet lighting that throws light onto the counter. In a bedroom, task light is the bedside lamp that lets you read without lighting the whole room. In a bathroom, task light is the sconces flanking the mirror (never above the mirror, which casts shadows under your eyes).

Task light should always have its own switch. You do not want to turn on every light in the room to read a book, and you do not want to read by the ambient light.

- Reading chair: table lamp, 55–65cm tall, shade at shoulder height
- Kitchen counter: under-cabinet LED strip, 4000K, dimmable
- Bedside: lamp with a switch reachable from lying down
- Bathroom mirror: pair of sconces at eye level, 60W equivalent each
- Home office: articulated desk lamp that throws light from the side, not above

## Layer 3: Accent Light

Accent light is the artist. It is the light that highlights a painting, grazes a stone wall, lights a bookshelf from within, or uplights a tall plant. Accent light does not illuminate the room — it illuminates the things in the room.

This is the layer that most homes skip, and it is the layer that separates a designed room from a furnished one. Accent light creates depth, drama, and focus. It is what makes a room feel alive at night.

Common accent sources:

- **Picture lights** mounted above artwork, throwing a soft wash down the canvas
- **Recessed adjustable fixtures** ("gimbal downlights") aimed at a wall, a sculpture, or a textured surface
- **Bookcase LED strips** hidden under each shelf, throwing light onto the books below
- **Uplights** at the base of a tall plant or a textured wall, creating a dramatic upward wash
- **Candlelight** — the original accent light, still the most flattering

Accent light should be roughly one-third the brightness of the ambient layer. Too bright and it competes; too dim and it disappears. The right level is "noticeable but not the first thing you see."

## The Layering Rule

In any room where you spend more than thirty minutes at a time — living room, bedroom, dining room, kitchen — you should have at least one fixture in each layer. That is the minimum. The best rooms have two or three sources in each layer, all on separate switches, so you can compose the light to match the moment.

A typical living room might have:

- Ambient: a ceiling semi-flush mount + an uplight floor lamp in the corner
- Task: a table lamp next to the sofa + a floor lamp next to the reading chair
- Accent: a picture light above the mantel + a small uplight at the base of a tall plant

That is six light sources in one room, all on separate switches. It sounds like a lot, and it is — but the effect is a room that can shift from "bright morning" to "intimate dinner" to "movie night" with the flick of three switches.

## The Dimmer Is Non-Negotiable

Every light in every layer should be on a dimmer. A dimmer multiplies the usefulness of every fixture: the same reading lamp that throws full light for a novel can dim to a 20% glow for a quiet evening. The same ceiling light that fills the room for a party can dim to a candle-like flicker for a dinner.

If you are renovating, install dimmers everywhere. If you are renting, buy plug-in dimmers for your lamps — they exist, they are cheap, and they transform the room.

## Bulb Colour Matters

The colour temperature of your bulbs is as important as the fixtures. Warm white (2700K) is the colour of candlelight and sunset — it is flattering, calming, and right for living spaces. Cool white (4000K) is the colour of an overcast sky — it is energising and right for workspaces. Daylight (5000K+) is the colour of a hospital — it is harsh and almost never right for a home.

Mix colour temperatures deliberately. Living rooms and bedrooms should be all 2700K. Kitchens can mix 2700K ambient with 4000K task. Bathrooms should be 3000K throughout — flattering but bright enough to apply makeup.

## Compose, Do Not Just Illuminate

Lighting is the difference between a room and a space. Get the three layers right and the room will feel like it was designed — even if the furniture is modest. Get only the first layer right and no amount of beautiful furniture will save the room from feeling flat.

Walk through your home tonight at 8pm. Turn off every light. Then turn on one light at a time, in each layer, and notice what changes. That is the start of a layered lighting plan.`,
    category: 'styling',
    tags: ['lighting', 'interior design', 'ambient', 'task', 'accent'],
    author: { name: 'Hamza Sheikh', role: 'Lighting Designer' },
    date: '2025-07-05',
    readingTime: 8,
    coverImage: '/images/blog/article-6.webp',
  },
  {
    slug: 'behind-the-scenes-lahore-artisans-brass',
    title: 'Behind the Scenes: Meet the Lahore Artisans Behind Our Brass Collection',
    excerpt:
      'Every brass piece in our collection passes through six pairs of hands before it reaches your home. Here is the workshop in Lahore where it all happens.',
    body: `## The Workshop

Tucked into a narrow lane in the old metalworking quarter of Lahore, behind an unmarked green door, is a workshop that has been working brass for four generations. The ceiling is high, the floor is concrete, and the air smells of beeswax and hot metal. Six artisans work here — two masters, three journeymen, and one apprentice — and together they produce every brass piece in the Aura Living collection.

We visited on a Tuesday morning in March, when the workshop was in the middle of a run of 200 candleholders. What follows is a record of that day.

## Master Shahid — The Founder

Master Shahid is seventy-one years old and has been working brass since he was twelve. He learned the trade from his uncle, who learned it from his father, who learned it from a craftsman in Peshawar whose name is no longer remembered. Shahid's hands are stained a permanent dark from decades of patination work, and his eyes have the calm focus of a man who has shaped ten thousand objects.

"I do not design," he told us, through a translator. "I remember. Everything I make, I have seen before — in my uncle's hands, in my father's hands, in the old pieces in the Lahore Museum. My job is to remember correctly."

Shahid does the final patination on every piece. He mixes the chemical wash that gives the brass its warm, lived-in colour — a recipe he will not share, even with his own sons. The recipe, he says, is the only thing he has that cannot be replaced.

## The Process — Six Hands, One Object

A brass candleholder takes eleven days from raw ingot to finished piece, and passes through six pairs of hands.

### 1. Casting (Master Rizwan)

The process begins with Master Rizwan, who melts brass ingots in a graphite crucible at 1050°C and pours the molten metal into a sand mould. The mould is made by hand, packed around a wooden pattern that Shahid carved thirty years ago. The casting takes twenty minutes; the cooling takes six hours.

Rizwan has been casting for forty years. He can tell by the colour of the flame whether the brass is at the right temperature — a skill no pyrometer can replace.

### 2. Filing and Shaping (Imran)

Once cooled, the rough casting is given to Imran, who files away the sprue (the channel where the metal was poured) and shapes the piece to its final form. He uses files of six different grades, working from coarse to fine, and finishes with a piece of worn denim that gives the brass a soft, even surface.

Imran is twenty-eight and has been with the workshop for ten years. He is the fastest filer Shahid has ever trained. A candleholder that takes a journeyman four hours to file takes Imran ninety minutes.

### 3. Soldering and Assembly (Bilal)

For pieces with multiple parts — a candleholder with a detachable bobèche, a lamp with a harp and finial — Bilal does the assembly. He uses a silver solder that melts at a lower temperature than brass, which lets him join parts without distorting them. The joints, once polished, are invisible.

Bilal is the youngest journeyman in the workshop. He is twenty-three and joined as an apprentice at sixteen. He is also the only one in the workshop who uses a smartphone — the others prefer their old feature phones — and he runs the workshop's informal Instagram, posting photos of finished pieces to a small but devoted following.

### 4. Sanding and Smoothing (Asif)

Asif takes the assembled piece and sands it through five grades of paper, from 220 grit to 2000 grit, until the surface is mirror-smooth. This is the most physically demanding job in the workshop — Asif stands at his bench for eight hours a day, and his forearms are the size of most men's thighs.

"This is the step that decides whether the piece is good or not," Asif said. "If I rush, every later step shows it. If I do it right, no one notices — which is the point."

### 5. Patination (Master Shahid)

Shahid applies the patina — the warm, slightly dark, slightly uneven colour that distinguishes our brass from the bright yellow brass of mass-produced pieces. The process takes three dips in three different solutions, with a hand-rubbing between each. The whole thing takes forty-five minutes and cannot be hurried.

"I am not painting the brass," Shahid said. "I am asking it to remember what colour it wants to be."

### 6. Final Polish and Wax (Kamran)

Kamran, the apprentice, does the final polish with a soft cloth and a coat of beeswax. The wax protects the patina from oxidising further and gives the piece the soft, lived-in sheen that is the signature of the workshop. Kamran is seventeen. He is Shahid's grandson. He started as an apprentice six months ago and will be a journeyman in three years, if he progresses as expected.

"My grandfather says I will be the one who takes over the recipe," Kamran said, quietly. "He has not told me yet. But I will be ready."

## The Brass Itself

The workshop uses a specific alloy — 65% copper, 33% zinc, 2% lead — that Shahid has been buying from the same supplier in Lahore for forty years. The alloy is softer than modern cartridge brass, which makes it easier to work by hand, and it takes the patina in a way that harder brasses do not.

Every ingot arrives with a handwritten certificate of analysis from the supplier. Shahid keeps every certificate, filed by date, in a wooden cabinet in the corner of the workshop. There are forty years of certificates in there.

## Why Handmade Matters

A machine can produce a brass candleholder in four minutes. The workshop produces one in eleven days. The machine candleholder will be perfect — identical to every other candleholder the machine has produced, identical to every candleholder it will produce in the future. The handmade candleholder will be slightly imperfect — a tiny variation in the patina, a barely visible file mark on the underside, a weight that is a gram or two different from the next piece in the batch.

The imperfection is the point. It is the proof that a person made this. It is what will make the piece look better in twenty years than it does today, as the patina deepens and the small marks become part of the object's story.

When you buy a brass piece from Aura Living, you are buying eleven days of six people's time. You are buying Master Shahid's memory, Master Rizwan's eye for flame, Imran's speed, Bilal's solder, Asif's forearms, Shahid's patina recipe, and Kamran's first careful coats of wax. You are buying a small piece of Lahore.

That is what handmade means. And it is worth every rupee.`,
    category: 'behind-the-scenes',
    tags: ['brass', 'artisans', 'lahore', 'handcrafted', 'behind the scenes'],
    author: { name: 'Zainab Malik', role: 'Editor at Large' },
    date: '2025-06-22',
    readingTime: 7,
    coverImage: '/images/blog/article-7.webp',
  },
  {
    slug: 'creating-a-calm-corner-mindful-space',
    title: 'Creating a Calm Corner: 7 Essentials for a Mindful Space',
    excerpt:
      'Every home needs one corner that asks nothing of you. Here are the seven objects that turn a forgotten nook into a daily retreat.',
    body: `## Why a Calm Corner

The Pakistani home is a busy place. There is the formal drawing room for guests, the family room for television, the kitchen for the constant cooking, the children's rooms for the constant noise. Every room has a purpose, and every purpose requires something of you.

A calm corner is different. It is a small space — sometimes no more than a single chair and a small table — that asks nothing. You do not entertain there. You do not work there. You do not watch anything there. You sit, you breathe, you read a few pages, you drink a cup of tea. Five minutes becomes ten. Ten becomes fifteen. The corner becomes the part of the day you most look forward to.

Here are the seven objects that make a calm corner work. You do not need all seven — but each one adds something.

## 1. A Single Comfortable Chair

The chair is the cornerstone. It should be the most comfortable seat in the house — softer than the sofa, deeper than the dining chair, more supportive than the bed. An armchair with a low back (so your shoulders drop), a deep seat (so your hips are lower than your knees), and a soft texture (linen, boucle, or velvet, not leather) is ideal.

The chair should face away from the television and away from the kitchen. Ideally, it faces a window — even a small one — or a wall with a single piece of art. The view from the chair should be quiet.

Avoid chairs with arms that are too high. They tense the shoulders. Avoid chairs that are too upright. They do not let you sink in. The right chair disappears under you.

## 2. A Small Side Table

The table should be just large enough to hold a cup of tea, a book, and a candle. No larger. A large side table invites clutter — magazines, mail, the children's homework — and clutter is the enemy of calm.

The table should be the same height as the arm of the chair, or an inch lower. Too high and your tea is at your shoulder; too low and you have to bend to reach it. The exact right height lets you pick up your cup without looking.

A round table is better than a square one in a small corner — no sharp corners to bump into, and the circle softens the geometry of the space.

## 3. A Soft, Warm Light

Overhead light is wrong for a calm corner. You want a single, warm, low light — a small table lamp with a fabric shade, no taller than 35cm, fitted with a 2700K bulb at no more than 40W equivalent. The light should be just bright enough to read by and dim enough to make the rest of the room recede.

If you can put the lamp on a dimmer, do. A dimmable lamp lets you adjust the light to the time of day — brighter for morning tea, dimmer for evening reflection.

Candlelight is also right for a calm corner, but candles are for the deliberate session, not the everyday one. The lamp is for daily use.

## 4. A Throw Blanket

Drape a soft throw over the arm of the chair. Not a heavy blanket — a light one, in cashmere, fine wool, or a high-quality cotton. The throw should be the colour of the room, not a contrasting accent. It is a comfort object, not a decorative one.

The throw serves two purposes. The first is physical: the weight of a blanket on your lap lowers your heart rate. This is well-documented. The second is psychological: the act of unfolding a blanket and laying it across your lap is a small ritual that signals to your body that you are about to rest. Rituals are how we give ourselves permission to slow down.

## 5. A Cup, Not a Mug

The cup you drink from in your calm corner should not be the cup you drink from anywhere else in the house. A small porcelain cup, a hand-thrown ceramic mug, a brass katori — anything that is beautiful, slightly fragile, and reserved only for this corner. The cup is part of the ritual.

Pour your tea or coffee into the cup at the kitchen counter, carry it to the corner, and sit down. Do not refill it from the corner — when it is empty, the session is over. This sounds rigid, but the constraint is what gives the corner its power. Without a constraint, the corner becomes just another place to drink tea while checking your phone.

## 6. A Book, Not a Screen

The calm corner is a screen-free zone. There is no phone, no tablet, no laptop. There is a book — ideally a physical book, not an e-reader — and nothing else to compete with it.

The book does not have to be serious. It can be poetry, a novel, a book of essays, a slowly-read memoir. What matters is that it is something you read for the reading, not for the information. A calm corner is not a place to learn; it is a place to be.

Keep a small stack of three books on the floor next to the chair. When you finish one, replace it. The stack is a small library of intention — these are the books I am reading slowly, on purpose, in the corner.

## 7. One Living Thing

A single plant, a single stem in a vase, a single bowl of fruit — one living thing in the corner connects the space to the world outside. The living thing does not have to be high-maintenance. A pothos cutting in water, refilled once a week, is enough. A single rose in a slim vase, replaced every five days, is enough.

The living thing is a reminder that time passes. The plant grows. The flower opens and fades. The corner is not a museum; it is a small, slow conversation with the world.

## How to Use the Corner

The corner does not work if you do not use it. The trick is to make it a daily habit, even if only for five minutes.

Pick a time — first thing in the morning, mid-afternoon, or just before bed — and sit in the corner every day for a week. Do not check your phone. Do not turn on the television. Just sit. Drink your tea. Read your book. Look out the window if there is one.

By the end of the week, the corner will be the part of the day you protect. By the end of the month, it will be the part of the day you cannot do without.

That is what a calm corner does. It does not change your home. It changes your day.`,
    category: 'lifestyle',
    tags: ['mindfulness', 'calm', 'wellness', 'corner', 'lifestyle'],
    author: { name: 'Sana Ahmed', role: 'Lifestyle Editor' },
    date: '2025-08-15',
    readingTime: 6,
    coverImage: '/images/blog/article-8.webp',
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getRelatedArticles(slug: string, count = 3): Article[] {
  const current = getArticleBySlug(slug);
  if (!current) return articles.slice(0, count);
  const sameCategory = articles.filter(
    (a) => a.slug !== slug && a.category === current.category
  );
  if (sameCategory.length >= count) return sameCategory.slice(0, count);
  const others = articles.filter(
    (a) => a.slug !== slug && a.category !== current.category
  );
  return [...sameCategory, ...others].slice(0, count);
}
