---
title: Portfolio Problems
date: 2025-04-16
draft: false
---

I've been pretty inconsistent with portfolio documentation. I'll either:

1. Forget to capture cool moments entirely
2. Hastily record something but never find the file again
3. End up with a scattered collection of clips with no context
4. Put off making an actual reel until a job opportunity forced my hand

I've been needing a system that's low-friction enough that I'll actually use it, but structured enough that it would automatically organize everything for me.

When I'm in the middle of a workflow, the last thing I want to do is stop, switch contexts, set up a screen recorder, figure out where to save the file, and then try to remember to organize it all later. By the time I think about my portfolio again, the thing I was up to three months ago is buried in project files or worse - completely gone because the project got turned over.
## v0

I created a simple workflow that sits in Obsidian (where I already track all my projects) and makes portfolio documentation a two-second decision rather than a whole process. It's basically just three scripts:

- A capture tool that hooks into OBS + a metadata generator that organizes clips by type and year
- A reel generator that automatically compiles everything with proper titles
- A bash script to run the capture tool

The idea is dead simple: when I do something worth documenting, I trigger the capture script (I use [Kando](https://kando.menu/), but a hotkey would work too), answer three quick questions, and boom - it records what I'm doing, stops when I tell it to, and files it away with proper metadata. Later, when I need to show someone my work, I run one command and get a professional-looking reel that's ready to share.

## How It Works

The workflow keeps track of:

- Multiple reel types (sound design, music composition, tech audio implementation)
- Project metadata (client, role, year)
- Clip ordering and trimming
- Text overlays and transitions

Everything gets saved into a structured directory that looks like this:

```
reel/
├── sound-design/
│   ├── 2025/
│   │   ├── 1.mp4
│   │   ├── 1.yaml
│   │   ├── 2.mp4
│   │   └── 2.yaml
├── composition/
│   └── 2025/
└── implementation/
    └── 2025/
```

Each clip gets a YAML file that looks something like:

```yaml
title: "Amazing Sound Design for Amazing Experience"
role: "Sound Designer"
client: "Amazing Studios"
year: 2025
order: 1
start: 10 # in seconds
end: 40 # same here
```

When I need a reel, I just run:

```bash
python create_reel.py sound-design 2025
```

And it exports a fully compiled reel with text overlays and transitions.

## Who cares

This is a workflow that feels like it's helped solve a persistent problem for me. Sound design is sorta ephemeral in a way that visual art isn't. Documenting the process helps translate the work for other collaborators and non-designers by showcasing not just the final sound, but the context and intention behind it. When others can see how sound design transforms an experience, they better understand the value we bring to projects. It bridges the gap between "sounds good" and "here's exactly how sound transformed this experience."

What I've found is that by removing the friction, I'm way more consistent about building my portfolio over time rather than scrambling to put something together when an opportunity comes up.

The biggest benefit is psychological - now I feel like I'm building something lasting when I work on projects, not just delivering files that might disappear into the ether.

## Give it a go

I've put the code on [GitHub](https://github.com/danialrami/portfolio-reel) if you're interested in trying it or adapting it for your own workflow. It's not fancy, but who wants fancy? The readme has all the setup instructions.

Would love to hear what solutions you've come up with 👏 more soon.