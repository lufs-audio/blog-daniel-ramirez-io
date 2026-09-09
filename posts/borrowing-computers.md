For ten days this past March, I sat in silence in the middle of Texas, out past College Station, on a meditation retreat that cut me off from basically everything — no phone, no conversation, from like 4:30 am to 9:30 pm. Just sitting with my own mind. Most of it was genuinely peaceful, lowkey, but some of it wasn't. Instead of my brain taking advantage of the chance to chill for a sec, it spent a good amount of time trying to talk me into finding a reason or a way to reconnect to others: check in my social life, or even just head-nod at somebody while i was walking along the meditation path at the center. I later learned that sitting with the feeling is part of the act of learning to meditate, lol. It turns out being disconnected from my network, even for just a little while, takes some practice.

A few months later I watched a newborn computer experiencing the same silent bliss that I felt, while my brain once again was trying to figure out how to get it to connect to my Wi-Fi. I spun up a fresh VM, and instead of a real address it reported `169.254.x.y`: the networking equivalent of "anicca, anicca". Cut off, nobody in, nobody out. Computational equanimity. On the retreat, the isolation was the whole point, and I signed up for it. But on my little guy, it meant something wasn't right, and it took me most of an evening to find out what.

The situation is the same, but the feeling is totally different depending on whether you asked for it. I spent the last week exploring the distinction: making disconnection a deliberate choice instead of an accident.

## Someone already solved this, in 1964

If you've never considered a virtual machine before, think of it as a way of convincing one physical computer to behave like several separate ones, each with its own operating system, disk, and sense of being the only thing running. Underneath, though, they're all sharing the same processor and memory. It's like a computer with split personalities: in one view it may perceive itself as a Quant, and on the other hand it's decided it's a concert cellist, and on a third it's a sysadmin. Under the hood though, it's still the same body. If a human could handle being split up the way a VM is, we'd all probably get a lot more done! But for computers it's nothing new, and actually it predates today's concept of a computer entirely.

