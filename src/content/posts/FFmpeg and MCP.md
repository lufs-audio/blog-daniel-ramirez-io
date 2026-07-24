---
title: FFmpeg and MCP 
date: 2025-07-03
draft: false
---

I've been processing a lot of field recordings lately, and found myself repeatedly running the same FFmpeg commands across directories full of audio files. Convert to a consistent format, apply some normalization, maybe add EQ + whatever. Each time, I'd write a quick bash script, tweak it for the specific task, and move on. But after the dozenth time doing this dance, I started thinking about building something more robust.

That's when I realized this was a perfect use case for an MCP server.

## I love scripting but i hate scripting

FFmpeg is one of those tools that's simultaneously incredibly powerful and somewhat intimidating. It can do almost anything with audio (and video), but its command-line interface requires precise syntax and deep knowledge of its thousands of options. For audio professionals, it's an essential tool — but one that often requires keeping a text file of commonly used commands or constantly referencing documentation.

The real challenge comes with batch processing. Sure, you can write shell scripts, but they're often brittle, platform-specific, and don't handle edge cases well. What if a file is corrupted? What if you accidentally run the same command twice? What if you need to process files larger than expected?

## MCPs (reprised)

As I wrote about in my [previous post on MCPs](https://danialrami.com/posts/mcps-and-merlet/), Model Context Protocol servers provide a standardized way for LLMs to interact with external tools and systems. But here's the key insight: MCPs aren't about replacing human expertise with AI magic. They're about creating conversational interfaces to specialized tools while keeping the actual processing deterministic and under your control.

This distinction is crucial for audio work. When I'm processing field recordings or preparing stems for a mix, I need to know exactly what transformations are being applied. I can't have an AI making creative decisions about my audio — but I'd love to have a more intuitive interface to the powerful tools I already use.

## The FFmpeg MCP Server

So I built an FFmpeg MCP Server that does exactly this. It's a Python-based tool that:

1. **Wraps FFmpeg in a secure Docker container** — no risk of malicious commands or system damage
2. **Enforces consistent output formats** — all files become 48kHz, 32-bit WAV with preserved channel counts
3. **Handles batch processing intelligently** — with progress tracking, file size validation, and timeout protection
4. **Creates timestamped output directories** — so you never accidentally overwrite your work

The beauty is that you still write the FFmpeg commands yourself. The server just handles all the orchestration, safety, and batch processing logistics.

## Real-World Examples

There are a few different tools in this server, two utilities and one main function. Here, I can ask an llm to see what it can do:

> `Can you check what audio processing capabilities are available?`

it calls the server, which will output something like:

```json 
{
  "docker_available": true,
  "docker_status": "Docker is available: Docker version xx.x.x, build xxxxxxx",
  "supported_formats": [
    ".3g2",
    ".3gp",
    ".aac",
    ".ac3",
    ...,
  ],
  "output_format": "WAV (PCM signed 32-bit little-endian)",
  "output_sample_rate": "48000 Hz",
  "output_bit_depth": "32-bit",
  "channel_handling": "Preserves original channel count",
  "allowed_ffmpeg_flags": [
    "-ab",
    "-ac",
    "-acodec",
    "-af",
    "-an",
    "-aq",
    "-ar",
    "-async",
    "-b:a",
    "-c:a",
    "-channel_layout",
    "-channels",
    "-codec:a",
    ...,
  ],
  "example_commands": [
    {
      "description": "Simple format conversion",
      "template": [
        "-i",
        "{input}",
        "{output}"
      ]
    },
    {
      "description": "Apply audio filter",
      "template": [
        "-i",
        "{input}",
        "-af",
        "loudnorm",
        "{output}"
      ]
    },
    {
      "description": "Trim audio from 10s to 30s",
      "template": [
        "-i",
        "{input}",
        "-ss",
        "10",
        "-t",
        "20",
        "{output}"
      ]
    },
    {
      "description": "Normalize and compress",
      "template": [
        "-i",
        "{input}",
        "-af",
        "loudnorm,acompressor=threshold=-20dB:ratio=4:attack=5:release=50",
        "{output}"
      ]
    }
  ]
}
```

Finally, the LLM will then say something -- probably in cheery way lol -- along the lines of:

> "The audio processing capabilities look quite robust! Here's what's available: {reports the json in natural language}"

The first time i ran than this, it hit me that this was a little universal scripter, isolated to only use ffmpeg for security, and powered by years of my own skillset development. Nice!

Here are some more examples. Say I have a folder of field recordings in various formats — some 96kHz wavs from my Zoom, some m4a's from my phone, maybe mp3s from collaborators. I want them all normalized and in a consistent format for editing.

### Example 1: Simple Format Conversion
```json
{
    "directory": "/Volumes/FieldRecordings/2024_December",
    "command_template": ["-i", "{input}", "{output}"]
}
```

This converts everything to 48kHz, 32-bit WAV. Dead simple, but now I don't have to worry about sample rate mismatches in my DAW.

### Example 2: Loudness Normalization
```json
{
    "directory": "/Users/dan/stems/vocals",
    "command_template": ["-i", "{input}", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "{output}"]
}
```

This applies EBU R128 loudness normalization — perfect for preparing podcast episodes or ensuring consistent levels across a sample library.

### Example 3: Creative Processing
```json
{
    "directory": "/Volumes/Samples/drums",
    "command_template": [
        "-i", "{input}", 
        "-af", "highpass=f=80,acompressor=threshold=-20dB:ratio=4:attack=5:release=50,aecho=0.8:0.88:60:0.4",
        "{output}"
    ]
}
```

High-pass filter at 80Hz, compression, and a subtle echo — great for creating processed versions of drum samples.

### Example 4: Extracting Specific Segments
```json
{
    "directory": "/Users/dan/longform_recordings",
    "command_template": ["-i", "{input}", "-ss", "00:05:00", "-t", "30", "-af", "afade=in:0:5,afade=out:25:5", "{output}"]
}
```

Extract 30-second segments starting at 5 minutes, with 5-second fades — useful for creating preview clips or isolating interesting moments from long recordings.

## The Human Element

What I love about this approach is that it preserves the human element in audio processing. You're not asking an AI to "make this sound good" — you're using your expertise to craft specific FFmpeg commands, then letting the system handle the tedious parts: file management, format consistency, and safety.

The conversational interface through the LLM just makes it easier to construct and modify these commands. Instead of remembering that `-af loudnorm=I=-16:TP=-1.5:LRA=11` is the magic incantation for broadcast loudness, you can describe what you want and refine it through dialogue.

## Workflow Integration

This tool has already changed how I approach batch processing. Here's my typical workflow now:

1. **Organize source files** into directories by type or purpose
2. **Test commands** on a single file using the LLM interface
3. **Run batch processing** with confidence, knowing outputs will be timestamped and organized
4. **Import to DAW** with guaranteed format consistency

The timestamped output directories are really useful — I can run multiple processing passes with different parameters and compare results without fear of overwriting anything.

## Technical Implementation

For the technically curious, the server uses several layers of protection:

- **Docker sandboxing** with no network access and unprivileged user execution
- **Command whitelisting** that only allows safe FFmpeg flags
- **File size limits** (default 7GB) to prevent processing massive files accidentally
- **Timeout protection** (5 minutes per file) to handle hung processes
- **Automatic channel detection** using ffprobe to preserve multichannel formats

The code is open source under GPL v3, so you can inspect exactly what it's doing and modify it for your needs. Even in its current form, this tool has eliminated a significant source of friction in my audio workflow.

## Getting Started

If you want to try this yourself, you'll need:

1. Python 3.7+
2. Docker installed and running
3. The MCP framework - `pip install mcp`

Then it's as simple as running the server and connecting it to your LLM of choice. The full documentation and code are on [GitHub](https://github.com/danialrami/ffmpeg-mcp-server).

## Conclusion

Building specialized MCP servers for audio workflows represents a shift in how we might interact with powerful but complex tools. By maintaining human control over the actual processing while leveraging conversational interfaces for orchestration, we get the best of both worlds: the precision of deterministic tools and the ease of natural language interaction.

For sound designers and audio engineers who live in the command line, tools like this can dramatically streamline repetitive tasks while maintaining the control and predictability we need. If you end up trying it out, let me know! more soon 👏