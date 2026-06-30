import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Music | Jonny Allum — Record Producer",
  description:
    "Jonny Allum, record producer and artist. New music streaming now on Spotify and YouTube, with Apple Music and more rolling out. Press play.",
  alternates: { canonical: "https://jonnyai.co.uk/music" },
  openGraph: {
    title: "Music | Jonny Allum — Record Producer",
    description:
      "New music from Jonny Allum — streaming now on Spotify and YouTube. Cinematic, electronic-leaning productions.",
    url: "https://jonnyai.co.uk/music",
    siteName: "JonnyAI",
    type: "profile",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: "Jonny Allum",
  genre: ["Electronic", "Cinematic"],
  url: "https://jonnyai.co.uk/music",
  image: "https://jonnyai.co.uk/jonny-profile.png",
  description:
    "Record producer and artist. Cinematic, electronic-leaning productions, streaming now on Spotify and YouTube.",
  sameAs: [
    "https://open.spotify.com/artist/4quVqVgSehgn2qcUalDF4S",
    "https://www.youtube.com/@jonny-allum",
  ],
};

export default function MusicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
