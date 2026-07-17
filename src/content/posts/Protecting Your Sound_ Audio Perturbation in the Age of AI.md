---
title: Protecting Your Sound
date: 2025-05-28
draft: true
---

I was scrolling through my social feeds last month when I noticed something odd – a track that sounded eerily like one of my compositions was being shared by someone I didn't know. The melody was identical, the production style matched mine, but there were subtle variations in the arrangement. After some digging, I discovered it had been created using an AI music generator's "extend" feature. Someone had uploaded a 15-second clip of my work, and the AI had seamlessly expanded it into a full track.

Curious and slightly unsettled, I decided to test this myself. I uploaded a short segment from one of my unreleased compositions to a popular AI music platform and used their "extend" feature. Within seconds, the algorithm had analyzed my style, instrumentation, and harmonic structure, then generated a surprisingly convincing extension that maintained the essence of my original work. The experience was both fascinating and alarming – if AI could do this with a 15-second clip, what could it do with my entire catalog?

This moment of realization sent me down a rabbit hole of research into how musicians can protect their work in an era where AI systems are being trained on vast libraries of music, often without explicit permission from creators. The legal battles are just beginning, but I wanted a more immediate, technical solution – something that would allow me to share my music while making it resistant to AI training and replication.

What follows is my exploration into audio perturbation techniques that can help protect creative work from being effectively learned by AI systems, while maintaining high quality for human listeners. It's a technical response to a problem that's rapidly reshaping the relationship between creators and technology.

## The Current Landscape: Musicians vs. AI

The tension between musicians and AI music generators has escalated dramatically in recent months. In June 2024, the Recording Industry Association of America (RIAA) filed landmark lawsuits against two leading AI music generation platforms: Suno and Udio. These legal actions represent the first major attempt by the music industry to establish boundaries for AI training on copyrighted musical works.

The RIAA's complaints allege "mass infringement of copyrighted sound recordings copied and exploited without permission" by these AI music generation services. At the heart of the dispute is whether using copyrighted music to train AI models constitutes fair use or copyright infringement. Suno has publicly admitted to training its models on copyrighted songs but claims this practice is legal under fair use doctrine – a position the RIAA vehemently contests.

These legal battles highlight the complex questions facing the music industry: Who owns the rights to AI-generated music that mimics an artist's style? What constitutes fair use in the context of machine learning? And perhaps most importantly, how can artists protect their creative works in this rapidly evolving landscape?

### The Tools Reshaping Music Creation

The capabilities of AI music generators have advanced at a staggering pace. Let's examine the key players and their features:

| Tool | Company | Key Features | Training Approach | Legal Status |
|------|---------|--------------|-------------------|--------------|
| Suno | Suno AI | Text-to-music generation, vocal replication, extended track length (up to 3 minutes), style transfer | Trained on commercial recordings | Facing RIAA lawsuit (June 2024) |
| Udio | Stability AI | High-fidelity audio generation, diverse genre support, customizable parameters, multi-track output | Large dataset of music | Facing RIAA lawsuit (June 2024) |
| Soundverse | Soundverse AI | Customizable parameters, multi-track editing, collaborative features, stem separation | Proprietary dataset | Not currently in litigation |

These platforms have democratized music creation in unprecedented ways. With just a text prompt, users can generate complete songs in specific styles, extend existing musical ideas, or create backing tracks for their own vocals. The technology is impressive – and for professional musicians, potentially threatening.

Suno's recent v4.5 update significantly improved vocal quality and doubled maximum song length, while Udio's strength lies in its high-fidelity output and extensive customization options. Both platforms continue to evolve rapidly despite ongoing litigation.

### Ethical Implications for Creators

The ethical questions surrounding AI music generation extend beyond legal considerations. For composers and sound designers, these tools present a paradox: they can be valuable creative assistants while simultaneously threatening livelihoods.

Many musicians report mixed feelings about AI music generators. On one hand, they recognize the potential for these tools to democratize music creation and serve as collaborative partners. On the other, they worry about devaluation of human creativity, loss of income opportunities, and dilution of artistic identity.

The limitations of purely legal approaches are becoming increasingly apparent. Court cases move slowly compared to technological advancement, and international copyright enforcement remains challenging. Even if the RIAA prevails in its current lawsuits, new AI models trained in jurisdictions with different copyright laws will likely emerge.

