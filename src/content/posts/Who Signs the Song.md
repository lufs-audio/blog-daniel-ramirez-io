---
title: Who Signs the Song?
date: 2026-07-31
draft: false
format: dispatch
description: A Suno code leak proved the scraping was real, I found myself staring at my prototype and thinking about where we're headed, and I figured out the thing that it can't generate.
tags: [ai-music, generative-audio, sound-design, suno, ace-step]
---

Sometime around the end of last year, I took a day, or a weekend or something, and I decided to figure out how far music generation had come. I was familiar with Udio, Lyria, and the more well-known models, but my definition of "how far we've come" is directly proportional to the accessibility of these tools. I had this thought: language models can run at home now, and qwen can actually help get stuff done now. Whisper has been a thing for a while -- people are running it and similar packages all the time, on nearly all of their devices, without even knowing about it! So I thought, "how long until we have the local generative music models?"

Maybe it sounds unrelated, but it's not, and here's why: once you have the audio models at home, it's not long before someone builds a friendly app UI on top of it. In my head, if I'm looking out for one thing, I can expect to find the other. What I found out back then was that we're way, way closer to that than I would have thought.

I'll get back to this, one sec!

## Calling it now: the receipts were always the point

On July 15, someone hacked Suno and posted its source code. Not a think-piece about Suno, not a lawsuit's allegations about Suno - Suno's own code, with the comments still in.

404 Media went through the leaked material and found the scraping instructions written down in plain sight[^1]. The dataset manifests are just... sitting there, tallied by the hour: **113,879 hours of YouTube Music, 152,162 hours of "ytm_tagged," 17,615 hours of Genius, 62,117 hours of Pond5, 12,287 hours of Deezer,** plus Jamendo, IMSLP, Freesound, MuseScore. Code that stream-ripped YouTube through proxies to dodge the blocks. Code that hunted specifically for acapellas so it could isolate vocals.

AI trains on scraped audio; this isn't news. We'd assumed it; the earlier RIAA suits alleged it. What's new is that this time we can read it, in the first person, right there in the codebase. For me, the interesting thing isn't the theft, but moreso the architecture of it. Every design choice assumed that nobody would ever check. lmfao, hi.

And it didn't stop at the model. In early June, the American Federation of Musicians sued Universal and Warner[^2] — not over the scraping, but over what the labels did next: they settled, turned the scraped work into "licenses," and collected, without telling the session musicians on those recordings or paying them for the new use. The labels moved to dismiss; the AFM fired back, arguing the video-game 'new use' precedent — the same argument the labels lost when games became a format — already settled that the obligation is real.[^3]

Then Sony filed its *second* Udio suit, this time naming 30,117 fingerprint-identified recordings and arguing that the majors' own licensing deals prove a market exists — undercutting any fair-use defense[^4]. The labels are on both sides of the table: licensing the same catalogs they claim were stolen, collecting from the very pipelines they're suing over.

And the publishers' amended complaint against Anthropic alleges that lyric reproduction wasn't a training artifact — it was a *designed feature*, baked into how Claude responds to prompts, with internal records showing the company knew it[^5]. Same architecture of plausible deniability, different company.

Then at the other end of the pipe, Lorde watched Spotify's new "About the Song" feature staple an AI-generated description onto her own track that described the wrong song[^6]. "I'm gonna go out on a limb and say we don't want this."

Scraped without consent, laundered without disclosure, interpreted without accuracy. Three different companies, one shared assumption: *hope nobody checks.* If it holds behind the scenes at one company this brazenly, it's worth asking how much of it is load-bearing everywhere the provenance is invisible — not because I can prove that, but because when checking is optional and free to skip, skipping becomes a cost-saving move. "Incentives" all the way down.

## I built the thing I kinda don't want to exist

