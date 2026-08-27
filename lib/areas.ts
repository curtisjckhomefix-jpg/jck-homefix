export type Area = {
  slug: string;
  city: string;
  /** Shown as "Water Damage Restoration in {city}, WA" */
  county: string;
  zips: string[];
  /** Drive-time promise used on the city page hero. */
  eta: string;
  /** Two or three paragraphs of genuinely local context. */
  intro: string[];
  /** Specific, locally-true risk factors. Keeps city pages from being clones. */
  risks: { title: string; body: string }[];
  neighborhoods: string[];
  primary?: boolean;
};

export const areas: Area[] = [
  {
    slug: "arlington",
    city: "Arlington",
    county: "Snohomish County",
    zips: ["98223"],
    eta: "under 30 minutes",
    primary: true,
    intro: [
      "Arlington is our home base, and it is a town shaped by water. The north and south forks of the Stillaguamish meet here, and the river has a long, well-documented history of coming up over its banks in a wet winter.",
      "That means we are not learning the local failure patterns on your job. We know which parts of town sit low, which neighborhoods are on crawl spaces that flood every few years, and how fast a call from an Arlington address can be answered — usually inside half an hour.",
    ],
    risks: [
      {
        title: "Stillaguamish flooding",
        body: "Properties near the river and on the low ground around it take groundwater and river intrusion during heavy-rain events, most often between November and February. This is contaminated water, handled differently than a clean supply-line break.",
      },
      {
        title: "Crawl space saturation",
        body: "Much of Arlington's older housing stock sits on crawl spaces. In a wet year these hold standing water for months, and the first symptom is usually a musty smell rather than anything visible.",
      },
      {
        title: "Winter pipe failures",
        body: "The cold snaps that hit the north county each winter break supply lines, especially in uninsulated crawl spaces, garages, and outbuildings.",
      },
    ],
    neighborhoods: [
      "Downtown Arlington",
      "Smokey Point",
      "Bryant",
      "Trafton",
      "Arlington Heights",
    ],
  },
  {
    slug: "marysville",
    city: "Marysville",
    county: "Snohomish County",
    zips: ["98270", "98271"],
    eta: "under 30 minutes",
    intro: [
      "Marysville is the largest city we serve after Everett, and it runs the full range of housing — mid-century homes on the older west side near Ebey Slough, and large newer developments spreading east.",
      "The two halves fail differently. Older Marysville homes bring crawl space water, aging galvanized and polybutylene supply lines, and original water heaters. Newer construction brings appliance failures and second-floor laundry and bathroom leaks that travel down through the ceiling.",
    ],
    risks: [
      {
        title: "Low-lying west side",
        body: "Property near Ebey Slough and the flats sits close to the water table, which pushes groundwater into crawl spaces and slab-adjacent areas during sustained rain.",
      },
      {
        title: "Aging supply lines",
        body: "Homes from the 1960s through the 1980s are at the age where original supply plumbing and water heaters fail, often while nobody is home.",
      },
      {
        title: "Two-story leak travel",
        body: "In the newer east-side developments, an upstairs bathroom or laundry leak does not stay upstairs. It runs the joist bays and shows up as a ceiling stain a room away from the actual source.",
      },
    ],
    neighborhoods: [
      "Downtown Marysville",
      "Sunnyside",
      "Kellogg Marsh",
      "Lake Stevens border",
      "Quilceda",
    ],
  },
  {
    slug: "smokey-point",
    city: "Smokey Point",
    county: "Snohomish County",
    zips: ["98223", "98271"],
    eta: "under 20 minutes",
    intro: [
      "Smokey Point straddles the Arlington and Marysville line along the I-5 corridor, and it is a genuinely mixed area — a heavy commercial and retail strip alongside established residential neighborhoods.",
      "That mix means we take two very different kinds of call here. Commercial losses at a retail or office space, where every hour closed is revenue gone, and standard residential water damage in the surrounding homes.",
    ],
    risks: [
      {
        title: "Commercial after-hours losses",
        body: "A retail or office space that floods Friday night is not discovered until Monday unless someone is monitoring. By then the drying job has become a demolition job.",
      },
      {
        title: "Shared-wall commercial spread",
        body: "In multi-tenant buildings, one unit's burst line becomes three units' problem. Containment and drying have to account for the neighbors.",
      },
      {
        title: "Flat commercial roofing",
        body: "Flat and low-slope roofs on the commercial strip pond water and let it in during sustained rain, typically showing up first as ceiling tile staining.",
      },
    ],
    neighborhoods: [
      "Smokey Point commercial district",
      "North Marysville",
      "South Arlington",
    ],
  },
  {
    slug: "stanwood",
    city: "Stanwood",
    county: "Snohomish County",
    zips: ["98292"],
    eta: "under 35 minutes",
    intro: [
      "Stanwood sits near the mouth of the Stillaguamish, on and around the delta flats, and a meaningful amount of the area is genuinely low ground. Add the Camano Island traffic and a lot of older rural properties, and it is one of the higher-risk parts of the county for water intrusion.",
      "Flood-adjacent property needs a contractor who treats river water as category 3 rather than shortcutting it as clean water. We do not dry and reinstall porous material that took on floodwater.",
    ],
    risks: [
      {
        title: "Delta and floodplain ground",
        body: "Low elevation and a high water table mean groundwater intrusion during sustained rain, not just during a named flood event.",
      },
      {
        title: "Rural and outbuilding losses",
        body: "Barns, shops, and detached structures on rural Stanwood property freeze and break, and often nobody notices until the water has run for days.",
      },
      {
        title: "Septic and drainage backups",
        body: "Properties on septic can back up under heavy saturation, which is a contaminated-water job requiring removal rather than drying.",
      },
    ],
    neighborhoods: [
      "Downtown Stanwood",
      "East Stanwood",
      "Camano Island access",
      "Silvana",
    ],
  },
  {
    slug: "lake-stevens",
    city: "Lake Stevens",
    county: "Snohomish County",
    zips: ["98258"],
    eta: "under 35 minutes",
    intro: [
      "Lake Stevens has grown fast, and the housing stock reflects it — lakefront and near-lake property alongside large tracts of newer subdivision construction.",
      "Newer does not mean safe. A significant share of the water losses we see in newer construction come from failed appliance supply lines, water heaters in upstairs closets, and refrigerator lines, all of which flood a finished home rather than an unfinished basement.",
    ],
    risks: [
      {
        title: "Lakefront humidity and grade",
        body: "Property close to the lake deals with a high water table and grading that can direct runoff toward rather than away from the foundation.",
      },
      {
        title: "Upper-floor mechanical failures",
        body: "Water heaters, washing machines, and HVAC condensate lines located on upper floors turn a small failure into a multi-floor loss.",
      },
      {
        title: "Finished basements and daylight basements",
        body: "A finished lower level means carpet, drywall, and cabinetry are all in the path of any water that gets in, which raises the cost of a slow response sharply.",
      },
    ],
    neighborhoods: [
      "Lake Stevens waterfront",
      "Frontier Village",
      "Soper Hill",
      "Hartford",
    ],
  },
  {
    slug: "granite-falls",
    city: "Granite Falls",
    county: "Snohomish County",
    zips: ["98252"],
    eta: "under 40 minutes",
    intro: [
      "Granite Falls sits up in the foothills along the Pilchuck, and the weather there is not the weather down on the I-5 corridor. It gets more rain, it gets colder, and it holds cold longer.",
      "That combination produces a specific pattern: freeze-related pipe breaks in winter, and a lot of homes on wells, septic, and crawl spaces where problems run for a long time before anyone catches them.",
    ],
    risks: [
      {
        title: "Harder freezes",
        body: "Higher elevation and foothill conditions mean deeper and longer freezes than the lowlands, which is the leading cause of burst supply lines here.",
      },
      {
        title: "Longer discovery times",
        body: "Rural and larger properties with detached structures mean a leak can run unnoticed for days, turning a contained loss into a structural one.",
      },
      {
        title: "Well and pump failures",
        body: "Pressure tank and well system failures inside a home or pump house flood the space they are in, often continuously until someone shuts it down.",
      },
    ],
    neighborhoods: ["Downtown Granite Falls", "Lake Roesiger area", "Robe Valley"],
  },
  {
    slug: "everett",
    city: "Everett",
    county: "Snohomish County",
    zips: ["98201", "98203", "98204", "98208"],
    eta: "under 45 minutes",
    intro: [
      "Everett is the county seat and the largest city we serve, with the widest range of building types — historic north Everett homes, mid-century neighborhoods, dense apartment and condo stock, and commercial and industrial property near the waterfront.",
      "Older housing and multi-family buildings both raise the stakes. In a century-old home, plaster and original plumbing change how a job is approached. In a multi-unit building, one failure crosses into units that had nothing to do with it.",
    ],
    risks: [
      {
        title: "Historic housing stock",
        body: "North Everett has homes old enough to have original or heavily patched plumbing, plaster walls, and balloon framing that lets water travel between floors in ways modern construction does not.",
      },
      {
        title: "Multi-family cross-unit losses",
        body: "In apartments and condos, a single supply failure runs down through multiple units. These jobs need containment, coordination with building management, and clear documentation of which unit the loss originated in.",
      },
      {
        title: "Commercial and industrial losses",
        body: "Warehouse and commercial space near the waterfront and industrial corridor means large-footprint losses where downtime is the real cost.",
      },
    ],
    neighborhoods: [
      "North Everett",
      "Bayside",
      "Silver Lake",
      "Riverside",
      "Evergreen",
    ],
  },
  {
    slug: "snohomish",
    city: "Snohomish",
    county: "Snohomish County",
    zips: ["98290", "98296"],
    eta: "under 45 minutes",
    intro: [
      "Snohomish has one of the best-preserved historic downtowns in the county and a river valley that floods with real regularity. Both facts matter to how water damage gets handled here.",
      "Historic buildings and older homes bring plaster, original wood, and assemblies that do not dry the way modern drywall does. Valley property brings river water, which is a contamination job before it is a drying job.",
    ],
    risks: [
      {
        title: "Snohomish River valley flooding",
        body: "The valley floods on a recurring basis in heavy-rain season. Property on the flats takes river water, which is category 3 and requires removal of affected porous materials.",
      },
      {
        title: "Historic construction",
        body: "Plaster, lath, and old-growth framing hold and release moisture differently than modern materials, and drying them without destroying them takes a different approach than a standard drywall job.",
      },
      {
        title: "Downtown commercial basements",
        body: "Older downtown buildings frequently have basements that take groundwater during high river and heavy rain periods.",
      },
    ],
    neighborhoods: [
      "Historic Downtown",
      "Snohomish River valley",
      "Clearview",
      "Cathcart",
    ],
  },
  {
    slug: "monroe",
    city: "Monroe",
    county: "Snohomish County",
    zips: ["98272"],
    eta: "under 50 minutes",
    intro: [
      "Monroe sits near where the Skykomish and Snohomish river systems come together, which puts a meaningful share of the area on or near a floodplain.",
      "Alongside that, Monroe has grown quickly, so we see the same split as Lake Stevens — floodplain and rural property with groundwater problems, and newer subdivisions with appliance and upper-floor plumbing failures.",
    ],
    risks: [
      {
        title: "River confluence flooding",
        body: "Property on the valley floor takes river and groundwater during sustained rain and snowmelt events, particularly in late fall and winter.",
      },
      {
        title: "Agricultural and rural runoff",
        body: "Water crossing farm ground before it reaches a structure arrives contaminated, which changes what can be salvaged.",
      },
      {
        title: "Newer subdivision appliance failures",
        body: "Dishwashers, refrigerator lines, and washing machines in newer homes fail into fully finished space, where the damage is immediate and expensive.",
      },
    ],
    neighborhoods: ["Downtown Monroe", "Fryelands", "Chain Lake", "Tualco Valley"],
  },
  {
    slug: "darrington",
    city: "Darrington",
    county: "Snohomish County",
    zips: ["98241"],
    eta: "under 60 minutes",
    intro: [
      "Darrington is the most remote community we serve, up the Sauk and North Fork Stillaguamish valleys, and that remoteness is exactly why response matters more here, not less.",
      "Most restoration companies simply will not drive it. We will. If you are in Darrington with water in the house, the honest answer is that we are further out than we would be in Arlington — and we will tell you our real arrival window on the phone rather than a comfortable one.",
    ],
    risks: [
      {
        title: "Heavy mountain rainfall",
        body: "The upper valleys take substantially more rain than the lowlands, which drives both river rise and sustained groundwater pressure on foundations and crawl spaces.",
      },
      {
        title: "Sustained hard freezes",
        body: "Winter conditions here are harsher and longer than on the I-5 corridor, and frozen and burst supply lines are the most common winter loss.",
      },
      {
        title: "Long discovery and response times",
        body: "Seasonal and second homes in the area can run a leak for days or weeks unnoticed. Response distance is real, which makes early detection and an immediate call more important than anywhere else we serve.",
      },
    ],
    neighborhoods: ["Darrington", "Sauk Valley", "North Fork Stillaguamish"],
  },
];

export const areaBySlug = (slug: string) => areas.find((a) => a.slug === slug);

export const primaryArea = areas.find((a) => a.primary) ?? areas[0];

/** Comma-joined city list for footer / schema areaServed. */
export const areaCityNames = areas.map((a) => a.city);