Picture this, mid-1960s: a team at [IBM's Cambridge Scientific Center](https://www.ibm.com/support/pages/zvm/history/50th/vm370ori.pdf) was staring down a really pricey problem: their mainframes cost a fortune, and only one person could really operate one at a time. The answer was a research system called CP-40, then CP-67, then shipped commercially as VM/370 in 1972. It let a single mainframe present itself as a fully independent, isolated logical fraction of itself to each simultaneous user. With this, nobody had to share a terminal queue or overwrite anyone else's files. For the work they were doing, everyone got to believe that they had the whole machine to themselves. And the VMs thought the same! That's the whole deal, and the base idea hasn't really changed since. It's just become smaller scale, more convenient, and in some cases, more paywalled lol.

(A fun one for the curious: here's the actual math for how a VM makes sense. Gerald Popek and Robert Goldberg's 1974 paper, a decade later(!). ["Formal Requirements for Virtualizable Third Generation Architectures"](https://doi.org/10.1145/800009.808061) nailed down the exact condition — every instruction that could break another user's isolation has to be one the processor is willing to intercept and check. Some chip designs turned out to be much easier to virtualize than others, decades before anyone was spinning up or metering VMs by the second.)

## Dude who cares

So aside from the ancient history, in my own day to day usage a VM cashes out as three pretty different-feeling things for me:

- **They make great remote desktops** — a full computer with a screen, reachable from a browser tab, for when I need a GUI that isn't my laptop, or for temporarily sharing some compute to someone else.
- **They also automate my tests and builds!** VMs make up my autoscaling CI runners — they're disposable machines that exists just long enough to run a build or a test suite, then validate my PR, nope out, and disappear forever. I kill computers at scale!!
- **An isolated, virtual sandbox** — a scoped-down machine I don't have to worry about messing up if something goes sideways. Try out some weird OS that came from god knows where, or probe some software that I probably shouldn't be messing with lol. Poke at it for a bit, and then spin the vm down and it's totally gone. Like tears in rain.

Three different vibes, same trick a couple of different ways. It's fun!

## I have made every mistake!

Here's "baby's first VM" story, which taught me how tricky these guys are. Starting with Cyberbuddha from the intro:

As a part of getting my CompTIA certs, I practiced spinning up fresh Windows 11 VMs on my Linux box. Like I mentioned: no network, no obvious reason. Anicca. By the time it worked again I'd been wrong about the root cause approximately six times. But as usually happens, I learned more by messing up than I would have if I'd done it perfectly the first time.

A VM's path to the internet is like a stack of independent layers, and on my machine I had *four* of them lmfao, all quietly editing the same underlying kernel plumbing (Linux's packet-handling framework, [netfilter](https://netfilter.org/projects/nftables/), the shared table everything else writes rules into):

- **libvirt**, the virtualization layer, which puts the VM on a virtual bridge and hands out addresses ([the default NAT network](https://wiki.libvirt.org/Networking.html)).
- **UFW**, the host's [firewall](https://ubuntu.com/server/docs/how-to/security/firewalls/).
- **Docker**, which grafts its own rules in for containers.
- **Tailscale**, my private mesh VPN.

Any one of them can silently drop your traffic on their own, and it was *so fun for me* each time it happened. Dropped packets, no errors, they just literally never showed up! The Best.

The VM couldn't even get a real address at first — that's the APIPA reference from before — but this time it was definitely not on purpose. Here's how that went for me: A host firewall rule was quietly dropping DHCP requests. Fixed that, felt smart! A big mistake against the evil digital monk baby.

What followed was a stack of confident theories, followed by error logs that made me question if I should hang up the patch cables for good and head back to the meditation center by College Station. Eventually, I found an embarrassing pattern: I kept reasoning about a *config file* or some *default I assumed*, instead of checking what the machine was actually doing. A kernel firewall I was sure was the culprit wasn't even running. A ping test that meant nothing because Windows blocks those by default. A DNS server I assumed was slow that answered in zero-point-zero-zero-zero seconds when I actually asked it.

The turn came from a rule that did nothing. I'd written firewall rules for the machine's Wi-Fi interface — obviously correct, I thought, as the return traffic clearly comes back over Wi-Fi — and then checked how many packets they'd matched. Zero 💀. In both directions, even while traffic was actively flowing. I checked to see how far the drive would be to College Station. Oh, that's not too far! Computers suck anyway..

Fast forward: as I've now learned, a rule that matches zero packets is actually good evidence, and I just didn't know what I was looking for. If my Wi-Fi rules were catching nothing, the traffic wasn't using Wi-Fi at all. So, check which road your packets are actually on:

```bash
ip route get 8.8.8.8
```

The answer: the traffic was leaving over `tailscale0`, not Wi-Fi. My machine was acting as a [Tailscale exit node](https://tailscale.com/docs/features/exit-nodes) — volunteering to route other devices' internet traffic through itself, like a reverse VPN — and that silently captured all outbound traffic, VM included. The fix was to stop naming an interface and write rules for the VM's subnet instead, so they hold no matter which road the host's routing picks:

```bash
ufw route allow from 192.168.122.0/24
ufw route allow to   192.168.122.0/24
```

I could've found this in thirty seconds if `ip route get` had been the first thing I ran instead of the last. But I didn't, and I keep relearning this lesson in different ways all the time: the map isn't the territory, the config isn't always the running state, and a dashboard's green light isn't proof. When something is silently broken across layers, go measure the actual path.

## exe.dev wrangles VMs as a service, and inspired me to copy their homework

So, there's that evening^^. And then there's this:

```bash
$ ssh exe.dev new myblog
vm myblog ready in 0.8s
```

That's an example from [exe.dev's own docs](https://exe.dev/vps). A real, isolated, KVM-backed Linux machine, with a valid TLS certificate and key-only SSH already set up, in under a second. None of the hassle, none of the ego-draining errors! I'm awesome again. Their own account of why the thing exists is refreshingly undramatic — the founders were [building a different tool](https://blog.exe.dev/meet-exe.dev) (`sketch.dev`) and "found ourselves needing more machines than ever before... Running it turned out to be the hassle. So we built a platform for making it easy." I mean, yeah.

So, reasonable to ask at this point why the rest of this post needs to exist at all. exe.dev works, so be done with it, right? Well first, I'm insane. But also! I had a score to settle with my network stack, and I was going to untangle it even if I had to go all the way to the bottom.

## What's inside a cloud computer?

The trick that lets exe.dev and other services hand out isolated machines in under a second is a much newer descendant of the same 1960s idea.

Picture this, 2007: Intel and AMD had just added hardware virtualization extensions to their chips, and a small team led by Avi Kivity, at a startup called Qumranet, used them to turn the Linux kernel itself into a hypervisor, a completely open source stack. The project was called KVM, it went straight into the Linux kernel that same year, and the [original paper](https://www.kernel.org/doc/ols/2007/ols2007v1-pages-225-230.pdf) describing it is a genuinely readable account of turning Popek and Goldberg's 1974 condition into something normal people could actually run. It turned out to be the final boss of my networking debacle, and we're cool now.[^1]

[^1]: Fun fact: exe.dev is built by [David Crawshaw and Josh Bleecher Snyder](https://exe.dev/about) — Crawshaw was a co-founder of Tailscale and its CTO from 2019 to 2024, and Snyder was an early Tailscale engineer. Which means the mesh VPN that quietly hijacked my VM's traffic a few paragraphs ago, and the platform that now lets me stop thinking about VM networking at all, were built by overlapping sets of people who have clearly been thinking about routing for a long time. I was really not expecting to find the same folks in both places! I just noticed it while researching, which is more or less how I want all of my citations to work.

## Revving v0

Fast forward again, and I felt the urge for a new project. It turned in a prototype with a very phoned-in name, exe-sandbox-provider. It's a little cli adapter so I can treat exe.dev VMs as disposable sandboxes as easily as running any program locally. A few ideas that became central to my workflow started there: cloning from golden images rather than installing from scratch, minting ephemeral SSH keys that vanish on teardown, setting lease timeouts so dead tasks get reaped automatically, and keeping credentials strictly in the local broker rather than letting them leak into logs or prompts. It built on another in-house piece, another phoned-in name lol -- lufs-runner -- which handled ephemeral GitHub Actions runners on bare metal.

So, the "new project" urge turned into full-blown feature creep very shortly after. I built the prototype to solve one immediate task, and within a week I was asking myself things like "Okay, but what if I stop using exe.dev? Or what if i want to switch to a different provider? Can I be my own provider?" I was already generalizing it into a full harness. Designing an abstraction is almost always more fun than doing the work the abstraction was supposed to unblock. I don't have a cure for that tendency, but I made something sick.

## So here's what I'm building

That generalization turned into lsbx (short for lufs-sandbox, better!!), a unified CLI and backend for managing disposable compute.

The core mechanism relies on golden images — pre-configured base images you clone instantly instead of installing packages every time. In my registry, each image carries a flavor (desktop, agent, or ci-runner) along with a content hash (`lufs-<sha256[:8]>`). When I ask for a sandbox, I get a clone of a verified state, not a fresh operating system and a prayer.

The lifecycle verbs are intentionally minimal: spin up from a golden, execute a command, transfer files, check health, and tear down. Both exe.dev and my local libvirt host implement this exact contract. From the terminal, switching targets is just a parameter:

```bash
# Spin up a local desktop sandbox with a 1-hour lease
lsbx up desktop --lease PT1H --backend libvirt

# Launch a disposable agent sandbox in the cloud
lsbx up agent --lease 1800 --backend exedev

# List active sandboxes or reap expired leases
lsbx list
lsbx reap
```

The CLI doesn't need to know how libvirt configures a bridge or how exe.dev provisions SSH keys; it just talks to the common interface. This is the same [process-registry model](https://blog.daniel-ramirez.io/posts/process-registries-and-workchain/) showing up once again: the real value is having a deterministic procedure to get a working environment, completely separated from whoever is hosting it.

## What a third backend would actually unlock

Configurable backends only matter if there's a real reason to add one, so here's the next one I'm thinking of: a cloud GPU provider. My homelab machine has a decent GPU in it — enough for day-to-day audio-ML work, or gaming lol — but sometimes jobs are bigger than usual! For example, my personal recording library is about 259,000 files across 337 GB, and re-running a full embedding pass across all of it is an overnight job on that local GPU. On a rented H100 or A100, it's closer to an hour.

The honest version of that roadmap isn't "just add Modal (or Lambda, or RunPod) as a backend," though. Those platforms are built around running a *function* or a *container* for the duration of a job, not around handing you a persistent machine with a filesystem you SSH into and leave running — I'm modeling the backend provider as adapters though, so I think I'll figure it out eventually. And modal.com gives users $30/month in free credit just for signing up for me, which gives me the chance to rev.

## How I want to talk to this thing

Two things I care about in any CLI tool I build: it has to be scriptable by something that isn't me, and a human should still be able to sit down and use it comfortably. The scriptable half already has a real shape — every command supports a `--json` flag, and the output contract is fixed no matter which backend answered:

```bash
$ lsbx up agent --lease PT1H --json
{
  "id": "sbx-4f21a",
  "profile": "agent",
  "flavor": "agent",
  "host": "10.20.3.14",
  "lease_expires_at": "2026-08-20T16:30:00Z",
  "verified": true
}

$ lsbx exec sbx-4f21a "python3 --version" --json
{
  "id": "sbx-4f21a",
  "exit_code": 0,
  "stdout": "Python 3.12.4\n",
  "stderr": ""
}

$ lsbx down sbx-4f21a --json
{
  "destroyed": ["sbx-4f21a"],
  "count": 1
}
```

For automated tasks and scripts, every command outputs clean JSON with `--json`. But for quick day-to-day checks, I also wired a little tui in lsbx, which was super fun to design! Running `lsbx` opens a live-refreshing dashboard showing running sandboxes, backend placement, active leases, and memory usage. If a job is finished or an experiment went off the rails, I can inspect guest logs or tear down the instance.

Recently, the abstraction really paid off when it comes to CI. I set up a zero-idle broker with a dual-placement strategy: when a GitHub Actions job queues, my local KVM immediately tries to claim it on local hardware. If it's busy running a build or offline, my cloud instance on exe.dev catches the fallback and handles the run. Same golden image, same test suite, zero manual switching. VMs, wrangled.

## Choosing the silence

My first broken VM never volunteered what was wrong. I had to interrogate the running kernel directly with `ip route get` instead of trusting what I thought my config files were doing. `lsbx` comes from that same mindset: instead of tying a project to a specific cloud vendor or a fragile local setup, define the exact environment contract you need, ask generically for any host that can fulfill it, and let the machinery handle the handoff.

I want my compute infra to behave flexibly like this all the time. Disconnection is genuinely peaceful when you chose it and can trust the boundaries you set, but an accidental `169.254.x.x` address is just a broken bridge. In the end, the silence isn't the problem: it's whether you wanted it or not! In College Station, I wanted it! And when it comes to network, it's the exact same: whether a machine is reachable, isolated, running locally, or scaling into the cloud, it's cause that's how it was configured, and if it fails it'll fail loudly!

Building this much tooling just to abstract away a little infra is kinda insane, but like I said I'm insane. Having a predictable floor to build on makes all the difference!

More soon! 🏃

---

*Sources (verified 2026-08-20):*

- IBM, *The Origin of the VM/370 Time-Sharing System* — https://www.ibm.com/support/pages/zvm/history/50th/vm370ori.pdf
- Popek & Goldberg, *Formal Requirements for Virtualizable Third Generation Architectures* (CACM 1974) — https://doi.org/10.1145/800009.808061
- Kivity et al., *kvm: the Linux Virtual Machine Monitor* (OLS 2007) — https://www.kernel.org/doc/ols/2007/ols2007v1-pages-225-230.pdf
- Netfilter / nftables — https://netfilter.org/projects/nftables/
- Libvirt default NAT networking — https://wiki.libvirt.org/Networking.html
- Ubuntu UFW documentation — https://ubuntu.com/server/docs/how-to/security/firewalls/
- Tailscale exit nodes — https://tailscale.com/docs/features/exit-nodes
- exe.dev VPS documentation — https://exe.dev/vps
- exe.dev founding story — https://blog.exe.dev/meet-exe.dev
- exe.dev about / team — https://exe.dev/about
- Process Registries and Workchain — https://blog.daniel-ramirez.io/posts/process-registries-and-workchain/