So, I stayed up late this week catching myself up on all of this. My mind wandered, and I was reminded of late last year, when I decided to teach myself about Comfyui, an open platform that turns generative media into a node-based workflow. I wanted to know how deep the rabbit hole goes, and rev-and-proto is how I always try to find out. If I end up with a usable tool, someone smarter already built it. And, I was indeed successful, so here we are.

I built myself a generative-audio pipeline. Two of them, actually — one around ACE-Step 1, and the other around ACE-Step 1.5XL. One prompt was one YAML file, and every render landed in its own timestamped folder next to its input, content-hashed and cataloged, the same way I make everything.

So yeah, it worked. Here I was, running a little dookie factory on my MacBook: no API calls, no token credits, no instrument in my hand, GPU accelerated, using an audio model less bloated than Pro Tools. I could leave it on overnight, or I could leave it on forever. Out comes the dookie.

And when I listened back, I heard something I recognized: competent, plausible, mass-produced. Exactly the thing Adam Neely keeps naming.

## Solipsistic Listening

In his "Bad Future" video[^7] and again on the *Within Reason* podcast, Neely's sharpest point is that automating idea generation removes the most inspiring part of the craft — "I don't see how greatness can come from a tool like generative AI"[^8]. And on *Music Tectonics* he draws exactly the same line I've written about and that I still draw: the stem-separation tools I use every day are not the same thing as Suno, and flattening them both into "AI" wrecks the conversation[^9].

He's a musician figuring out what swimming looks like in an ocean of AI generated content, what counts as a floatie, and whether it's fine to build a boat instead. Me too, and the thing I can add is that I actually built the boat and took it out, explored the deep and all that. And yeah, he's right about the water.

But "idea generation" isn't one thing. There's the *spark* — the match that strikes which breaks the silence — and there's the *idea as finished statement*, the thing that means something because a person meant it. My pipeline is genuinely useful for the first and completely useless for the second. The de-skilling Neely warns about happens the moment someone mistakes the match for the fire and ships it. What I heard on my MacBook was a filesystem full of struck matches, but none of them were warm.

Neely has a phrase for the far end of this, "solipsistic listening": the drift toward only enjoying the music you generated yourself. Which is real, and which is also fine for a lot of people. There's a large, growing audience that genuinely does not care who or what made the track, and the 100% AI acts charting right now are proof. That's not a lesser audience. It's a *different* one, and I've never built for that one. Worth saying plainly so the rest of this doesn't read as a claim that everybody wants what I want.

## When generation is free, what's left?

So play it forward. If ACE-class models already run on a laptop, then "self-hosted Suno on your phone" isn't an if, but when. Generation itself is on its way to being free, abundant, local, and instant. And when a thing becomes abundant, its price goes to zero and the value moves next door, to whatever stays scarce.

I feel the tempting answer: "taste — the machine can't do taste, so my taste is the moat." But, I don't really buy it. If taste is the moat, then I think, "taste relative to what?" The models? Or the other humans listening? In a world with "we-have-spotify-at-home", airtime just got a whole lot more crowded.

Here's where we are right now: Deezer now receives roughly 90,000 fully-AI tracks every day — more than half of all new uploads[^10]. But, those tracks account for only 1–3% of actual streams, and Deezer says 85% of those streams were fraudulent in 2025. The flood is real, but right now it's inventory dilution, royalty-pool theft, noise. The problem is the signal gets harder to find.

What I've come up with, and maybe it's wrong, but it's what I've settled with for now, is that the thing that doesn't commoditize isn't a skill, really. It's accountability for the output. Audio is about to be free, so the audio pros should have something to lose if the work is bad, and should be able to show you how it was made. A model can't be fired, or sued, or shamed, and doesn't have a reputation it's afraid to lose. But I do! And that's even more of an asset now, but it always has been.

## We've already built systems that work like this

I got this backwards until a certification course I'm taking knocked it straight. I'd assumed "a human has to be accountable" was a soft, artisanal value — nice, not load-bearing, but in practice it's the opposite. Every high-stakes field on earth has already codified it, oftentimes as law!

