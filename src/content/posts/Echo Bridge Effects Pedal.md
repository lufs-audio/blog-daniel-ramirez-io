---
title: Echo Bridge Effects Pedal
date: 2025-06-19
draft: false
---

I recently visited a well-known local landmark called Echo Bridge and was inspired by it for my work. At first I thought I'd do a true convolution reverb, in the style of the [Tasty Chips pedal](https://www.perfectcircuit.com/tasty-chips-integral.html), but I realized that I could create something much more flexible than just a distillation of the landmark.

## The Sound of Echo Bridge

Echo Bridge is well known for its [near-perfect natural acoustics and incredible echo effects](https://texashighways.com/culture/arts-entertainment/in-appreciation-of-echo-bridge-the-coolest-music-venue-in-texas/). The concrete arch structure of the Mrs. Frank W. Sorrell Bridge creates an acoustic phenomenon where sounds can return up to 15 reverberations, with sharp sounds like handclaps repeating as many as 25 times. Around San Antonio, there are [often](https://www.instagram.com/echobridgeappreciationsociety/?hl=en) [concerts](https://www.tiktok.com/@do210sanantonio/video/7456626376355925278) that take place here specifically because of its acoustic properties. It's pre-delay sounded to me like something close to around 0.4 seconds, with a dark and almost plate-y sound -- probably because of the metal on top of the bridge, not sure. It's definitely unique and provided the perfect inspo for this project.
## The Hardware

For the hardware, I chose the [Hothouse](https://github.com/clevelandmusicco) pedal from [Cleveland Music](https://clevelandmusicco.com/), which provided a form factor that I could optimize for. It's also based on the [Daisy Seed](https://electro-smith.com/products/daisy-seed?variant=45234245140772), which means that this pedal can always be reflashed with a new firmware if I ever wanted in the future. The Hothouse's six knobs and three switches give me plenty of real-time control over the complex DSP algorithms, while the dual footswitches allow for intuitive performance switching between effects.

![Image Description](/images/IMG_3755.jpeg)
## The Software

I was inspired by an open source project I found based on the Hothouse form factor called the [Flick](https://github.com/joulupukki/hothouse-effects/tree/main/src/Flick). Huge shoutout to this project! The original author has written that they intended to create a compact alternative to the Strymon Flint, combining reverb, tremolo, and delay effects into a single pedal that could fit on smaller pedalboards. Their goal was to replace multiple pedals (delay, tremolo, and reverb) while maintaining the quality and character of dedicated units.

However, I still wanted to make sure the reverb was close to Echo Bridge, while retaining the flexibility to explore beyond just convolution. By building on the Flick's foundation, I could create something that captures the specific character of this San Antonio landmark while offering the versatility of programmable DSP effects.

## The Website

After I got the hardware working, I created a comprehensive [manual website](https://echobridge.lufs.audio) for the Echo Bridge pedal. I wanted to create something that would help users bond with the pedal quickly and reference settings easily. The site features:

- **Comprehensive control tables** documenting every knob, switch, and footswitch function
    
- **Patch Configurations** for classic sounds like the original Echo Bridge tone
    
- **Edit mode documentation** for deep reverb parameter tweaking
    
- **Animated background elements** that give it a playful, technical feel
    
The website uses a flat, retro design philosophy with no rounded corners, pixelated image rendering, and CRT-style text glows that complement the pedal's vintage-inspired sound character.

<iframe src="https://echobridge.lufs.audio/" 
        width="100%" 
        height="700" 
        title="Echo Bridge Guitar Effects - LUFS Audio" 
        style="border: 1px solid #ccc; border-radius: 8px;"
        loading="lazy">
</iframe>

## Key Features

The Echo Bridge pedal ended up being much more than just a reverb unit. Again, big shoutout to the original Flick for the amazing UX! Here's what this pedal does: 

**Reverb Engine**: Six-parameter reverb with pre-delay, decay, diffusion, and frequency filtering - all accessible through the edit mode for deep sound design.

**Tremolo Section**: Three waveforms (sine, triangle, square) with speed and depth controls, plus makeup gain compensation.

**Delay Line**: Full-featured delay with time, feedback, and mix controls that can work independently or alongside the other effects.

**Smart Footswitch Logic**: The dual footswitches handle multiple functions - reverb on/off with edit mode access, and delay/tremolo switching with visual LED feedback.

## Reflections

While I started with the goal of capturing Echo Bridge's specific character, I ended up creating something I'd consider to be much more flexible - a tool that can evoke that space while also exploring entirely new sonic territories.

The combination of open-source inspiration, local landmarks, and modern DSP feels like the perfect intersection of my interests. Plus, having a pedal that can always be reflashed means this is really just the beginning - I can continue developing new algorithms and features as my understanding of both the hardware and the acoustic space evolves.

If you're interested in checking out the full manual and technical specifications, you can explore the [repo](https://github.com/danialrami/echo-bridge-manual) of the website I built, complete with all the control mappings, preset configurations, and that retro aesthetic that matches the pedal's vintage-inspired sound. 

And if you want a pedal, hit me up! I'll build one for you if you send me the parts 👍