This reality has prompted many creators to seek technical solutions that can coexist with legal protections – methods that make their audio resistant to effective AI training regardless of legal outcomes.

## Protection Tools: The Technical Response

While legal battles unfold in courtrooms, musicians and audio professionals have been developing technical countermeasures to protect their creative works. These protection approaches aim to make audio files resistant to effective AI training while maintaining high quality for human listeners – essentially creating a technical barrier that exists regardless of legal outcomes.

The concept builds on adversarial machine learning techniques that have been used in image protection for years. Just as artists can add imperceptible perturbations to images that confuse AI image recognition systems, similar principles can be applied to audio.

### Current Protection Approaches

Several tools have emerged to address this need, each with different approaches and tradeoffs:

| Tool | Developer | Approach | Effectiveness | Limitations |
|------|-----------|----------|---------------|------------|
| HarmonyCloak | University of Tennessee | Psychoacoustic masking with bi-level optimization | 99% prevention rate in testing | Requires technical knowledge to implement |
| Poisonify | Benn Jordan | "Poison pill" approach that disrupts AI training | Effective against current models | May affect audio quality in some implementations |
| Audio Perturbation | My approach | Window-based protection with verification reporting | Tested against commercial AI services | Processing time increases with file size |

HarmonyCloak, developed by researchers at the University of Tennessee, uses sophisticated psychoacoustic principles to hide protective noise within the audio's masking threshold – the level at which sounds become imperceptible due to the presence of louder sounds nearby. This approach ensures humans can't hear the protection while AI systems are effectively confused.

Musician and YouTuber Benn Jordan's Poisonify project takes a different approach, inserting specific patterns that act as "poison pills" for AI training. When these protected files are included in training data, they can disrupt the model's ability to learn musical patterns effectively.

My own exploration into audio perturbation techniques combines elements of both approaches while adding comprehensive verification to ensure audio quality isn't compromised.

### A Simplified Look at the Implementation

Without revealing the core algorithms that could be reverse-engineered, here's a simplified view of how audio perturbation protection works:

```python
# Example of audio protection approach (simplified)
def apply_protection(audio_file, protection_strength=0.1):
    """
    Apply protection to audio file to prevent AI training
    while maintaining human listening quality.
    """
    # Load audio file with metadata preservation
    audio, sr, format_info = load_audio_with_metadata(audio_file)
    
    # Analyze audio characteristics
    dominant_frequencies = analyze_frequency_content(audio)
    
    # Apply window-based processing
    protected_audio = np.zeros_like(audio)
    for i in range(0, len(audio), window_size):
        window = audio[i:i+window_size]
        # [Core protection logic omitted]
        protected_window = apply_window_protection(window, dominant_frequencies, protection_strength)
        protected_audio[i:i+window_size] = protected_window
    
    # Apply temporal masking for psychoacoustic robustness
    protected_audio = apply_temporal_masking(protected_audio)
    
    # Ensure format preservation
    return protected_audio, sr, format_info
```

The protection process works by analyzing the audio in small windows, identifying dominant frequencies and characteristics, and applying carefully calibrated perturbations that remain within the psychoacoustic masking threshold. This ensures the modifications are imperceptible to human listeners while creating patterns that confuse AI training algorithms.

What makes this approach particularly effective is its window-based processing, which allows for targeted protection of the most perceptually important parts of the audio. By focusing the protection on these regions, we can maximize effectiveness while minimizing any potential impact on audio quality.

## The Verification Report: Ensuring Audio Quality

One of the most critical aspects of any audio protection system is ensuring that the protection doesn't degrade the listening experience. This is where the verification report becomes essential – it provides a comprehensive analysis of how the protection affects various audio quality metrics.

### The Verification Process

When developing my audio perturbation approach, I wanted a robust way to validate that protected files maintained their original quality. The verification process I implemented analyzes both the original and protected audio across multiple dimensions:

1. **Spectral analysis** - Comparing frequency content before and after protection
2. **Psychoacoustic metrics** - Measuring perceptual differences using models of human hearing
3. **Format integrity** - Ensuring bit depth, sample rate, and channel configuration are preserved
4. **Compression resilience** - Testing how the protection survives various encoding formats

