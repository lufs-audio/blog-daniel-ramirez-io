---
id: Process Registries, and Workchain
aliases: []
tags:
  - process
  - workchain
  - audio-tooling
  - verification
date: 2026-08-07
description: I kept building the same folder over and over. It turns out the folder has a name, a sixty-year literature, and one property that separates it from a very tidy hoard.
draft: false
format: analysis
title: Process Registries, and Workchain
---
Up until the past year or so, whenever I had an idea for a tool, I'd just make a new subfolder in ~/repos and sketch it out -- I bet that's pretty common. The tool can be whatever, but one of my favorite/most useful tools to make are scripts which can finalize a set of audio file deliverables to guarantee that they're up to a client's spec. A common deliverable requirement might look like this, let's say for vocal speech files:

```md
Spec:

Format:
- WAV (.wav)
- 48 kHz
- 24-bit
- True mono (1 channel)

Levels:
- Integrated loudness: -22 to -20 LUFS (EBU R128)
- True peak: -6 dBFS to -3 dBFS

Quality:
- No background noise (no hiss, rumble, ambient)
- No reverb (no room reverberation or echo)
- No pops or clicks (no transient artifacts)
- No other artifacts (no distortion, dropouts, processing artifacts)
```

This is super helpful most of the time! Oftentimes, when working through hundreds or thousands of audio files, mistakes can fall through the cracks -- maybe one of the audio files came out stereo somehow, or the normalization isn't quite right out of the DAW, or something else. Being able to have another round of benchmarking against a specific class of output is great -- it let's me do my thing during the authoring process knowing without a doubt that the set of deliverables is going to be given to the client exactly right. That way, my baseline is hit, and I can focus on being creative.

Verifying every one of them by hand is a non-starter, and half a dozen ffprobe one-liners is a script that's gonna live and die in one client's folder. A single pass at the terminal is enough to catch the format half of the spec:

```bash
$ ffprobe -v error -select_streams a:0 \
    -show_entries stream=sample_rate,channels,bits_per_raw_sample \
    -of csv=p=0 nominal_voice.wav
48000,1,24
```

Sample rate, channels, bit depth, one line — and if that middle number ever reads `2` on a file meant to be mono, there's your problem staring back at you. That's the whole promise of benchmarking against a spec: you don't have to re-audition four minutes of audio to know it's wrong. You run a string comparison against a target and the file either matches or it doesn't.

The thing is, eventually I have random deliverable audit scripts all over ~/repos, like ~/repos/client-A-deliverables, ~/repos/client-N-deliverables. The scripts themselves were almost always the same logic, and the reason I never reused a folder is usually because by the time I needed the script again, I couldn't remember where it was in ~/repos lmfao. Funny to admit, but yeah.

It's also not the first time I've written about this sort of struggle! It's the thing I've noticed that I need to improve, and I've written about it before from the other direction. A while back I got tired of rewriting the same set of ffmpeg commands for batch conversion and [wrapped it in an MCP server](https://blog.daniel-ramirez.io/posts/ffmpeg-and-mcp/) so I could stop, which actually worked pretty well for a while! What I didn't notice at the time is that it only moved the problem up one floor. Eventually, I stopped losing the *commands* and started losing the *pipelines* — the specific ordered arrangement of steps that got a batch of tracks from a session folder to something I'd actually deliver. So I was sorta back in the same place.

It turns out, the unit I kept losing was always the process, with the files being out the door and the project put away before I ever addressed it. And "write it down" turns out to be a much weaker fix than it sounds, because a written-down process in a folder of nineteen other written-down processes isn't really a problem solved, just a problem hoarded. Those are different things, and this post is gonna try to untangle this and end with the solution that's been working for me throughout this year.

## This is a post about process

My flow has really needed some work, so I went back to the basics. I started by thinking "how can I make this generalizeable?" and eventually, I stopped to consider a bigger question "can I make a tool that can generalize process?" Why the heck would I do that??

When I say a *process*, I'm talking about one idea made runnable. It's not a script per se — a script is an implementation detail, so my process is definitely going to *include* a script! But I'm not going far enough down the generalization rabbit hole that I'm going to reinvent a computer, lmfao. The process, instead, is the mechanism: normalize to a loudness target; separate a mix into stems; derive an image from a spectrogram; take a rhythmic cell and phase it against itself. One idea, small enough to name, general enough to point at different inputs. For me, that looks like a signal chain.

The way I see it, three properties turn an idea into a process you can keep:

- **It's pure and parameterized:** Given the same inputs and the same knobs, it produces the same output. Nothing hidden, no ambient state, no "well it worked on my machine last March."

- **It has an anchor:** Something makes the run reproducible. In probablistic work that's a seed. In transformational work — which is what audio processing is, almost entirely — it's the content hash of the input. Same bytes in, same bytes out, forever. 

