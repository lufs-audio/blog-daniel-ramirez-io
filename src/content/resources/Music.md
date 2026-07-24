---
title: Music
date: 2025-06-23
draft: false
---

I try to listen to new music every day, and I keep a [spreadsheet](https://docs.google.com/spreadsheets/d/1p8zTsGuQVV81tvuZswIHq-pIXCyZn9ixhg-2HWD9X10/edit?gid=0#gid=0) of all the albums I wanna listen to. Each day my computer generates a little website that shows what I'm currently listening to, plus what I've recently added and finished. You can check it out and see what albums are on my radar any given day.

<iframe src="https://www.albumdujour.lufs.audio" width="100%" height="600" frameborder="0" style="border: 1px solid #ccc; border-radius: 8px;"></iframe>

The whole thing runs itself, so day to day I just add music to my library in Apple Music, see what album comes up in my daily notes, and mark it as done after I listen. I've been listening to way more music this way! The website updates automatically and includes embedded players so you can listen along if something catches your eye.

## How It Works

The setup goes like this: I have a Google Sheet that tracks everything, and a Python script that reads from it to build a clean website. When I add albums to Apple Music, they get added to the spreadsheet. The script pulls all that data, categorizes it into "currently listening," "recently added," and "recently finished," then generates a site with Spotify and Apple Music embeds.

The site rebuilds itself every day and deploys automatically, so it's always current. If you see an album on there that looks interesting, you can listen right from the embedded players or click through to the full albums on either platform.

## For The Homies

I try not to rate the music out of 5 stars or anything like that, cause for me the point is just to listen. While I'm listening in Apple Music, I'll mark songs I like as Favorites, and if more songs end up on my Favorites off the album than not, then I mark the whole album as a Favorite and put a little "🌞" in Google Sheets.

The whole thing has turned into a nice way to share music discoveries. If you're into finding new stuff or just curious what I'm listening to on any given day, feel free to check back whenever!