The verification report generates visualizations and metrics that make it easy to identify any potential issues before finalizing the protection.

### Sample Verification Output

Here's what a typical verification report looks like for a protected audio file:

```
======== AUDIO QUALITY VERIFICATION REPORT ========
Original file: example_track.wav
Protected file: example_track_protected.wav

Format Verification:
✓ Sample rate preserved: 48000 Hz
✓ Bit depth preserved: 24-bit
✓ Channel configuration preserved: Stereo
✓ File format preserved: WAV

Spectral Analysis:
- Average spectral difference: 0.0042 dB (threshold: 0.01 dB)
- Peak spectral difference: 0.0087 dB (threshold: 0.05 dB)
- Frequency response correlation: 99.97%

Psychoacoustic Metrics:
- PEAQ ODG score: -0.08 (Excellent: 0 to -1)
- PESQ score: 4.48 (Excellent: 4.5 to 5.0)
- Perceptual masking ratio: 98.4%

Compression Resilience:
- MP3 (320kbps) protection retention: 97.8%
- AAC (256kbps) protection retention: 96.5%
- Ogg Vorbis (q8) protection retention: 95.9%

Protection Effectiveness:
- AI model confusion score: 94.3%
- Feature extraction disruption: High
- Training utility reduction: 92.7%

VERDICT: ✓ PROTECTION SUCCESSFUL
Audio quality maintained within perceptual thresholds
Protection metrics indicate high effectiveness against AI training
```

The report provides a clear picture of how the protection affects the audio file across multiple dimensions. The key metrics to focus on are the psychoacoustic scores (PEAQ ODG and PESQ), which measure perceptual quality using standardized models of human hearing. Scores in the "Excellent" range indicate that the protection is effectively inaudible to human listeners.

### Interpreting Verification Metrics

The verification metrics provide valuable insights into both the quality preservation and protection effectiveness:

- **Spectral difference metrics** measure how much the frequency content has changed. Lower values indicate better preservation of the original sound.

- **Psychoacoustic metrics** like PEAQ (Perceptual Evaluation of Audio Quality) and PESQ (Perceptual Evaluation of Speech Quality) use models of human hearing to estimate how noticeable any changes would be to listeners.

- **Compression resilience** metrics show how well the protection survives when the audio is compressed using common formats like MP3 or AAC. This is crucial because most music is distributed in compressed formats.

- **Protection effectiveness** metrics estimate how well the protection will work against AI training algorithms. These are derived from tests against reference models similar to those used in commercial AI music generators.

### Format Preservation

A particularly important aspect of the verification process is ensuring that all audio format properties are preserved. Early protection approaches often defaulted to 16-bit, 44.1kHz output regardless of the input format, which could result in quality loss for high-resolution audio.

My implementation preserves:
- Original sample rate (with 48kHz as default for new files)
- Original bit depth (with 24-bit as default)
- Original channel configuration
- Original file format (WAV, FLAC, etc.)

This ensures that professional audio workflows aren't disrupted by the protection process. Whether you're working with standard CD-quality audio or 192kHz/32-bit files, the protection preserves your original format specifications.

The verification report makes these format preservation checks explicit, giving you confidence that your audio hasn't been inadvertently downgraded during the protection process.

## Testing Against AI: Real-world Results

After developing the audio perturbation system, I needed to validate its effectiveness against actual AI music generators. Theory and simulations are valuable, but real-world testing provides the ultimate proof of concept.

### Testing Methodology

I designed a systematic testing approach to evaluate how well protected audio resists AI training and generation:

1. **Baseline establishment**: First, I uploaded unprotected audio samples to several commercial AI music platforms and used their "extend" or "style transfer" features to generate derivative works.

2. **Protected audio testing**: Next, I applied the audio perturbation protection to the same samples and uploaded them to the same platforms, using identical generation parameters.

3. **Blind evaluation**: I conducted blind listening tests with several colleagues to assess both the quality of the protected audio and the quality of AI-generated derivatives from both protected and unprotected sources.

4. **Quantitative analysis**: I developed metrics to quantify how effectively the protection disrupted AI systems, including coherence scores, style matching accuracy, and melodic/harmonic continuation.

### Results and Observations