- **It carries a manifest, not just code:** A declaration of what it is, what its parameters are, what it promises about its output, and how you'd check. The manifest is the part that makes a process a citizen of something larger instead of a loose file.

When I first thought about that last one, I didn't really take it as cornerstone. But, it turns out none of this were original ideas, and finding the historical corpus was the useful part.

Gottfried Michael Koenig was building software to compose with at Utrecht in the mid-1960s — Project 1 in 1964, Project 2 in 1966 — and he called what he was doing a *composition process*. In his essay on it he writes that "composition is the application of a grammar which generates the structures of a piece, whether the composer is aware of an explicit grammar or not" ([PDF](https://koenigproject.nl/wp-content/uploads/2019/08/Composition_Processes.pdf)), which is a claim that puts musical context to the same ideas written above. He also states the design principle better than I've managed to thus far: the dividing line between the composer and the automaton, he says, should run "in such a fashion as to provide the highest degree of insight into musical-syntactic contexts." This resonates with my distinction from last week's article about what's really missing in a fully generative pipeline: "musical-syntactic contexts" is the exact piece you're losing when you take your hands off the wheel from a composition, and I think Koenig laid a foundation for what process looks like today. His insight is sixty years old and still razor-sharp, because it names what you're optimizing *for* rather than just what you're avoiding.

## A registry, not a collection

Here's my argument: once you have a handful of processes written down as proper self-contained things, the obvious move is to collect them: put them in a directory, give each one a folder, boom bam done! You have something that *looks* finished 👏 It might even look like the solution! But in fact, I'm arguing that it's still one property short.

A folder of processes is like a parts bin. If I take a look inside, I can see the parts in front of me, but what exactly am I looking at? It's just a pile for now, and it slowly grows bigger as I add more processes over time, until it kills the ability to find anything and I'm back where I started. I needed an indexing tool that sits on top, which can also hold each process accountable as well, to defend its own right to be included. Luckily, I'm not describing anything new: it's just a registry, and it's why the third bullet point above -- the manifest -- is actually not optional.

Three more bullets for you, to illustrate the mechanics:

- **The filesystem is the registry:** One folder per entry, and the folder is the source of truth -- not a database or a README. You add a process by dropping in a folder, and nothing else has to be updated by hand, which matters because the thing that often fails to get updated by hand are the docs.

- **The index is generated, never written:** A tool walks the folders and emits the catalog. Then the same tool runs in CI with a `--check` flag and fails the build if the generated catalog and the folders disagree. 
	- This sounds like housekeeping, but it really isn't: it's what makes the collection *trustworthy as a collection*, because "what exists here" stops being a claim anyone maintains and becomes a fact anyone can recompute.

- **Each entry declares a contract:** Not just "here's what I do" but "here's what must be true of my output, and here's the machine-checkable version of that." This is the part that separates a registry from a very tidy hoard, and it's where I'll spend the rest of this post.

Worth being direct here: The failure mode of a beautiful collection is that it rots quietly over time (and also that you don't ship, which I'll briefly get to later). Six months in, half the entries no longer do what their READMEs say, and nothing anywhere documented what changed between commits. I can't tell you how many times I've played myself like this! I promise the solution isn't just better documentation hygiene -- our problem is a growing collection that scales and changes, so we need to build a system that gives it that space from the get-go.

## So I built one, for audio

The tool I'm talking about here became a thing I'm building called Workchain. It's a YAML-driven audio processing engine, and it's where I learned all of the above the hard way, in the wrong order, many many times.

The shape is what I've been describing. Each process in Workchain is called a *component*, a folder in the registry that must contain these three files: a `step.yaml` that declares the contract, a `run.sh` that does the work, and a README. With the doc, the script, and the contract in place, I've turned a parts bin into composable blocks, that I can pass context into and out of freely. That's the signal path!

So, in the context of the tool, a *chain* is a YAML file that lists components in order. A lean engine reads the chain, runs each component, and threads a JSON context between them so each step knows what the last one produced. `components/` on disk *is* the registry; a generator walks it and emits `components/index.json`, which is stamped `GENERATED — do not hand-edit` and checked in CI so it can't drift from the folders. A registry suddenly turns into a universal chain for whatever audio process you can make a contract for, it's sick.

Right now, there are three ways to drive it — a Bash engine, a Node CLI, and a Python MCP server, with the same YAML parser runs underneath all three. Below is a real chain, verbatim. This one runs a release through normalization, makes little artwork from a spectrogram of the waveform + an identicon, builds a Spotify Canvas, and catalogs the result:

```yaml
name: "Astro Catalog"
description: "Prep audio files for Astro"
version: "1.0"
engine_version: "2.0"

globals:
  lufs_target: -14
  saturation: 0.5

steps:
  - name: normalization
    enabled: true
    params:
      target_lufs: -14
      two_pass: true
      lra: 7
      true_peak: -1.5

  - name: artwork_01
    enabled: true
    params:
      saturation: 0.5
      width: 1000
      height: 1000

  - name: canvas_01
    enabled: true
    params:
      loop_count: 8

  - name: catalog
    enabled: true
    params: {}
```

That's literally the whole recipe! If processes are the vocabulary, this is a sentence. The last step hashes the finished audio with SHA-256 and takes the first eight hex characters as a catalog number, which is why everything on [catalog.lufs.audio](https://catalog.lufs.audio) is named something like `lufs-290c4817`. The identity of a release is the content of the release. Rename the file, move it, back it up wrong — the number still finds it. Plus, the deliverable example above? Each spec is a recipe too, so a deliverable type becomes a profile instead of a repo I'll lose the second I look away.

<iframe src="https://catalog.lufs.audio/embed/lufs-290c4817" width="100%" height="152" frameborder="0" loading="lazy" allow="autoplay; encrypted-media" style="border:none;border-radius:14px;max-width:456px"></iframe>

## The bug that made me believe any of this

Now the part that turned "registry" from a filing metaphor into an argument I actually hold.

The `normalization` component measures its output. Of course it does — it's a loudness normalizer, measuring is the job. It runs a two-pass `loudnorm`, measures the final integrated LUFS, logs the number, and writes it into a metadata JSON right next to the output file.

In my first iteration of this tool, it exited 0 after this step, but it should've compared the number to the target! 🤦🥹🥀

The right value was sitting in the JSON, measured and ignored. If the normalizer undershot by four LU — on a heavily limited master, say, which is exactly the material where this happens — the component would produce a file, report success, write the evidence of its own failure to disk, and hand the file downstream where the artwork generator and the catalog hasher would unquestioningly treat it as the finished master.

So, that was the impetus of my whole thesis, in one file, and it's why the contract isn't optional in a process registry. Here's the verification block that closes it, verbatim from `components/normalization/step.yaml`:

```yaml
verify:
  schema_version: "1.0"
  outputs:
    - name: primary_output
      assert: [exists, non_empty, audio_valid]
    - name: loudness_metadata
      assert: [exists, non_empty, json_valid]
      json_has: [target_lufs, final_lufs]
  post_conditions:
    - id: integrated_loudness_on_target
      check: audio_lufs_within
      output: primary_output
      target_param: target_lufs
      tolerance: 1.0
```

The important word is *independently*. The verifier doesn't read `final_lufs` out of the component's own metadata and trust it. It re-measures the output file with ffmpeg and compares that to the requested target, within a tolerance of 1.0 LU. If the step missed, the step fails, and the chain stops rather than flowing a bad master into the next component. The comment in that file names the original bug out loud, which I like more than I expected to. The repo remembers being wrong!

So far, I have eighteen components on `main` right now: normalization was an easy win early-on for this kind of tool, but since then I've also added stem separation, embedding with CLAP for a sound library indexer, an acoustic encoder for modem-like transmission, and perturbation to shield my audio from AI-training. All of the components declare their own contracts just like above, and some go beyond structural checks into real numeric or relational assertions: normalization hits its target; the perturbation component preserves duration; stem separation both preserves duration and recombines to the source; the acoustic encoder survives being played out loud and recorded back.

That last one is my favorite because it's the honest shape of the whole idea. You can't assert the correct output of a lossy acoustic round-trip — there isn't one. So you assert what must survive it.

## Steve Reich got there in 1968

The thing I keep circling around is the idea that "it ran" and "it's right" are very different claims, and software culture has spent decades conflating them because exit codes are cheap, and verifiable correctness is painful.

Reich wrote an essay in 1968 called "Music as a Gradual Process" that touches on these ideas in a different medium. His complaint about the serialists and about Cage's chance procedures was that the process was real but *inaudible* — you could not hear the structure, so the structure's correctness was unfalsifiable by the only instrument that matters, our ears. Here's what he wanted instead: "a compositional process and a sounding music that are one and the same thing." And then a banger: ["I don't know any secrets of structure that you can't hear."](https://ccrma.stanford.edu/courses/220b-winter-2024/readings/Reich_Gradual-Process.pdf)

A component that exits 0 and produces no audible error is exactly the thing he was arguing against. The process ran, but you can't hear that it was right. And unlike Reich, I can't always make audibility the test, because some processes don't output audible data. Plus, the workchain is meant to run on thousands of audio files at a time (for a game, or for an app) -- that's the entire point of automating it lmfao. So the contract is the rock-solid stand-in, checking in on every parameter to confirm that what I'm asking for on the way in is exactly what I'm getting on the way out.

## Here's where I'm revving

Workchain still needs work in three places:

- **The chain isn't verified:** Every step is, but right now the chain isn't. It's an extra level of security which I haven't wired in, but I think it's worth doing in the next rev. A chain "succeeds" when no step failed, which is a different and kinda weaker claim. Nothing currently stops the artwork generator from deriving its image from the pre-normalization file, or the catalog hasher from stamping the wrong stage. Each component would be individually honest and the release would still be wrong, which is the exact class of failure the whole thing exists to prevent, one level up.

- **Signing is not the same as trust:** I have this idea in my head that I'm wiring into Workchain, to show me at a glance which components are legit and which are beta. Right now, the tier ladder goes *unverified → verified → certified*, where certified means a trusted author signs the component's definition hash with ed25519. Only two of the three tiers are real today. 
	- The third one is the part where I'm most at odds against someone I agree with. Ivan Illich's convivial tools, in [*Tools for Conviviality*](https://ratical.org/collapsologie/ToolsForConviviality1973.pdf), are ones that "do not require previous certification of the user" — and the whole book is about how credentialing machinery ends up manufacturing the dependency it claims to relieve. I can point out that I want to certify *components*, but even still I don't think it's a complete answer, tbh. So this bun is still in the oven for now.

- **A registry is not a theory.** Peter Naur wrote in 1985 that "the proper, primary aim of programming is, not to produce programs, but to have the programmers build theories" — and that documentation is, in his words, an auxiliary and secondary product ([PDF](https://pages.cs.wisc.edu/~remzi/Naur.pdf)). Which is a direct shot at the idea that writing the process down is the same as keeping it. If the theory lives in me and the manifest is only its shadow, then a registry I've forgotten how to reason about is already dead, however green its CI is. I don't have a fix for that. I have a habit of writing the *why* into the component README and hoping it's enough, and Naur would tell me it isn't.

## A very tidy hoard

Last thing I'll say: the idea of a "process registry" has now shown up in three places in my work without me planning it. Audio is the Workchain above. I've also written a registry of compositional processes — phasing, isorhythm, sieves, change-ringing, a dozen more — each a pure function of parameters and a seed, and each verified by a structural invariant in a test. Finally, I'm also working on a set of visual processes that are the same idea again with pixels and time instead of samples. The animation in on the posts/ page of this website was made with that tool! (: 

It's the same six moving parts every time: a shared kernel, the processes, the registry, the recipes, the handoff between stages, and the verification gate.

Three independent media landing on one architecture feels like evidence of something fundamental, but I want to be careful with that idea because there's a much less flattering explanation that fits just as well: they all have the same author, and this is simply how this boi thinks. That explains the convergence completely and proves nothing about whether the shape is right for anybody else. I'm holding it as an accurate description of things I've built, and it's becoming my house style going forward.

I mentioned this before, but I'll reiterate and confess: collecting process and experimenting with how they fit together in chains is really really fun, and for me specifically, I've noticed a failure mode in this too. I am extremely capable of spending a month making the parts bin beautiful and then not really shipping lol. A growing, elegant, unshipped registry is not the goal.

Laurie Spiegel is the version of this I think about. She wrote Music Mouse in 1986, maintained it herself for decades, and it eventually just stopped — sat on Mac OS 9 until Eventide picked it up and [re-released it in February](https://www.theverge.com/report/879819/laurie-spiegel-is-celebrating-40-of-music-mouse-with-a-modern-revival), forty years on. Her reason for handing it over is the least romantic and most useful sentence in that interview: "My main thing is really composing music, and I have an active enough career doing that to not have enough time to do coding as well." Got my ass! She also takes the trouble to say Music Mouse "is not a generative algorithm or an 'AI'" — a distinction she's been drawing since before, well, you know.

So there's the whole tension in one person. Build the tool because it lets you do the thing. Don't let the tool become the thing, even if feels good to do so.

I'm going to release Workchain in the future with a few of the most useful components that I've made so far 👏 more soon.

<!-- Sources (direct primary links, verified 2026-08-06): -->
- https://koenigproject.nl/wp-content/uploads/2019/08/Composition_Processes.pdf
- https://ccrma.stanford.edu/courses/220b-winter-2024/readings/Reich_Gradual-Process.pdf
- https://pages.cs.wisc.edu/~remzi/Naur.pdf
- https://ratical.org/collapsologie/ToolsForConviviality1973.pdf
- https://www.theverge.com/report/879819/laurie-spiegel-is-celebrating-40-of-music-mouse-with-a-modern-revival
- https://catalog.lufs.audio
- https://blog.daniel-ramirez.io/posts/ffmpeg-and-mcp/
- https://blog.daniel-ramirez.io/posts/you-re-a-clock-i-m-a-clock/
- https://blog.daniel-ramirez.io/posts/who-signs-the-song/
