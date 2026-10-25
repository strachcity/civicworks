// The design materials of institutional change, as a provisional reading for the navigation model.
//
// This file is the data. The page draws whatever is here, so the taxonomy, wording and links can
// change with the writing without touching the drawing code. Nothing here is a measured fact:
// where a material sits is contextual, overlapping and often contested.
//
// layers   0 citizen interaction, 1 service processes and technology, 2 organisational priorities,
//          3 cross-institutional arrangements, 4 political and strategic support
// pulls    which corners of the triangle it pulls on: value, legitimacy, capacity
// pace     qualitative only, no durations
// probe    a question an experiment might ask of it
// reveal   what an experiment might turn up (kind is dependency, conversation, assumption,
//          decision or carry, for something that carries into the next experiment)
// change   what changing it could need: authority, evidence, other arrangements
// links    other materials it tends to move with
//
// Copy rules: short, plain, British, no colons or em dashes in anything a reader sees.

window.MATERIALS = [
  {
    id: "legislation",
    name: "Legislation and policy",
    what: "The law a service rests on, and the policy that interprets it.",
    why: "Everyone assumes the law decides how a service works. Often it's the interpretation that does, and that sits closer to hand.",
    layers: [2, 3, 4],
    pulls: ["legitimacy", "value"],
    pace: "Interpretation can move much faster than the law itself.",
    probe: "Which part of this is in the legislation, and which part is how we've always read it?",
    reveal: { kind: "assumption", text: "The requirement everyone cited was a reading of the law, not the law." },
    change: "A policy owner willing to reinterpret, legal advice they trust, and sometimes a minister.",
    links: ["accountability", "info-governance", "evidence", "funding"]
  },
  {
    id: "standards",
    name: "Professional standards",
    what: "What a profession counts as good, safe practice. Clinical standards are one example.",
    why: "Standards protect people, and they also fix who has to look at what. A new route that skips a step can look unsafe even when it isn't.",
    layers: [1, 3, 4],
    pulls: ["value", "legitimacy"],
    pace: "Moves with evidence and the profession's own review cycles.",
    probe: "Which professional judgement does this step protect, and could it be made another way?",
    reveal: { kind: "conversation", text: "The professional body had already been asking the same question." },
    change: "Evidence the profession accepts, and its own process to revise what counts as good practice.",
    links: ["roles", "evidence", "trust", "accountability"]
  },
  {
    id: "contracts",
    name: "Contracts and agreements",
    what: "What a supplier or partner has agreed to do, and what they haven't.",
    why: "A small change at the front can land on a contract written for the old way of working, with a price and a date attached.",
    layers: [1, 2, 3],
    pulls: ["legitimacy", "capacity"],
    pace: "Often tied to procurement and renewal dates.",
    probe: "Who would have to do something differently, and are they paid to?",
    reveal: { kind: "dependency", text: "Part of the old route runs through a supplier, on terms set years ago." },
    change: "Commercial authority, a reason to vary or wait for renewal, and a partner prepared to negotiate.",
    links: ["funding", "digital", "trust", "time"]
  },
  {
    id: "funding",
    name: "Funding and incentives",
    what: "Where the money comes from, what it is for, and what it rewards.",
    why: "A test can be funded as a project. Keeping it going needs a budget line, and someone whose incentives point the same way.",
    layers: [2, 3, 4],
    pulls: ["value", "legitimacy", "capacity"],
    pace: "Moves with budget and spending cycles.",
    probe: "Who pays for this after the test, and does it save money somewhere they can see?",
    reveal: { kind: "dependency", text: "The saving lands in a different budget from the cost." },
    change: "A budget holder, a case that fits the spending cycle, and sometimes agreement between organisations.",
    links: ["contracts", "measurement", "capabilities", "accountability"]
  },
  {
    id: "time",
    name: "Time and review cycles",
    what: "How often something is checked, renewed or decided, and why that rhythm was chosen.",
    why: "A fixed review date shapes everything around it, from the letters people get to the work queues behind them.",
    layers: [0, 1, 4],
    pulls: ["value", "capacity"],
    pace: "Depends on what set the cycle in the first place.",
    probe: "If information arrived when things changed, would a fixed review date still make sense?",
    reveal: { kind: "assumption", text: "The review cycle was set to suit a paper process, not the people being reviewed." },
    change: "Whoever owns the rule behind the cycle, and evidence that a different rhythm is at least as safe.",
    links: ["evidence", "roles", "legislation", "measurement"]
  },
  {
    id: "roles",
    name: "Professional roles",
    what: "Who does which part of the work, and what they are trained and trusted to decide.",
    why: "Change the route and you change somebody's job. That can matter more to the people involved than the technology.",
    layers: [1, 2, 3],
    pulls: ["legitimacy", "capacity"],
    pace: "Often slow to reconfigure.",
    probe: "Whose work changes if this works, and were they in the room?",
    reveal: { kind: "conversation", text: "The people who would handle the new route had questions no one had asked them." },
    change: "Workforce agreements, training, and managers willing to redraw who decides what.",
    links: ["standards", "accountability", "capabilities", "time"]
  },
  {
    id: "accountability",
    name: "Accountability and decision rights",
    what: "Who can say yes, who carries the risk, and who answers for it afterwards.",
    why: "Experiments often find the decision they need sits somewhere else, with someone who has never heard of them.",
    layers: [2, 3],
    pulls: ["legitimacy", "capacity"],
    pace: "Varies, and can be deeply entrenched.",
    probe: "Who would have to sign this off for real, and do they know it exists?",
    reveal: { kind: "decision", text: "The decision right sits with another directorate, under a different governance route." },
    change: "A change to who decides, which usually needs the people who currently decide to agree.",
    links: ["legislation", "trust", "roles", "funding"]
  },
  {
    id: "evidence",
    name: "Evidence and information",
    what: "What a service knows, how it knows it, and what counts as proof.",
    why: "A new route brings in information in a new form. Whether it counts depends on what the people deciding are used to trusting.",
    layers: [1, 2, 3],
    pulls: ["value", "legitimacy", "capacity"],
    pace: "Variable. Collecting it can be quick, accepting it slower.",
    probe: "What would someone need to see to trust information that arrived this way?",
    reveal: { kind: "carry", text: "Evidence gathered for one check could be reused for another." },
    change: "Agreement on what counts as good enough, and the systems to hold it.",
    links: ["time", "info-governance", "trust", "measurement"]
  },
  {
    id: "trust",
    name: "Trust and assurance",
    what: "The checks that give people confidence a service is safe, fair and working.",
    why: "Assurance is built for the process it knows. Anything new gets checked against the old shape, and can fail on form rather than substance.",
    layers: [0, 1, 2, 3, 4],
    pulls: ["legitimacy", "value", "capacity"],
    pace: "Variable. Lost quickly, rebuilt slowly.",
    probe: "Which assurance would this need to pass, and was it written for this kind of change?",
    reveal: { kind: "assumption", text: "The assurance regime had a route for this, it had just never been used." },
    change: "Assurers who will look at a new shape, and evidence they recognise.",
    links: ["accountability", "evidence", "standards", "info-governance"]
  },
  {
    id: "digital",
    name: "Digital channels",
    what: "The ways people reach a service, and the ways information moves inside it.",
    why: "Usually the easiest thing to change and the first thing an experiment touches. It's also where the other materials start to show.",
    layers: [0, 1],
    pulls: ["value", "capacity"],
    pace: "Often relatively fast.",
    probe: "Will people use a different route, and what happens to what they send?",
    reveal: { kind: "dependency", text: "The new route works at the front and stops at a step built for paper." },
    change: "A team that can build and run it, and somewhere for what it collects to go.",
    links: ["evidence", "info-governance", "capabilities", "contracts"]
  },
  {
    id: "capabilities",
    name: "Organisational capabilities",
    what: "What an organisation can actually do, as opposed to what it says it can.",
    why: "An experiment can borrow capability for a few weeks. Keeping the change needs the organisation to own it.",
    layers: [1, 2],
    pulls: ["capacity", "value"],
    pace: "Built through sustained practice and investment.",
    probe: "Could the organisation run this without the team that built it?",
    reveal: { kind: "dependency", text: "It only worked because one person knew how the old system really behaved." },
    change: "Investment that lasts beyond the project, and time for people to learn.",
    links: ["funding", "roles", "digital", "measurement"]
  },
  {
    id: "measurement",
    name: "Measurement and feedback",
    what: "What gets counted, who sees it, and what it makes people do.",
    why: "What gets measured gets protected. A change that improves something nobody counts is easy to lose.",
    layers: [0, 1, 2, 3, 4],
    pulls: ["value", "legitimacy", "capacity"],
    pace: "Feedback can be quick. Getting an institution to act on it is slower.",
    probe: "Which number would move if this worked, and does anyone watch that number?",
    reveal: { kind: "carry", text: "A measure from the test became the baseline for the next one." },
    change: "Agreement on what to count, and someone who will act on it.",
    links: ["funding", "evidence", "accountability", "time"]
  },
  {
    id: "info-governance",
    name: "Information governance and consent",
    what: "The rules for collecting, sharing and keeping personal information.",
    why: "Moving information to a new route raises questions about consent and lawful basis that the old route settled long ago.",
    layers: [1, 2, 3],
    pulls: ["legitimacy", "capacity"],
    pace: "Depends on the legal basis, the assurance and the build.",
    probe: "On what basis can we collect this here, and who has to agree?",
    reveal: { kind: "decision", text: "The data protection question had an owner nobody on the team had met." },
    change: "A data protection officer, a lawful basis that fits, and the assurance to show it.",
    links: ["legislation", "evidence", "digital", "trust"]
  }
];

