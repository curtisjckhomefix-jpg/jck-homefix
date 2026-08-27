export type Service = {
  slug: string;
  name: string;
  short: string;
  /** One-sentence summary used in cards and meta descriptions. */
  blurb: string;
  emergency: boolean;
  icon: string;
  intro: string[];
  includes: string[];
  signs: string[];
  faqs: { q: string; a: string }[];
};

export const services: Service[] = [
  {
    slug: "emergency-water-extraction",
    name: "Emergency Water Extraction",
    short: "Water Extraction",
    blurb:
      "Truck-mounted and portable extraction to pull standing water out fast, before it soaks into subfloor and framing.",
    emergency: true,
    icon: "droplet",
    intro: [
      "Standing water does not sit still. Within minutes it wicks into drywall, subfloor, insulation, and framing, and every hour it sits multiplies what has to be torn out later.",
      "We extract with truck-mounted and portable units sized to the job, then map the moisture with meters and thermal imaging so we know how far the water actually travelled — which is almost always further than it looks.",
    ],
    includes: [
      "Standing water removal from floors, carpet, and crawl spaces",
      "Moisture mapping with meters and thermal imaging",
      "Carpet and pad lifting, evaluation, and disposal when unsalvageable",
      "Contents moved out of the wet zone and blocked up",
      "Documented photos and moisture readings for your insurance claim",
    ],
    signs: [
      "Standing or pooling water anywhere in the structure",
      "Water spreading under walls into adjoining rooms",
      "Soaked carpet that squelches underfoot",
      "Water running down into a crawl space or basement",
    ],
    faqs: [
      {
        q: "How fast do I need to act?",
        a: "Immediately. The industry standard treats the first 24 to 48 hours as the window where materials are still drying candidates rather than demolition candidates. Past roughly 48 hours, mold growth becomes the assumption rather than the risk, and the job gets substantially more expensive.",
      },
      {
        q: "Should I shut the water off myself first?",
        a: "Yes, if you can do it safely. Shut off the supply at the fixture or the main, and kill power to affected rooms at the breaker if water is anywhere near outlets or panels. Do not walk into standing water in a room with live electrical.",
      },
    ],
  },
  {
    slug: "structural-drying",
    name: "Structural Drying & Dehumidification",
    short: "Structural Drying",
    blurb:
      "Engineered drying with air movers and commercial dehumidifiers, monitored daily until materials hit documented dry standard.",
    emergency: false,
    icon: "wind",
    intro: [
      "Extraction gets the water you can see. Drying gets the water you cannot — the moisture already inside the subfloor, the wall cavity, and the framing.",
      "We build a drying chamber sized to the affected area, place air movers and low-grain refrigerant dehumidifiers to a calculated load rather than a guess, and take readings every day until the materials reach a documented dry standard against an unaffected baseline.",
    ],
    includes: [
      "Drying plan calculated to the affected square footage and material type",
      "Commercial air movers and LGR dehumidifiers",
      "Controlled demolition only where materials cannot be dried in place",
      "Wall cavity and hardwood floor drying systems where applicable",
      "Daily moisture readings, logged and shared",
      "Written confirmation when dry standard is reached",
    ],
    signs: [
      "Floors that look dry but feel cool or cupped underfoot",
      "Baseboards swelling, separating, or blistering paint",
      "A musty smell that lingers after the water is gone",
      "Drywall that is soft or crumbling near the floor line",
    ],
    faqs: [
      {
        q: "How long does drying take?",
        a: "Most residential jobs run three to five days. Dense assemblies — hardwood over subfloor, plaster, or a wet crawl space — can run longer. We do not pull equipment on a schedule; we pull it when the meters say the material is dry.",
      },
      {
        q: "Can I just run my own fans and a rental dehumidifier?",
        a: "For a small, fully surface-level spill, sometimes. The problem is that box fans move air without removing moisture, and consumer dehumidifiers cannot pull enough grains per day to dry a structural assembly. The common outcome is a floor that feels dry on top with a wet subfloor underneath, which surfaces as mold two months later.",
      },
    ],
  },
  {
    slug: "flood-and-storm-cleanup",
    name: "Flood & Storm Cleanup",
    short: "Flood Cleanup",
    blurb:
      "Full cleanup after river flooding, storm damage, and heavy-rain intrusion, including contaminated water handling.",
    emergency: true,
    icon: "cloud-rain",
    intro: [
      "Snohomish County floods on a schedule. When the Stillaguamish comes up, or an atmospheric river parks over the county for three days, the water that gets into a home is not clean water — it carries soil, sewage, farm runoff, and whatever it crossed on the way in.",
      "Groundwater and river flooding are handled differently than a burst supply line. Porous materials that absorbed contaminated water come out rather than get dried, and the affected area is cleaned and antimicrobial-treated before drying starts.",
    ],
    includes: [
      "Contaminated (category 3) water extraction with appropriate PPE",
      "Removal and disposal of unsalvageable porous materials",
      "Muck-out, silt removal, and pressure washing",
      "Antimicrobial application to affected surfaces",
      "Crawl space pump-out and vapor barrier replacement",
      "Structural drying once the area is cleaned",
    ],
    signs: [
      "River or groundwater that entered the home or crawl space",
      "Silt, mud, or debris lines inside the structure",
      "Sewage backup or septic overflow",
      "Storm damage that let rain into the building envelope",
    ],
    faqs: [
      {
        q: "Does homeowners insurance cover river flooding?",
        a: "Usually not. Standard homeowners policies typically exclude flood, which is why separate NFIP or private flood coverage exists. Water from a burst pipe or a failed appliance is a different peril and is commonly covered. We document the source and the damage either way, so you have what you need to file — but confirm your coverage with your agent rather than with us.",
      },
      {
        q: "Can anything that got wet in a flood be saved?",
        a: "Hard, non-porous surfaces can be cleaned and disinfected. Carpet, pad, insulation, and particleboard that took on contaminated water do not get saved — the standard is removal. Solid wood, framing, and subfloor can often be cleaned and dried in place.",
      },
    ],
  },
  {
    slug: "mold-prevention-and-remediation",
    name: "Mold Prevention & Remediation",
    short: "Mold Prevention",
    blurb:
      "Stop mold before it starts after a water loss, and contain and remove it properly when it has already taken hold.",
    emergency: false,
    icon: "shield",
    intro: [
      "Mold is not a separate disaster from water damage — it is the second half of the same one. Given moisture, the right temperature, and roughly 48 hours, it starts, and the Pacific Northwest supplies two of those three year round.",
      "On a fresh water loss, the goal is prevention: dry it fast enough and treat it, and there is nothing to remediate. Where growth has already established, the work is containment and removal — not fogging it and calling it handled.",
    ],
    includes: [
      "Antimicrobial treatment during water damage drying",
      "Containment barriers and negative air pressure",
      "HEPA filtration and air scrubbing",
      "Removal of mold-affected porous materials",
      "HEPA vacuuming and detailed surface cleaning",
      "Correction of the moisture source so it does not return",
    ],
    signs: [
      "Musty, earthy odor with no visible source",
      "Black, green, or white growth on drywall, framing, or in a crawl space",
      "Discoloration or staining that spreads over time",
      "Allergy-like symptoms that improve when you leave the house",
    ],
    faqs: [
      {
        q: "Do you do mold testing?",
        a: "We do visual assessment and moisture diagnostics. For a defensible pre- and post-remediation air quality test, we recommend an independent third-party hygienist — the firm that removes the mold should not be the same firm that grades its own work.",
      },
      {
        q: "Can I just spray bleach on it?",
        a: "On a hard, non-porous surface, bleach kills surface growth. On porous material like drywall or framing, it wets the material and leaves the root structure behind, which frequently makes things worse. And none of it matters if the moisture source is still active.",
      },
    ],
  },
  {
    slug: "ceiling-and-wall-drying",
    name: "Ceiling & Wall Drying",
    short: "Ceiling & Wall Drying",
    blurb:
      "Targeted cavity drying for water that came from above — roof leaks, overflows, and upstairs supply line failures.",
    emergency: false,
    icon: "home",
    intro: [
      "Water from above is deceptive. A stain on a ceiling is the smallest visible part of a wet area that has usually spread several feet across the joist bays, and the insulation above it is holding water against the drywall.",
      "We drill and dry the cavity where we can, remove what we have to, and confirm the framing above is dry before anything gets closed back up. A ceiling that gets patched over wet insulation comes back as a mold call.",
    ],
    includes: [
      "Thermal imaging to map the true extent of the wet area",
      "Controlled cavity access and injection drying",
      "Wet insulation removal",
      "Ceiling and drywall removal only where drying in place will not work",
      "Verification the framing and cavity are dry before closing",
      "Coordination with a roofer or plumber to correct the source",
    ],
    signs: [
      "Brown or yellow staining on a ceiling",
      "Sagging, bubbling, or cracking drywall overhead",
      "Water tracking down a wall from an upstairs bathroom",
      "Drips or bulges appearing after heavy rain",
    ],
    faqs: [
      {
        q: "There is a bulge in my ceiling. What do I do right now?",
        a: "Get everything out from under it and do not poke it — a bulge is holding weight, and a collapsing wet ceiling injures people. Put a container underneath, shut off the water source if it is a plumbing leak, and call. If it is actively sagging, treat it as urgent.",
      },
      {
        q: "The stain is small. Do I really need anyone?",
        a: "The stain is only the part that reached the paint. Thermal imaging on a small ceiling stain routinely shows a wet area several times larger. It is worth an assessment even if the answer turns out to be that it is already dry.",
      },
    ],
  },
  {
    slug: "crawl-space-water-removal",
    name: "Crawl Space Water Removal",
    short: "Crawl Space Drying",
    blurb:
      "Pump-out, muck-out, and drying for the wet crawl spaces that are endemic to older Snohomish County homes.",
    emergency: false,
    icon: "layers",
    intro: [
      "A large share of homes around Arlington, Stanwood, and Marysville sit on crawl spaces, and in a wet winter a meaningful number of them are holding standing water the homeowner has never seen.",
      "A wet crawl space is not a contained problem. It is a humidity source directly beneath the living space that pushes moisture up into the subfloor and framing, and it is the single most common cause of the musty smell people cannot locate.",
    ],
    includes: [
      "Standing water pump-out",
      "Silt, debris, and contaminated soil removal",
      "Removal and replacement of wet insulation",
      "Vapor barrier removal and replacement",
      "Antimicrobial treatment of joists and subfloor",
      "Drying and dehumidification of the crawl space",
    ],
    signs: [
      "Musty odor coming through floor vents or from below",
      "Cold, damp floors in winter",
      "Insulation falling down between the floor joists",
      "Standing water or saturated ground visible at the access hatch",
      "Indoor humidity that stays high and will not come down",
    ],
    faqs: [
      {
        q: "How would I even know my crawl space is wet?",
        a: "Most people do not, until there is a smell or a mold finding during a home inspection. If you have not looked in a few years, and especially if you are on a low lot or near the river, it is worth an inspection after a wet winter.",
      },
      {
        q: "Will it just dry out on its own in summer?",
        a: "Partially, and then it refills in October. Standing water that returns every winter is a drainage problem, not a drying problem — the water removal is the first step, but the grading, gutters, or sump situation is what actually ends it.",
      },
    ],
  },
  {
    slug: "24-7-emergency-response",
    name: "24/7 Emergency Response",
    short: "Emergency Response",
    blurb:
      "A real person answers, any hour, and we mobilize — because water damage does not wait for business hours.",
    emergency: true,
    icon: "clock",
    intro: [
      "Pipes break at 2am. Water heaters fail over a long weekend. A supply line lets go while you are out of town, and you come home to it.",
      "We answer the phone around the clock and mobilize on emergency calls, because the difference between a call placed at midnight and a call placed at 8am the next morning is frequently the difference between drying a floor and replacing one.",
    ],
    includes: [
      "Live answer, 24 hours a day, 7 days a week",
      "Emergency mobilization to stop and contain the loss",
      "Water shutoff and source containment",
      "Immediate extraction and equipment placement",
      "Emergency board-up and tarping where the envelope is open",
      "Documentation started on day one for your claim",
    ],
    signs: [
      "An active leak you cannot stop",
      "A burst or frozen supply line",
      "Water heater or appliance failure that flooded a room",
      "Sewage backup",
      "Storm damage actively letting water in",
    ],
    faqs: [
      {
        q: "What should I do before you arrive?",
        a: "Shut off the water at the source or the main. If water is anywhere near outlets, panels, or cords, shut off power to those rooms at the breaker. Move what you can out of the water, and photograph everything before you move it — those photos matter to your claim. Then stay out of standing water.",
      },
      {
        q: "Do you charge more for a night or weekend call?",
        a: "Emergency mobilization outside normal hours does carry a call-out rate, and we tell you what it is on the phone before we roll — no surprises on the invoice. On insured losses this is a standard, expected line item.",
      },
    ],
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);

export const emergencyServices = services.filter((s) => s.emergency);