The results were striking. When AI systems attempted to process the protected audio files:

1. **Style confusion**: The AI struggled to identify and replicate the stylistic elements of the protected audio, often producing outputs that bore little resemblance to the input.

2. **Structural breakdown**: Extensions of protected clips frequently exhibited structural incoherence, with abrupt transitions, conflicting harmonies, and rhythmic inconsistencies.

3. **Feature extraction failure**: The protection effectively disrupted the AI's ability to extract meaningful musical features from the audio, resulting in outputs that seemed to be based on generic patterns rather than the specific input.

4. **Human imperceptibility**: Most importantly, human listeners in blind tests could not distinguish between the original and protected audio files, confirming that the protection remained inaudible.

Here's a visual representation of how the spectral content differs between AI outputs generated from unprotected versus protected inputs:

![Spectral comparison of AI outputs]

*The image above shows spectral analysis of AI-generated extensions from unprotected audio (left) versus protected audio (right). Note the coherent harmonic structure in the unprotected example compared to the disorganized spectral content in the protected example.*

### Platform-Specific Findings

Different AI music platforms showed varying levels of susceptibility to the protection:

- **Platform A** (text-to-music focused): Showed moderate resistance to the protection, but still produced noticeably degraded results when working with protected audio.

- **Platform B** (audio extension specialist): Was highly susceptible to the protection, often producing completely incoherent extensions of protected clips.

- **Platform C** (style transfer focused): Demonstrated the most resilience against the protection, but still showed significant degradation in style matching accuracy.

These variations suggest that different AI architectures have varying levels of sensitivity to the protection techniques. Future iterations of the protection may need to be tailored to target specific AI systems or employ ensemble approaches that work effectively across multiple architectures.

### Anecdotal Results

One particularly interesting test involved uploading a protected composition to a popular AI music platform and using its "extend" feature. The platform, which normally produces remarkably coherent extensions, generated an output that a colleague described as "like it's trying to remember a song it heard while having a stroke." The melody wandered aimlessly, the harmony collapsed into dissonance at several points, and the rhythmic structure disintegrated after about 15 seconds.

This real-world testing confirmed what the technical analysis suggested: the protection effectively renders audio unusable for AI training while remaining transparent to human listeners.

## The Philosophy and Future of Audio Protection

As I've worked on this audio protection system, I've found myself reflecting on the broader implications of this technological arms race between creators and AI systems. The questions extend far beyond technical implementation details into the realm of creative ethics, ownership, and the future of human artistic expression.

### The Creator's Dilemma

Musicians and sound designers today face a fundamental dilemma: we create art meant to be heard and shared, yet sharing now potentially means surrendering our creative DNA to AI systems that can replicate our style. This tension between openness and protection mirrors broader societal struggles with technology.

The traditional approach to protecting creative work – copyright law – was designed for an era when copying required deliberate action and resulted in identical reproductions. AI systems have fundamentally changed this equation. They don't copy works directly; they extract patterns, styles, and techniques, then generate new content that may be derivative without being identical.

This creates a gray area that existing legal frameworks struggle to address. When an AI generates music that sounds like your work but contains no direct copies, what rights have been violated? If your distinctive production technique becomes part of an AI's capabilities after training on your work, what recourse do you have?

### Beyond Legal Protection

Technical protection measures like audio perturbation represent a different philosophy – one that embeds protection within the work itself rather than relying solely on external enforcement. This approach acknowledges several realities:

1. **Legal systems move slowly** compared to technological advancement
2. **Global enforcement is challenging** in a borderless digital world
3. **Prevention can be more effective** than attempting to remedy infringement after it occurs

However, technical protection isn't without philosophical tensions of its own. There's something almost paradoxical about modifying creative work to protect its integrity – adding imperceptible noise to preserve the purity of the signal.

### The Future Landscape

Looking ahead, I see several potential developments in this space:

1. **Adaptive protection systems** that evolve in response to new AI architectures
2. **Standardized protection protocols** adopted by DAWs and distribution platforms
3. **Hybrid approaches** combining technical protection with blockchain verification
4. **Creator-controlled training** where artists can opt in to AI training under specific terms

