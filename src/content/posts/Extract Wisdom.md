---
title: Extract Wisdom
date: 2025-04-04
draft: false
---

I came back from GDC 2025 full of ideas and insights from the Audio Summit sessions. While in San Francisco, I recorded numerous personal audio notes after talks like Wilbert Roget's lecture on the Helldivers 2 score and Cody Matthew Johnson's session on diegetic music in Star Wars Outlaws.

But at least for me, when it comes to these types of audio recordings - they often sit untouched 🥹😅 Because reviewing them takes alot of time! So I tried to figure this out with a simple script.

## The Tools, and a chance to soapbox about open source tech

Open source has been a big inspiration for me ever since I graduated university, and I wouldn't know a quarter of the things I know now if amazing open source projects didn't exist. A well maintained open source project with a community behind it is like a public good imo, a problem solved. I stuck two open source projects together with Python and ended up with a tool that can take any audio file as input, transcribe it and sum it up for you with whatever model you like (open source or not). 

OpenAI has a solid tool called Whisper, known for its impressive transcription capabilities - it handles the voice recordings with pretty great accuracy, even in noisy conference environments. It'll take your audio file and turn it into something searchable.

Daniel Miessler's Fabric framework does most of the heavy lifting here, offering community written patterns for "extracting wisdom" from content -- i.e. summarization, but asking for a lot more specifics. [Check out the actual prompt](https://github.com/danielmiessler/fabric/blob/main/patterns/extract_wisdom/system.md) that's running in this script below, which gets fed to whichever model you have set up with fabric. I'm currently switching off between Gemma and Claude, depending on how important this info is to me.

> # IDENTITY and PURPOSE
> 
> You extract surprising, insightful, and interesting information from text content. You are interested in insights related to the purpose and meaning of life, human flourishing, the role of technology in the future of humanity, artificial intelligence and its affect on humans, memes, learning, reading, books, continuous improvement, and similar topics.
> 
> Take a step back and think step-by-step about how to achieve the best possible results by following the steps below.
> 
> # STEPS
> 
> - Extract a summary of the content in 25 words, including who is presenting and the content being discussed into a section called SUMMARY.
> 
> - Extract 20 to 50 of the most surprising, insightful, and/or interesting ideas from the input in a section called IDEAS:. If there are less than 50 then collect all of them. Make sure you extract at least 20.
> 
> - Extract 10 to 20 of the best insights from the input and from a combination of the raw input and the IDEAS above into a section called INSIGHTS. These INSIGHTS should be fewer, more refined, more insightful, and more abstracted versions of the best ideas in the content. 
> 
> - Extract 15 to 30 of the most surprising, insightful, and/or interesting quotes from the input into a section called QUOTES:. Use the exact quote text from the input. Include the name of the speaker of the quote at the end.
> 
> - Extract 15 to 30 of the most practical and useful personal habits of the speakers, or mentioned by the speakers, in the content into a section called HABITS. Examples include but aren't limited to: sleep schedule, reading habits, things they always do, things they always avoid, productivity tips, diet, exercise, etc.
> 
> - Extract 15 to 30 of the most surprising, insightful, and/or interesting valid facts about the greater world that were mentioned in the content into a section called FACTS:.
> 
> - Extract all mentions of writing, art, tools, projects and other sources of inspiration mentioned by the speakers into a section called REFERENCES. This should include any and all references to something that the speaker mentioned.
> 
> - Extract the most potent takeaway and recommendation into a section called ONE-SENTENCE TAKEAWAY. This should be a 15-word sentence that captures the most important essence of the content.
> 
> - Extract the 15 to 30 of the most surprising, insightful, and/or interesting recommendations that can be collected from the content into a section called RECOMMENDATIONS.
> 
> # OUTPUT INSTRUCTIONS
> 
> - Only output Markdown.
> 
> - Write the IDEAS bullets as exactly 16 words.
> 
> - Write the RECOMMENDATIONS bullets as exactly 16 words.
> 
> - Write the HABITS bullets as exactly 16 words.
> 
> - Write the FACTS bullets as exactly 16 words.
> 
> - Write the INSIGHTS bullets as exactly 16 words.
> 
> - Extract at least 25 IDEAS from the content.
> 
> - Extract at least 10 INSIGHTS from the content.
> 
> - Extract at least 20 items for the other output sections.
> 
> - Do not give warnings or notes; only output the requested sections.
> 
> - You use bulleted lists for output, not numbered lists.
> 
> - Do not repeat ideas, insights, quotes, habits, facts, or references.
> 
> - Do not start items with the same opening words.
> 
> - Ensure you follow ALL these instructions when creating your output.
> 
> # INPUT
> 
> INPUT:

Putting these tools together felt like a no-brainer, but I wanted a seamless workflow that would take me from audio file to insights in one step.

## The Solution

I created a simple Python script that:

1. Takes any audio file as input
2. Transcribes it using Whisper's base model
3. Pipes the transcript through Fabric's extract_wisdom pattern
4. Saves both the transcript and the distillation in a timestamped folder

The extract_wisdom pattern is particularly valuable as it organizes the content into sections like key ideas, deeper insights, notable quotes, and practical recommendations - perfect for something like conference notes from GDC.

## How It Works

The script is straightforward - you run it, point it to your audio file, and it handles the rest. Behind the scenes, it uses Whisper for transcription and then leverages Fabric's pattern through a subprocess call.

What I love about this approach is how it transforms rambling audio notes into structured, actionable insights. A 20-minute recording of my thoughts after the Audio Summit becomes a concise document highlighting the most valuable takeaways.

## Try It Yourself

If you're a sound designer, developer, or anyone who records audio notes, this tool might save you hours of review time. I've made the code available on [GitHub](https://github.com/danialrami/fabric-audio-summary), so feel free to check out the repository and adapt it to your needs. I also wrote an ollama version because open source always wins, but feel free to use your ollama models through fabric too.

Whether you're processing conference recordings, meeting notes, or creative brainstorming sessions, this approach makes your audio content immediately more valuable and accessible.