A CEO and CFO have to *personally* certify their company's financials under Sarbanes-Oxley (§302 and §906); a knowing false certification is prison time for that named person, not a line-item fine for the company. In pharma, a **Qualified Person** has to personally sign off every single batch of medicine before it can be released: a named human, legally on the hook for what ships. In UK financial services, every senior manager holds a "Statement of Responsibilities" and a personal Duty of Responsibility for their patch. The structural engineer stamps the drawing. The airline names an accountable manager.

The pattern is exact: the law almost never says a machine can't do the *work.* It says a named human must remain *answerable* for it, even when a machine did the work. You can automate the task. You cannot automate the signature.

That's what a session musician's signature in the credits always was, someone who stood behind the take. What Suno's architecture removes isn't melody, harmony, or timbre; it removes the signature. No provenance, no consent, nobody answerable. To me, it's way less of a music problem, and more of an accountability sinkhole.

## Crew stays backstage

I'll keep using the tools that let me do what I already do, and I'll always have my eye on what's coming around the corner to see what'll help with my pipelines. I've written about the way I use models previously. For me, they're useful as a way to keep learning and building, orbiting around the flows, but never taking the reins.

The machine I built showed me the future, and taught me about my intrinsic value as a human. I will not be sharing the repo 😹 more soon.

[^1]: 404 Media — "Hack Reveals Suno AI Music Generator Scraped YouTube, Deezer, and Genius" (2026-07-15) — https://www.404media.co/hack-reveals-suno-ai-music-generator-scraped-youtube-deezer-and-genius/
[^2]: MBW — AFM files suit against UMG and Warner over Suno and Udio licensing deals (complaint filed 2026-06-05, SDNY) — https://www.musicbusinessworldwide.com/musicians-union-sues-umg-and-warner-music-alleging-member-recordings-were-licensed-to-suno-and-udio-without-compensation-or-credit/
[^3]: MBW — AFM urges court to reject Universal and Warner bid to dismiss lawsuit, video-game "new use" precedent (2026-07-22) — https://www.musicbusinessworldwide.com/us-musicians-union-urges-court-to-reject-universal-and-warner-bid-to-dismiss-lawsuit-over-suno-and-udio-deals/
[^4]: MBW — Sony Music files new lawsuit against Udio asserting over 30,000 sound recordings (2026-07-20) — https://www.musicbusinessworldwide.com/sony-music-files-new-lawsuit-against-ai-platform-udio-asserting-over-30000-sound-recordings-a-judge-barred-it-from-adding-to-its-original-case/
[^5]: MBW — Music publishers file amended lyrics lawsuit against Anthropic, alleging "designed feature" (2026-07-23) — https://www.musicbusinessworldwide.com/music-publishers-file-amended-lyrics-lawsuit-against-anthropic-just-as-ai-firms-separate-1-5b-piracy-settlement-with-authors-wins-court-approval/
[^6]: Pitchfork — Lorde on Spotify's AI song descriptions (2026-07-16) — https://pitchfork.com/story/lorde-on-spotifys-ai-song-descriptions/
[^7]: Adam Neely — "Suno, AI Music, and the Bad Future" (2026-02-02) — https://www.youtube.com/watch?v=U8dcFhF0Dlk
[^8]: MusicTech — Adam Neely on generative AI replacing music craft, Within Reason podcast (2026-05-14) — https://musictech.com/news/music/adam-neely-generative-ai-replacing-music-craft/
[^9]: Music Tectonics — Adam Neely on the hidden cost of AI music, stem-vs-Suno distinction and "solipsistic listening" (2026-04-29) — https://www.musictectonics.com/post/adam-neely-on-the-hidden-cost-of-ai-music
[^10]: MBW — 90,000 AI tracks flood Deezer daily, passing half of all new music uploads (2026-07-21) — https://www.musicbusinessworldwide.com/90000-ai-tracks-flood-deezer-daily-passing-half-of-new-music-uploads-for-the-first-time/