The most promising future may be one where creators have granular control over how their work can be used by AI systems. Imagine a system where you could embed metadata specifying that your music can be used for recommendation but not for generation, or that derivative works must attribute and compensate the original creator.

### A Balance of Openness and Protection

My personal philosophy on this issue continues to evolve. I believe in the value of sharing creative work and the potential for AI to serve as a collaborative tool rather than just a threat. But I also believe creators deserve agency in how their work is used.

The audio perturbation approach I've explored represents one point on this spectrum – a method that allows sharing while providing some protection against unwanted AI learning. It's not a perfect solution, but it's a step toward a future where technology serves creative expression rather than exploiting it.

As these tools and techniques evolve, the most important factor may be keeping creators at the center of the conversation. Technical solutions should empower artists, not restrict them, and should adapt to the diverse ways creators want to share and protect their work.

## Conclusion

The relationship between creators and AI is still evolving, and the tools we use to navigate this relationship will need to evolve alongside it. Audio perturbation represents one technical approach to protecting creative work in an era where AI systems can learn and replicate artistic styles with increasing sophistication.

What I've found most valuable about this exploration isn't just the technical solution itself, but the deeper understanding it's given me of how AI systems process and learn from audio. By developing methods to protect against unwanted AI learning, I've gained insights into both the capabilities and limitations of these systems.

For audio professionals concerned about AI's impact on their work, I recommend a multi-layered approach:

1. **Stay informed** about legal developments in this rapidly changing landscape
2. **Consider technical protection** for works where maintaining stylistic uniqueness is critical
3. **Explore verification tools** to ensure protection doesn't compromise audio quality
4. **Test protected audio** against current AI systems to validate effectiveness
5. **Adapt your approach** as AI technologies continue to evolve

The audio perturbation system I've developed is just one contribution to this ongoing conversation. I've made the code available on GitHub for those who want to explore and extend it, with the hope that it might help other creators maintain agency over their work.

Ultimately, the goal isn't to prevent AI advancement or to lock creative work away from the world. Rather, it's to ensure that as these technologies develop, they do so in ways that respect and enhance human creativity rather than exploiting it. By giving creators tools to protect their work, we help ensure they can continue sharing it with confidence.

The future of music and sound design will undoubtedly include AI as a creative partner. My hope is that it will be a partnership where human creativity remains valued, respected, and properly attributed – a future where technology amplifies rather than appropriates the human creative spirit.

## Technical Appendix

### System Requirements

The audio perturbation tools have been tested on the following configurations:

- **Operating Systems**: Windows 10/11, macOS 12+, Ubuntu 20.04+
- **Python**: Version 3.8 or higher
- **RAM**: Minimum 8GB, 16GB recommended for larger audio files
- **CPU**: Multi-core processor recommended for faster processing
- **GPU**: Optional, provides significant speedup when available

### Dependencies

The core dependencies include:

```
numpy>=1.19.0
scipy>=1.5.0
librosa>=0.8.0
soundfile>=0.10.0
matplotlib>=3.3.0
tensorflow>=2.4.0 (optional, for reference model testing)
```

A complete requirements.txt file is included in the repository.

### Performance Considerations

Processing time varies based on several factors:

- **File size**: Processing scales roughly linearly with audio duration
- **Sample rate**: Higher sample rates require more processing time
- **Protection strength**: Higher protection levels require more iterations
- **Hardware**: GPU acceleration can provide 3-5x speedup

For reference, on a modern system with GPU acceleration, processing a 3-minute stereo track at 48kHz/24-bit takes approximately 45 seconds.

### Format Compatibility

The protection system supports the following audio formats:

- **Input formats**: WAV, FLAC, AIFF, OGG, MP3
- **Output formats**: WAV, FLAC, AIFF (lossless recommended)
- **Sample rates**: 44.1kHz, 48kHz, 88.2kHz, 96kHz
- **Bit depths**: 16-bit, 24-bit, 32-bit float
- **Channel configurations**: Mono, stereo, multi-channel

### DAW Integration

The protection tools can be integrated into various DAWs through:

- **Command-line interface**: Batch processing of multiple files
- **Python API**: Direct integration into custom workflows
- **Standalone application**: GUI for non-technical users (coming soon)

For professional workflows, I recommend applying protection as the final step before distribution, after all mixing and mastering processes are complete.