// Notes for pairs that tell a story together. Any other pair is described from what overlaps.
window.MATERIAL_PAIRS = {
  "evidence|time": "Change how often something is reviewed and you change how much evidence is needed, and when. Reuse evidence that already exists and a different rhythm might become possible.",
  "digital|info-governance": "A new channel is easy to build. Collecting information through it raises consent and lawful basis questions the old channel answered years ago.",
  "contracts|funding": "The money and the contract are usually set together, on the same cycle. Changing one without the other leaves something paid for that no longer fits.",
  "accountability|roles": "Redraw who does the work and you may also need to redraw who can decide. Those two rarely sit in the same place.",
  "digital|roles": "A digital route moves work as well as information. Someone downstream does their job differently, whether or not they were asked.",
  "legislation|accountability": "The law says what must happen. Who gets to decide how it happens is often a separate, and more movable, question.",
  "evidence|trust": "Assurance trusts the evidence it knows. New evidence has to be trusted before it counts, and that takes its own work.",
  "funding|measurement": "Budgets follow what gets measured. A benefit nobody measures is hard to fund."
};

// A fictional service, walked through one step at a time. Nothing here describes a real service.
window.MATERIAL_SCENARIO = {
  title: "A service where people show they're still eligible",
  steps: [
    { select: ["digital"], layer: 0, text: "Every so often people have to show they still qualify, by post. A team tries letting them send their evidence online. It looks like a change to one channel." },
    { select: ["digital", "evidence"], layer: 1, text: "The new route brings evidence in a different form. Someone has to decide whether it counts, and against which standard." },
    { select: ["evidence", "time"], layer: 1, text: "If evidence can arrive whenever something changes, a fixed review date starts to look like a choice rather than a fact." },
    { select: ["roles", "accountability"], layer: 2, text: "The people who check the evidence work to their own professional standards. The decision to change how they check sits in another part of the organisation." },
    { select: ["contracts", "trust"], layer: 3, text: "Part of the old route runs through a supplier, and the assurance regime was written for paper. Neither was in the plan." },
    { select: [], layer: 1, text: "The experiment changed one channel. What it learned is about five other materials, none of which it changed. That's the work it points to next." }
  ]
};
