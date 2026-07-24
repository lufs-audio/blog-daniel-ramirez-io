---
title: MIDI & Audio Recorder
date: 2025-01-07
draft: false
---

I've wanted a tool like this for years, because I've always found myself sitting at my piano and wishing that with one button I could very easily record a jam. Something way more pared down than a daw, with less setup time and complexity, and that won't tempt me to start piling on effects.

![Image Description](/images/Screenshot%202025-01-16%20at%201.08.23%20PM.png)

## Field Recorder on Steroids

Taking inspiration from the simplicity of tape machines and field recorders, I wanted to create a modern hybrid that could capture both audio and MIDI simultaneously. The goal was to preserve that spontaneous "just hit record" feeling while adding the flexibility of digital recording.

## What It Does

The recorder captures two stereo pairs of audio (a stereo microphone and piano, in this case) along with MIDI data from my keyboard.

Everything gets saved with clean timestamps, making it easy to find recordings later.

![Image Description](/images/Screenshot%202025-01-16%20at%201.10.01%20PM.png)

The interface provides real-time visual feedback through scopes for audio and a kslider for midi, so you can keep an eye on your input while staying focused on playing.

## Why I Built It

The use case is for anyone who wants to capture ideas quickly without the overhead of setting up a full recording session, mics, or even a daw template. Whether practicing, composing, or just jamming, sometimes you need something that's meant to work with what you have set up *right now*.

Speaking of -- if you find it useful but you think that even opening it is too slow for you (first off, wow. but same), you can map it to a keyboard shortcut, or use a tool like [Kando](https://kando.menu/) to open it directly from a pie menu. Now you're never too far away!

![Image Description](/images/Screenshot%202025-01-16%20at%201.10.35%20PM.png)

## v0+

I'll be working on augmenting this tool further until it can handle arbitrary audio and MIDI tracks. Currently it's built for my personal workflow, but in a future version the setup will be more customizable from Presentation. Ultimately, the goal is to maintain that one-button simplicity while adding more flexibility for different recording scenarios.

The beauty of this approach is that it combines the immediacy of old-school recording with the advantages of modern digital formats. Sometimes the best ideas come when you're just playing around, which in the end is how most of us got started here. Check out the patch [here](https://github.com/danialrami/midi-audio-recorder), tweak your save folder, adjust your inputs and go for it!