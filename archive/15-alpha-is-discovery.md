---
title: "Alpha is discovery"
subtitle: "What happens if our capacity to experiment grows much faster than our capacity to change the institutions those experiments expose?"
author: "Jack Strachan"
date: "2026-09-29"
publication: "CIVICWORKS"
source: "https://www.civicworks.co/p/alpha-is-discovery"
---

# Alpha is discovery

*What happens if our capacity to experiment grows much faster than our capacity to change the institutions those experiments expose?*

There is a growing recognition across the public sector that legacy is not really about age. That another 3 months understanding a service is also 3 months choosing to live with its failures. You only need to look at the test and learn programmes popping up across government, or even the UK government’s own [updated definition of legacy technology](https://www.gov.uk/government/publications/guidance-on-the-legacy-it-risk-assessment-framework/updated-definition-of-legacy-it), to see that time spent living with a system is finally becoming part of our risk calculation.

This is great. Because I’ve long thought our approach to transformation, specifically “discovery”, has become far too separated from the act of making and changing things. I’ve experienced and observed too many 12–18 month discovery projects end without action, or much learning at all. Couple this with what is happening in AI and those 12–18 months start to look even stranger. Something that once needed weeks of planning and engineering can now be testable in an afternoon.

Anthropic’s [AI-native SDLC playbook](https://claude.com/resources/articles/the-ai-native-sdlc-playbook) makes the mismatch wonderfully literal: build collapses to hours while the human-speed stages around it barely move.

Put all of this together and I think the economics underpinning our traditional models of transformation have started to shift. Government is classically very good at interrogating the risk of doing something, and infamously bad at making decisions (or at least learning from the bad ones). So it has built an enormous amount of machinery between thinking and doing.

Business cases, governance processes, boards, approval routes, large programmes and even larger teams all exist, at least partly, to minimise the risk of changing services for the public. Individually, much of this makes sense.

But together it can accumulate to the point where doing nothing starts to look like the responsible alternative — something I’ve written about before as the [difference between bureaucracy that is genuinely holding public value and bureaucracy that survives through caution, interpretation and habit](https://www.civicworks.co/p/the-bureaucracy-we-need-and-the-bureaucracy).

Now put that machinery next to something real enough to learn from, knocked together in someone’s bedroom, and it starts to look a little silly. Making no longer needs to sit on the far side of understanding the problem. It can, and I think increasingly has to, become part of how we understand it.

I recently read Stewart Brand’s [*Maintenance: Of Everything*](https://press.stripe.com/maintenance-part-one) where Brand, through Robert Pirsig, argues that to really know how to look after something you need to understand both how it works and how it was made. Brand connects this to the idea of becoming “masters of our stuff”, and I think this is unbelievably true for public services. We can learn a lot about a public service by studying it. But sometimes you need to try and change the thing to find out how it actually works.

## What if making is discovery?

My main gripe with the way we’ve institutionalised agile delivery in UK government is that we treat discovery and alpha as different kinds of activity. First understand the problem, then start making things to test possible responses. There was a logic to that separation when making was expensive. Perfectly reasonable, right? An uncertain process of agile development made wonderfully legible: phases to fund, teams to organise around them, things to assure and points at which decisions could be made.

But somewhere along the way this map started shaping the territory. Discovery became a phase, then a deliverable, then something that could take 18 months and still conclude with a recommendation to do another piece of research. The irony being that a model designed to bring thinking, making and learning closer together has matured into an architecture that can keep them remarkably far apart.

During my time at HMRC I’ve watched this taken a step further with “pre-discoveries”, used to explore pieces of work before they are funded or, depending on the week, to avoid committing to anything, to run a consultation, or to find a polite route through a bad ministerial idea.

Which makes what is happening with AI rather wonderfully circular, in my opinion. If making something is cheap enough to be thrown away, the distinction between understanding the problem and testing a possible response becomes much less useful. And I don’t just mean making another prototype. Something that actually works, in something approaching the real service, lets us ask questions a mock-up can’t.

A citizen can respond to something that actually behaves, a caseworker can show you where it falls apart, or a policy assumption can meet a real case rather than another workshop.

## You have to build the thing to find the skeleton

Years ago, when I worked at [Futurestate Design Co.](https://futurestatedesign.co/), my colleague Rae Morgan (when we were not winding each other up) used to describe part of her job as lifting up rocks to see what crawled out. She was always interested in finding where the skeletons were buried. I’ve perhaps taken that a little too literally as a description of my own job ever since, but this is exactly what we’ve been experiencing first-hand at CustomerFirst in our work with DVLA on the Drivers Medical service.

One of our first experiments tested whether we could proactively text customers using [GOV.UK Notify](https://www.notifications.service.gov.uk/). On the face of it, pretty simple. We made something, put it into the service and learnt from how people responded. But the interesting learning came from what happened around the test. Notify wasn’t integrated with the caseworking system, which meant colleagues had to send every message by hand, on top of a workload that was already under pressure to be more productive.

The communication mechanism worked. The infrastructure and capacity around it didn’t. And because colleagues were actually sending the messages, we discovered that a significant number of customers hadn’t even provided a phone number in the first place. So even if we wired Notify in perfectly, there was another problem further upstream. We wouldn’t have known that without trying to do it – we had to build the thing to find the skeleton.

I think this is where faster making becomes particularly useful in public services. The thing you make becomes a probe into the institution around it. Put something sufficiently real into a service and it starts bumping into all the stuff that is difficult to see from a process map: the system that doesn’t connect, the data you assumed would be there, the interpretation of a policy that has hardened into a rule, the manual workaround quietly holding everything together.

Dan Hill talks a lot about looking at institutions with [“soft eyes”](https://medium.com/dark-matter-and-trojan-horses/the-city-is-my-homescreen-317673e0f57a), paying attention not only to the formal structures but to the relationships, routines and organisational dark matter through which things actually happen. I increasingly think making gives us another way of seeing it. Rather than spending months trying to map every dependency before we move, sometimes we can push something small through the system and see what it hits.

That is discovery too. And it also changes the value for money argument, because the time spent finding out is no longer necessarily time spent before improving the service. You can learn about the institution while also trying to make something better for the people using and delivering it. And fundamentally, that’s why I work in the civil service – to try and make things better.

## Test, learn… then what?

Unfortunately, finding a skeleton doesn’t necessarily mean you have the power to move it. I genuinely believe the test and learn movement has tremendous capacity for change. But I think we have spent far more time thinking about the test and the learn than the bit that comes afterwards. Grow. Scale. Embed. Whatever word you want to use for the awkward moment when something that worked over here has to become how things actually work over there.

Bradach and Grindle wrote more than a decade ago about how [“scaling what works” had become a rallying cry, while pointing out how unclear scale actually was](https://ssir.org/articles/entry/emerging_pathways_to_transformative_scale). I think that ambiguity matters. “Scaling what works”, for better or for worse, makes the next step sound deceptively simple: find an intervention that works, then do more of it. Except, what exactly are we scaling?

With Notify in Drivers Medical, we could test something quickly because we could borrow what already existed. Colleagues could send messages by hand. We could learn without first solving every technology dependency around us. But the very things that made the experiment possible would make a scaled version impossible.

You cannot scale the workaround forever. Suddenly you need technology capacity owned somewhere else, an assurance route proportionate to what you’re trying to do, or a decision that nobody in the team actually has the right to make. None of those things mean the governance is necessarily wrong. Scaling something into a live public service should require different assurances. But there is often a rather large gap between we have learnt that this works and we know how to make this how the service works.

Discovery, alpha, beta and live are phases for building a service. There is no phase for changing who owns the technology, who assures it or who gets to decide. Beta quietly assumes all of that already exists, and the team discovers otherwise at exactly the moment it has something worth keeping. This is the gap the institutionalisation of digital delivery never built a home for. And it’s also where I think AI makes the transformation question more interesting, rather than less.

We may become extraordinarily good at producing things to learn from. Alpha may increasingly start to look like discovery because making itself helps us understand the problem. But every bit of speed we gain there puts more pressure on what happens next. Faster experiments mean faster encounters with the bits of the institution that cannot be prototyped away.

Perhaps that is the bigger challenge hiding underneath all of this. The cost of finding out is falling dramatically. The cost of changing the institution around what we find out isn’t.
