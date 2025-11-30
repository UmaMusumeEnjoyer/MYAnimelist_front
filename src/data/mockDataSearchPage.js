// src/data/mockData.js
export const animeList = [
  {
    id: 1,
    title_romaji: "Jujutsu Kaisen",
    cover_image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-bbBWj4pEFseh.jpg",
    episode_progress: 18,
    episodes: 24,
    status: "Watching"
  },
  {
    id: 2,
    title_romaji: "Attack on Titan",
    cover_image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-m5ZMNtFioc7j.jpg",
    episode_progress: 75,
    episodes: 75,
    status: "Completed"
  },
  {
    id: 3,
    title_romaji: "Demon Slayer: Kimetsu no Yaiba",
    cover_image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-PEn1sx5HFncT.jpg",
    episode_progress: 26,
    episodes: 26,
    status: "Completed"
  },
  {
    id: 4,
    title_romaji: "My Hero Academia",
    cover_image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21459-oCA1n3d497cZ.jpg",
    next_airing_ep: { episode: 148, timeUntilAiring: 10000 },
    status: "Watching"
  },
  {
    id: 5,
    title_romaji: "Hunter x Hunter (2011)",
    cover_image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx11061-sIpBprNRfzCe.png",
    episode_progress: 0,
    episodes: 148,
    status: "Plan to Watch"
  },
    {
    id: 6,
    title_romaji: "Naruto Shippuden",
    cover_image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1735-4318t9c9a6p7.jpg",
    episode_progress: 500,
    episodes: 500,
    status: "Completed"
  },
];

export const collaborators = {
  owner: { name: "John Doe", handle: "@johndoe", avatar: "https://i.pravatar.cc/150?u=1" },
  editors: [
    { name: "Jane Smith", handle: "@janesmith", avatar: "https://i.pravatar.cc/150?u=2" },
    { name: "Mike Johnson", handle: "@mikej", avatar: "https://i.pravatar.cc/150?u=3" }
  ],
  viewers: [
    { name: "Emily White", handle: "@emilyw", avatar: "https://i.pravatar.cc/150?u=4" },
    { name: "Chris Green", handle: "@chrisg", avatar: "https://i.pravatar.cc/150?u=5" }
  ]
};