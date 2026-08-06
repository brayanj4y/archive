"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Github, Instagram, Linkedin, Music, Film, BookOpen, Coffee, Gamepad2, Tv } from "lucide-react"
import { motion, useScroll } from "framer-motion"

export default function TimelinePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  useEffect(() => {
    // Initialize any scroll animations
    const sections = document.querySelectorAll(".decade-section")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view")
          }
        })
      },
      { threshold: 0.1 },
    )

    sections.forEach((section) => {
      observer.observe(section)
    })

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section)
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white" ref={containerRef}>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-black">
        <motion.div className="h-full bg-white" style={{ scaleX: scrollYProgress, transformOrigin: "0%" }} />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] md:min-h-[80vh] bg-black text-white overflow-hidden">
        {/* Sticker-like elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { text: "WHATEVER", color: "#E56B6F", rotate: "3deg", top: "15%", left: "10%" },
            { text: "AS IF!", color: "#4ECDC4", rotate: "-5deg", top: "25%", left: "75%" },
            { text: "TOTALLY RAD", color: "#FFE66D", rotate: "2deg", top: "65%", left: "15%" },
            { text: "NO CAP", color: "#F72585", rotate: "-3deg", top: "40%", left: "80%" },
            { text: "GROOVY", color: "#E76F51", rotate: "4deg", top: "70%", left: "70%" },
            { text: "BRB", color: "#A8DADC", rotate: "-2deg", top: "20%", left: "40%" },
          ].map((sticker, i) => (
            <motion.div
              key={i}
              className="absolute px-1.5 py-0.5 text-[8px] sm:text-[10px] font-bold border border-black z-10"
              style={{
                backgroundColor: sticker.color,
                transform: `rotate(${sticker.rotate})`,
                top: sticker.top,
                left: sticker.left,
                boxShadow: "0.15rem 0.15rem 0px 0px rgba(0,0,0,0.5)",
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
            >
              {sticker.text}
            </motion.div>
          ))}
        </div>

        {/* Main hero content */}
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative py-10">
          <motion.div
            className="text-center max-w-3xl relative z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-[#E76F51] via-[#FF9F1C] to-[#F72585] blur-lg opacity-50"></div>
              <h1 className="relative text-3xl md:text-5xl font-black tracking-tight transform -rotate-1">
                TEENAGE WASTELAND
              </h1>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-3 border border-white transform rotate-1 mb-4">
              <p className="text-sm md:text-base font-mono">
                A brutally honest chronicle of adolescent evolution from bell-bottoms to TikTok
              </p>
            </div>

            <div className="grid grid-cols-3 gap-1.5 mb-6 max-w-2xl mx-auto">
              <div className="bg-[#E76F51] p-1.5 text-[8px] sm:text-[10px] border border-black transform -rotate-1">
                <p className="font-bold">WARNING:</p>
                <p>Contains extreme nostalgia and embarrassing fashion choices.</p>
              </div>
              <div className="bg-[#4ECDC4] p-1.5 text-[8px] sm:text-[10px] border border-black transform rotate-2">
                <p className="font-bold">SIDE EFFECTS:</p>
                <p>May cause uncontrollable urges to cringe at your former self.</p>
              </div>
              <div className="bg-[#7209B7] p-1.5 text-[8px] sm:text-[10px] border border-black text-white transform -rotate-1">
                <p className="font-bold">DISCLAIMER:</p>
                <p>Every generation thinks they invented cool.</p>
              </div>
            </div>

            <motion.button
              className="group relative bg-white text-black px-4 py-2 text-sm font-bold border border-black transform hover:rotate-0 transition-transform duration-300 rotate-1"
              style={{ boxShadow: "0.25rem 0.25rem 0px 0px rgba(0,0,0,0.7)" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const firstSection = document.querySelector(".decade-section")
                if (firstSection) {
                  firstSection.scrollIntoView({ behavior: "smooth" })
                }
              }}
            >
              EXPLORE OUR TIMELINE
              <motion.div
                className="inline-block ml-2"
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </motion.div>
            </motion.button>
          </motion.div>
        </div>

        {/* Overlapping text for transition to first section */}
        <div className="absolute bottom-0 left-0 right-0 z-30 overflow-hidden pointer-events-none">
          <div className="relative h-16">
            <motion.div
              className="absolute -bottom-2 w-full text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <span className="text-3xl md:text-5xl font-black tracking-tighter text-white opacity-20 uppercase">
                THE TEENAGE ERA
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-black/70 p-2 flex justify-between items-center border-b-2 border-white">
        <div className="text-lg font-bold tracking-tighter flex items-center gap-1">
          <span className="text-pink-500 text-xs sm:text-sm">The Class</span>
          <span className="text-yellow-400 text-xs sm:text-sm">@Year</span>
        </div>
        <div className="text-xs font-mono">A Timeline of Teenagers</div>
      </header>

      {/* Main Content */}
      <main className="relative">
        {/* 70s Section */}
        <section
          className="decade-section min-h-screen md:min-h-[80vh] p-3 md:p-6 bg-[#F4A261] text-[#22223B]"
          style={{ borderRadius: "0px" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto"
          >
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-2xl md:text-4xl font-bold font-serif">
                1970s Teens: <br />
                The Groovy Rebels
              </h2>
              <div className="hidden sm:block rotate-3 bg-[#E76F51] p-1 text-white text-[8px] border border-black">
                PEACE & LOVE
              </div>
            </div>

            <p className="text-xs mb-3 font-mono border-l-2 border-[#E76F51] pl-1">
              We are the peace and love generation your parents warned you about
            </p>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
              <div className="md:col-span-8">
                <p className="text-[10px] sm:text-xs mb-2 leading-tight">
                  The '70s teen was all about peace, love, and side-eyeing the system. They blasted Led Zeppelin and
                  Donna Summer on vinyl, swapped bell-bottoms at thrift stores, and argued about whether disco was
                  "sellout" or soul-saving. School dances smelled like patchouli and rebellion, while basement hangouts
                  buzzed with Dungeons & Dragons sessions and debates about Star Wars.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                  <MiniFeatureCard
                    title="Fashion"
                    content="Tie-dye shirts, platform boots, feathered hair"
                    color="#E76F51"
                    decade="70s"
                  />
                  <MiniFeatureCard
                    title="Tech Flex"
                    content="Cassette tapes, recording songs off the radio"
                    color="#E9C46A"
                    decade="70s"
                  />
                  <MiniFeatureCard
                    title="The Match"
                    content="A mixtape with a joint tucked inside—for midnight drive-ins"
                    color="#2A9D8F"
                    decade="70s"
                  />
                  <MiniFeatureCard
                    title="Music"
                    content="Led Zeppelin, Donna Summer, Pink Floyd"
                    color="#2A9D8F"
                    decade="70s"
                    icon={<Music size={10} />}
                  />
                  <MiniFeatureCard
                    title="Movies"
                    content="Star Wars, Saturday Night Fever, Rocky"
                    color="#E76F51"
                    decade="70s"
                    icon={<Film size={10} />}
                  />
                  <MiniFeatureCard
                    title="Slang"
                    content="Far out, Psyched, Dig it, What a drag"
                    color="#E9C46A"
                    decade="70s"
                    icon={<BookOpen size={10} />}
                  />
                </div>

                <div className="flex gap-1 my-2 overflow-x-auto pb-1 no-scrollbar">
                  {["Vietnam War", "Oil Crisis", "Watergate", "Equal Rights", "Star Wars", "Disco Era"].map((item) => (
                    <span
                      key={item}
                      className="text-[8px] whitespace-nowrap bg-[#22223B] text-white px-1 py-0.5 rounded-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-1 mt-2">
                  <div className="bg-[#E9C46A] p-1 text-[8px] border border-black">
                    <p className="font-bold mb-0.5">Teen Life:</p>
                    <p className="leading-tight">
                      Spent weekends at roller rinks, record stores, and drive-in theaters. Protested the establishment
                      while organizing through zines and landlines.
                    </p>
                  </div>
                  <div className="bg-[#2A9D8F] p-1 text-[8px] border border-black text-white">
                    <p className="font-bold mb-0.5">Bedroom Essentials:</p>
                    <p className="leading-tight">
                      Lava lamps, blacklight posters, record players, and bean bag chairs. Band posters covered every
                      inch of wall space.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative h-40 md:h-auto md:col-span-4">
                <div className="absolute inset-0 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <Image
                    src="/1970s.jpg?height=600&width=400"
                    alt="70s Teens"
                    fill
                    className="object-cover border-2 border-[#E76F51]"
                    style={{ objectPosition: "center top" }}
                  />
                  <div className="absolute bottom-0 right-0 bg-[#E76F51] text-white text-[8px] p-0.5">1970s</div>
                </div>
              </div>
            </div>

            <div className="mt-2 border-t border-dashed border-[#22223B] pt-1">
              <div className="flex justify-between items-center">
                <p className="text-[8px] italic">"Peace, love, and rock 'n' roll was our religion."</p>
                <div className="flex gap-1">
                  {[1970, 1973, 1976, 1979].map((year) => (
                    <span key={year} className="text-[7px] bg-[#E76F51] text-white px-0.5 rotate-2">
                      {year}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 80s Section */}
        <section
          className="decade-section min-h-screen md:min-h-[80vh] p-3 md:p-6 bg-[#FF6B6B] text-[#1A535C]"
          style={{ borderRadius: "10px" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto"
          >
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-2xl md:text-4xl font-bold font-sans">
                1980s Teens: <br />
                The Neon Dreamers
              </h2>
              <div className="hidden sm:block -rotate-3 bg-[#4ECDC4] p-1 text-[#1A535C] text-[8px] border border-black">
                MTV GENERATION
              </div>
            </div>

            <p className="text-xs mb-3 font-mono border-l-2 border-[#4ECDC4] pl-1">
              We invented cool and MTV was our religion
            </p>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
              <div className="md:col-span-4">
                <p className="text-[10px] sm:text-xs mb-2 leading-tight">
                  If the '80s teen had a motto, it'd be "Go big or go home." They teased their hair to heaven, danced
                  like nobody was watching, and worshipped at the altar of MTV. Mixtapes were replaced by Walkmans, and
                  arcades became holy ground for Pac-Man pros.
                </p>

                <div className="grid grid-cols-2 gap-1">
                  <MiniFeatureCard
                    title="Fashion"
                    content="Neon windbreakers, leg warmers, and glitter eyeshadow"
                    color="#4ECDC4"
                    decade="80s"
                  />
                  <MiniFeatureCard
                    title="Music"
                    content="Madonna, Michael Jackson, Duran Duran"
                    color="#FFE66D"
                    decade="80s"
                    icon={<Music size={10} />}
                  />
                  <MiniFeatureCard
                    title="Movies"
                    content="The Breakfast Club, Top Gun, E.T."
                    color="#1A535C"
                    decade="80s"
                    icon={<Film size={10} />}
                  />
                  <MiniFeatureCard
                    title="Gaming"
                    content="Pac-Man, Donkey Kong, Space Invaders"
                    color="#FF6B6B"
                    decade="80s"
                    icon={<Gamepad2 size={10} />}
                  />
                </div>
              </div>

              <div className="relative h-40 md:h-auto md:col-span-4">
                <div className="absolute inset-0 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                  <Image
                    src="/1980s.png?height=600&width=400"
                    alt="80s Teens"
                    fill
                    className="object-cover border-2 border-[#FFE66D]"
                    style={{ objectPosition: "center" }}
                  />
                  <div className="absolute bottom-0 right-0 bg-[#FFE66D] text-[#1A535C] text-[8px] p-0.5">1980s</div>
                </div>
              </div>

              <div className="md:col-span-4">
                <p className="text-[10px] sm:text-xs mb-2 leading-tight">
                  John Hughes movies taught them that detention could be profound. Low-rise jeans reigned supreme,
                  layered with Hollister polos and so much eyeliner. Emo bands like Fall Out Boy and Paramore
                  sound-tracked their LiveJournal entries.
                </p>

                <div className="grid grid-cols-2 gap-1">
                  <MiniFeatureCard
                    title="Tech Flex"
                    content="Walkmans, VHS tapes, early computers"
                    color="#FFE66D"
                    decade="80s"
                  />
                  <MiniFeatureCard
                    title="The Match"
                    content="A Trapper Keeper—stuffed with notes, doodles, and playlists"
                    color="#1A535C"
                    decade="80s"
                  />
                  <MiniFeatureCard
                    title="TV Shows"
                    content="Miami Vice, The A-Team, Cheers"
                    color="#4ECDC4"
                    decade="80s"
                    icon={<Tv size={10} />}
                  />
                  <MiniFeatureCard
                    title="Slang"
                    content="Rad, Gnarly, Gag me with a spoon"
                    color="#FF6B6B"
                    decade="80s"
                    icon={<BookOpen size={10} />}
                  />
                </div>

                <div className="flex gap-1 my-2 overflow-x-auto pb-1 no-scrollbar">
                  {["Cold War", "Wall Street", "Chernobyl", "Berlin Wall", "Challenger", "AIDS Crisis"].map((item) => (
                    <span
                      key={item}
                      className="text-[8px] whitespace-nowrap bg-[#1A535C] text-white px-1 py-0.5 rounded-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-2 border-t border-dashed border-[#1A535C] pt-1">
              <div className="grid grid-cols-3 gap-1">
                <div className="bg-[#4ECDC4] p-1 text-[8px] border border-black rotate-1">
                  <p className="font-bold mb-0.5">Mall Culture:</p>
                  <p className="leading-tight">
                    The mall was teen headquarters. Hanging at food courts, browsing at Sam Goody, and wasting quarters
                    at the arcade.
                  </p>
                </div>
                <div className="bg-[#FFE66D] p-1 text-[8px] border border-black -rotate-1">
                  <p className="font-bold mb-0.5">Bedroom Essentials:</p>
                  <p className="leading-tight">
                    Rubik's Cubes, cassette collections, poster of favorite band or movie star, and a landline phone
                    with extra long cord for privacy.
                  </p>
                </div>
                <div className="bg-[#1A535C] p-1 text-[8px] border border-black text-white rotate-1">
                  <p className="font-bold mb-0.5">Teen Life:</p>
                  <p className="leading-tight">
                    After-school specials, buying singles on vinyl, roller skating rinks, and learning the moonwalk.
                    Identity was shaped by music tribalism.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 90s Section */}
        <section
          className="decade-section min-h-screen md:min-h-[80vh] p-3 md:p-6 bg-[#6D597A] text-[#EAAC8B]"
          style={{ borderRadius: "15px" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto"
          >
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-2xl md:text-4xl font-bold font-sans">
                1990s Teens: <br />
                The Chill (But Angsty) Pioneers
              </h2>
              <div className="hidden sm:block rotate-2 bg-[#E56B6F] p-1 text-white text-[8px] border border-black">
                WHATEVER, MAN
              </div>
            </div>

            <p className="text-xs mb-3 font-mono border-l-2 border-[#E56B6F] pl-1">
              Whatever, we're just hanging at the mall
            </p>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
              <div className="md:col-span-8">
                <p className="text-[10px] sm:text-xs mb-2 leading-tight">
                  The '90s teen was a grunge god in flannel, a Spice Girls stan in platform sneakers, and a Friends
                  quoter all at once. Nirvana's "Smells Like Teen Spirit" was their anthem, but so was TLC's
                  "Waterfalls." They loitered at Blockbuster, argued about Titanic vs. Clueless, and discovered the wild
                  west of AOL chatrooms.
                </p>

                <div className="grid grid-cols-3 gap-1">
                  <MiniFeatureCard
                    title="Fashion"
                    content="Overalls (one strap down!), chokers, and Doc Martens"
                    color="#E56B6F"
                    decade="90s"
                  />
                  <MiniFeatureCard
                    title="Tech Flex"
                    content="Discmans, Tamagotchis, dial-up internet"
                    color="#EAAC8B"
                    decade="90s"
                  />
                  <MiniFeatureCard
                    title="The Match"
                    content="A burned CD-R labeled '~~My FeElInGs~~' with Green Day and Mariah"
                    color="#355070"
                    decade="90s"
                  />
                  <MiniFeatureCard
                    title="Music"
                    content="Nirvana, TLC, Spice Girls, Tupac"
                    color="#E56B6F"
                    decade="90s"
                    icon={<Music size={10} />}
                  />
                  <MiniFeatureCard
                    title="Movies"
                    content="Clueless, Titanic, Scream, The Matrix"
                    color="#EAAC8B"
                    decade="90s"
                    icon={<Film size={10} />}
                  />
                  <MiniFeatureCard
                    title="TV Shows"
                    content="Friends, Fresh Prince, Buffy, Dawson's Creek"
                    color="#355070"
                    decade="90s"
                    icon={<Tv size={10} />}
                  />
                </div>

                <div className="flex gap-1 my-2 overflow-x-auto pb-1 no-scrollbar">
                  {["Grunge", "AOL", "Beepers", "Y2K", "Gulf War", "Boy Bands", "Dial-up", "TGIF"].map((item) => (
                    <span
                      key={item}
                      className="text-[8px] whitespace-nowrap bg-[#355070] text-white px-1 py-0.5 rounded-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-1 mt-2">
                  <div className="bg-[#E56B6F] p-1 text-[8px] border border-black text-white -rotate-1">
                    <p className="font-bold mb-0.5">Teen Life:</p>
                    <p className="leading-tight">
                      Hanging at malls without buying anything, making mixtapes, renting videos from Blockbuster, and
                      waiting for the house phone to be free to call friends.
                    </p>
                  </div>
                  <div className="bg-[#EAAC8B] p-1 text-[8px] border border-black rotate-1">
                    <p className="font-bold mb-0.5">Bedroom Essentials:</p>
                    <p className="leading-tight">
                      Inflatable furniture, lava lamps, CD towers, posters of Leonardo DiCaprio or Jonathan Taylor
                      Thomas, and landline phones with clear plastic casing.
                    </p>
                  </div>
                  <div className="bg-[#355070] p-1 text-[8px] border border-black text-white -rotate-1">
                    <p className="font-bold mb-0.5">Slang:</p>
                    <p className="leading-tight">
                      As if!, Talk to the hand, All that and a bag of chips, Booyah, Not!, That's da bomb, Psyche!,
                      Wassup
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative h-40 md:h-auto md:col-span-4">
                <div className="absolute inset-0 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <Image
                    src="/1990s.webp?height=600&width=400"
                    alt="90s Teens"
                    fill
                    className="object-cover border-2 border-[#E56B6F]"
                    style={{ objectPosition: "center top" }}
                  />
                  <div className="absolute bottom-0 right-0 bg-[#E56B6F] text-white text-[8px] p-0.5">1990s</div>
                </div>
              </div>
            </div>

            <div className="mt-2 border-t border-dashed border-[#EAAC8B] pt-1">
              <div className="flex justify-between items-center">
                <p className="text-[8px] italic text-white">
                  "We watched MTV for the music videos and stayed for the drama on The Real World."
                </p>
                <div className="flex gap-1">
                  {[1990, 1993, 1995, 1999].map((year) => (
                    <span key={year} className="text-[7px] bg-[#E56B6F] text-white px-0.5 -rotate-2">
                      {year}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 2000s Section */}
        <section
          className="decade-section min-h-screen md:min-h-[80vh] p-3 md:p-6 bg-[#457B9D] text-[#F1FAEE]"
          style={{ borderRadius: "20px" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto"
          >
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-2xl md:text-4xl font-bold font-sans">
                2000s Teens: <br />
                The Myspace Mavericks
              </h2>
              <div className="hidden sm:block -rotate-2 bg-[#A8DADC] p-1 text-[#1D3557] text-[8px] border border-black">
                BRB UPDATING MY PROFILE
              </div>
            </div>

            <p className="text-xs mb-3 font-mono border-l-2 border-[#A8DADC] pl-1">
              BRB, customizing my profile with glitter text
            </p>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
              <div className="md:col-span-4">
                <p className="text-[10px] sm:text-xs mb-2 leading-tight">
                  The 2000s teen was chronically online but still down to mall-crawl. They customized Myspace profiles
                  with glitter text, debated Harry Potter ships, and texted in T9 ("NOOB").
                </p>

                <div className="grid grid-cols-2 gap-1">
                  <MiniFeatureCard
                    title="Fashion"
                    content="Von Dutch hats, trucker hats, Uggs with miniskirts"
                    color="#E63946"
                    decade="00s"
                  />
                  <MiniFeatureCard
                    title="Music"
                    content="Eminem, Britney Spears, Linkin Park"
                    color="#A8DADC"
                    decade="00s"
                    icon={<Music size={10} />}
                  />
                  <MiniFeatureCard
                    title="Hangouts"
                    content="Hot Topic, Abercrombie, movie theaters"
                    color="#1D3557"
                    decade="00s"
                    icon={<Coffee size={10} />}
                  />
                  <MiniFeatureCard
                    title="TV"
                    content="The O.C., American Idol, Lizzie McGuire"
                    color="#457B9D"
                    decade="00s"
                    icon={<Tv size={10} />}
                  />
                </div>

                <div className="flex gap-1 my-2 overflow-x-auto pb-1 no-scrollbar">
                  {["9/11", "iPod", "Iraq War", "T9 Texting", "Harry Potter", "Emos"].map((item) => (
                    <span
                      key={item}
                      className="text-[8px] whitespace-nowrap bg-[#1D3557] text-white px-1 py-0.5 rounded-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative h-40 md:h-auto md:col-span-4">
                <div className="absolute inset-0 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                  <Image
                    src="/2000s.webp?height=600&width=400"
                    alt="2000s Teens"
                    fill
                    className="object-cover border-2 border-[#A8DADC]"
                    style={{ objectPosition: "center" }}
                  />
                  <div className="absolute bottom-0 right-0 bg-[#A8DADC] text-[#1D3557] text-[8px] p-0.5">2000s</div>
                </div>
              </div>

              <div className="md:col-span-4">
                <p className="text-[10px] sm:text-xs mb-2 leading-tight">
                  Low-rise jeans reigned supreme, layered with Hollister polos and so much eyeliner. Emo bands like Fall
                  Out Boy and Paramore sound-tracked their LiveJournal entries, while The OC made them wish they lived
                  in a beach mansion.
                </p>

                <div className="grid grid-cols-2 gap-1">
                  <MiniFeatureCard
                    title="Tech Flex"
                    content="Motorola Razrs, iPods, digital cameras"
                    color="#A8DADC"
                    decade="00s"
                  />
                  <MiniFeatureCard
                    title="The Match"
                    content="A Razr phone with Bedazzled skull stickers—for texting 'POS'"
                    color="#1D3557"
                    decade="00s"
                  />
                  <MiniFeatureCard
                    title="Movies"
                    content="Mean Girls, Spider-Man, The Dark Knight"
                    color="#E63946"
                    decade="00s"
                    icon={<Film size={10} />}
                  />
                  <MiniFeatureCard
                    title="Slang"
                    content="OMG, That's hot, Whatever, BRB, TTYL"
                    color="#457B9D"
                    decade="00s"
                    icon={<BookOpen size={10} />}
                  />
                </div>
              </div>
            </div>

            <div className="mt-2 border-t border-dashed border-[#F1FAEE] pt-1">
              <div className="grid grid-cols-3 gap-1">
                <div className="bg-[#E63946] p-1 text-[8px] border border-black text-white rotate-1">
                  <p className="font-bold mb-0.5">Online Life:</p>
                  <p className="leading-tight">
                    Myspace top 8 drama, AIM away messages as cryptic status updates, and taking quiz results too
                    seriously. Customizing profiles with HTML.
                  </p>
                </div>
                <div className="bg-[#A8DADC] p-1 text-[8px] border border-black -rotate-1">
                  <p className="font-bold mb-0.5">Bedroom Essentials:</p>
                  <p className="leading-tight">
                    iPod dock, digital camera, laptop covered in stickers, posters of boy bands or movie heartthrobs,
                    and disco ball lamps.
                  </p>
                </div>
                <div className="bg-[#1D3557] p-1 text-[8px] border border-black text-white -rotate-1">
                  <p className="font-bold mb-0.5">Teen Life:</p>
                  <p className="leading-tight">
                    Downloading music from LimeWire, making sure no one used the phone when you were online, three-way
                    calling, and spending hours picking the perfect AIM screenname.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 2010s Section */}
        <section
          className="decade-section min-h-screen md:min-h-[80vh] p-3 md:p-6 bg-[#2EC4B6] text-[#011627]"
          style={{ borderRadius: "25px" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto"
          >
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-2xl md:text-4xl font-bold font-sans">
                2010s Teens: <br />
                The Selfie Savants
              </h2>
              <div className="hidden sm:block rotate-2 bg-[#FF9F1C] p-1 text-[#011627] text-[8px] border border-black">
                INSTAGRAM AESTHETIC
              </div>
            </div>

            <p className="text-xs mb-3 font-mono border-l-2 border-[#FF9F1C] pl-1">
              Filtered, fabulous, and slightly feral
            </p>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
              <div className="md:col-span-8">
                <p className="text-[10px] sm:text-xs mb-2 leading-tight">
                  The 2010s teen was filtered, fabulous, and slightly feral. They Instagrammed avocado toast, mastered
                  Vine dances, and made "OK boomer" a global burn. VSCO girls hydro-flasked their way through school,
                  while e-girls rocked split-dye hair and chunky sneakers.
                </p>

                <div className="grid grid-cols-4 gap-1">
                  <MiniFeatureCard
                    title="Fashion"
                    content="High-waisted mom jeans, scrunchies, and heavy highlighter"
                    color="#FF9F1C"
                    decade="10s"
                  />
                  <MiniFeatureCard
                    title="Tech Flex"
                    content="FaceTune, Instagram filters, Snapchat streaks"
                    color="#E71D36"
                    decade="10s"
                  />
                  <MiniFeatureCard
                    title="The Match"
                    content="AirPod case covered in stickers—half-peeled, just like their sanity"
                    color="#011627"
                    decade="10s"
                  />
                  <MiniFeatureCard
                    title="Music"
                    content="Drake, Ariana Grande, Twenty One Pilots"
                    color="#2EC4B6"
                    decade="10s"
                    icon={<Music size={10} />}
                  />
                  <MiniFeatureCard
                    title="Movies"
                    content="Hunger Games, Marvel, To All The Boys"
                    color="#FF9F1C"
                    decade="10s"
                    icon={<Film size={10} />}
                  />
                  <MiniFeatureCard
                    title="TV Shows"
                    content="Stranger Things, 13 Reasons Why, Riverdale"
                    color="#E71D36"
                    decade="10s"
                    icon={<Tv size={10} />}
                  />
                  <MiniFeatureCard
                    title="Apps"
                    content="Instagram, Snapchat, Tumblr, Vine"
                    color="#011627"
                    decade="10s"
                    icon={<Coffee size={10} />}
                  />
                  <MiniFeatureCard
                    title="Slang"
                    content="FOMO, Slay, Can't even, Basic, Tea"
                    color="#2EC4B6"
                    decade="10s"
                    icon={<BookOpen size={10} />}
                  />
                </div>

                <div className="flex gap-1 my-2 overflow-x-auto pb-1 no-scrollbar">
                  {[
                    "Vine",
                    "TikTok",
                    "YouTube Stars",
                    "Trump Era",
                    "Social Justice",
                    "Selfie",
                    "Meme Culture",
                    "Stan Twitter",
                  ].map((item) => (
                    <span
                      key={item}
                      className="text-[8px] whitespace-nowrap bg-[#011627] text-white px-1 py-0.5 rounded-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-1 mt-2">
                  <div className="bg-[#FF9F1C] p-1 text-[8px] border border-black rotate-1">
                    <p className="font-bold mb-0.5">Digital Life:</p>
                    <p className="leading-tight">
                      Constructing a perfect Instagram grid, maintaining Snapchat streaks, scrolling endlessly through
                      Tumblr, curating Spotify playlists, and watching YouTube stars.
                    </p>
                  </div>
                  <div className="bg-[#E71D36] p-1 text-[8px] border border-black text-white -rotate-1">
                    <p className="font-bold mb-0.5">Bedroom Essentials:</p>
                    <p className="leading-tight">
                      Fairy lights, Polaroid photos on string, multiple chargers, ring light, LED strips, succulent
                      plants, and inspirational typography prints.
                    </p>
                  </div>
                  <div className="bg-[#011627] p-1 text-[8px] border border-black text-white rotate-1">
                    <p className="font-bold mb-0.5">Activism:</p>
                    <p className="leading-tight">
                      Hashtag activism, LGBTQ+ rights, school shootings, climate strikes. First generation to grow up
                      constantly online and politically engaged.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative h-40 md:h-auto md:col-span-4">
                <div className="absolute inset-0 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <Image
                    src="/2010s.jpg?height=600&width=400"
                    alt="2010s Teens"
                    fill
                    className="object-cover border-2 border-[#FF9F1C]"
                    style={{ objectPosition: "center top" }}
                  />
                  <div className="absolute bottom-0 right-0 bg-[#FF9F1C] text-[#011627] text-[8px] p-0.5">2010s</div>
                </div>
              </div>
            </div>

            <div className="mt-2 border-t border-dashed border-[#011627] pt-1">
              <div className="flex justify-between items-center">
                <p className="text-[8px] italic">
                  "FOMO was real, and everyone's life always looked better online than yours."
                </p>
                <div className="flex gap-1">
                  {[2010, 2014, 2016, 2019].map((year) => (
                    <span key={year} className="text-[7px] bg-[#FF9F1C] text-[#011627] px-0.5 rotate-2">
                      {year}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 2020s Section */}
        <section
          className="decade-section min-h-screen md:min-h-[80vh] p-3 md:p-6 bg-[#7209B7] text-[#F8EDEB]"
          style={{ borderRadius: "30px" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto"
          >
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-2xl md:text-4xl font-bold font-sans">
                2020s Teens: <br />
                The Zoomer Revolutionaries
              </h2>
              <div className="hidden sm:block -rotate-2 bg-[#4CC9F0] p-1 text-[#3A0CA3] text-[8px] border border-black">
                #THEREVOLUTIONWILLBETIKTOKED
              </div>
            </div>

            <p className="text-xs mb-3 font-mono border-l-2 border-[#4CC9F0] pl-1">
              Vibing in a dumpster fire we didn't start but WILL fix
            </p>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
              <div className="md:col-span-4">
                <p className="text-[10px] sm:text-xs mb-2 leading-tight">
                  Gen Z teens are fluent in TikTok dances, meme warfare, and calling out capitalism while thrifting Y2K
                  fits. Climate strikes? Organized via Discord. Mental health? They'll therapize you in a Twitter
                  thread.
                </p>

                <div className="grid grid-cols-2 gap-1">
                  <MiniFeatureCard
                    title="Fashion"
                    content="Cottagecore meets cyberpunk—prairie dresses with chunky shoes"
                    color="#F72585"
                    decade="20s"
                  />
                  <MiniFeatureCard
                    title="Apps"
                    content="TikTok, BeReal, Discord, Roblox"
                    color="#4CC9F0"
                    decade="20s"
                    icon={<Coffee size={10} />}
                  />
                  <MiniFeatureCard
                    title="Issues"
                    content="Climate crisis, COVID, mental health, identity"
                    color="#3A0CA3"
                    decade="20s"
                    icon={<BookOpen size={10} />}
                  />
                  <MiniFeatureCard
                    title="Music"
                    content="Billie Eilish, Olivia Rodrigo, Bad Bunny"
                    color="#7209B7"
                    decade="20s"
                    icon={<Music size={10} />}
                  />
                </div>

                <div className="flex gap-1 my-2 overflow-x-auto pb-1 no-scrollbar">
                  {["COVID", "Remote School", "Climate Crisis", "BeReal", "Cancel Culture", "TikTok"].map((item) => (
                    <span
                      key={item}
                      className="text-[8px] whitespace-nowrap bg-[#3A0CA3] text-white px-1 py-0.5 rounded-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative h-40 md:h-auto md:col-span-4">
                <div className="absolute inset-0 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                  <Image
                    src="/2020s.jpeg.jpg?height=600&width=400"
                    alt="2020s Teens"
                    fill
                    className="object-cover border-2 border-[#4CC9F0]"
                    style={{ objectPosition: "center" }}
                  />
                  <div className="absolute bottom-0 right-0 bg-[#4CC9F0] text-[#3A0CA3] text-[8px] p-0.5">2020s</div>
                </div>
              </div>

              <div className="md:col-span-4">
                <p className="text-[10px] sm:text-xs mb-2 leading-tight">
                  They survived remote school (thanks, COVID), made "quiet quitting" a vibe, and stan Billie Eilish for
                  keeping it real. Their humor is drier than the Sahara ("💀"), but their activism? Fire emoji.
                </p>

                <div className="grid grid-cols-2 gap-1">
                  <MiniFeatureCard
                    title="Tech Flex"
                    content="Editing CapCut transitions like Scorsese, AI tools mastery"
                    color="#4CC9F0"
                    decade="20s"
                  />
                  <MiniFeatureCard
                    title="The Match"
                    content="Viral TikTok draft - half climate rant, half Skibidi meme"
                    color="#3A0CA3"
                    decade="20s"
                  />
                  <MiniFeatureCard
                    title="TV/Stream"
                    content="Euphoria, Outer Banks, Wednesday, Squid Game"
                    color="#F72585"
                    decade="20s"
                    icon={<Tv size={10} />}
                  />
                  <MiniFeatureCard
                    title="Slang"
                    content="Bussin, No cap, Unhinged, Rizz, Core"
                    color="#7209B7"
                    decade="20s"
                    icon={<BookOpen size={10} />}
                  />
                </div>
              </div>
            </div>

            <div className="mt-2 border-t border-dashed border-[#F8EDEB] pt-1">
              <div className="grid grid-cols-3 gap-1">
                <div className="bg-[#F72585] p-1 text-[8px] border border-black text-white -rotate-1">
                  <p className="font-bold mb-0.5">Digital Life:</p>
                  <p className="leading-tight">
                    Main characters on TikTok, multiple alt accounts, online activism, content creation, parasocial
                    relationships with influencers, and navigating all-digital schooling.
                  </p>
                </div>
                <div className="bg-[#4CC9F0] p-1 text-[8px] border border-black rotate-1">
                  <p className="font-bold mb-0.5">Bedroom Essentials:</p>
                  <p className="leading-tight">
                    LED strip lights, phone tripods, mechanical keyboards, Y2K vintage pieces, smart speakers, and
                    houseplants they learned to care for on TikTok.
                  </p>
                </div>
                <div className="bg-[#3A0CA3] p-1 text-[8px] border border-black text-white -rotate-1">
                  <p className="font-bold mb-0.5">Identity:</p>
                  <p className="leading-tight">
                    Most diverse and fluid generation in terms of gender and sexuality. Mental health discussions
                    normalized. Openly neurodivergent. Online and offline personas blurred.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* End Quote Section */}
        <section className="decade-section min-h-[30vh] p-3 md:p-6 bg-black text-white flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="max-w-5xl mx-auto text-center"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 blur-xl opacity-50"></div>
              <h2 className="relative text-3xl md:text-5xl font-black p-4 md:p-8 border-4 border-white transform rotate-1 hover:rotate-0 transition-transform duration-500">
                END OF ERA
                <br />
                BUT NEVER
                <br />
                FORGOTTEN
              </h2>
              <div className="absolute -bottom-2 -right-2 text-[8px] bg-white text-black p-0.5 rotate-3">
                GENERATIONS DEFINED BY THEIR TECH, UNITED BY THEIR TEENAGE ANGST
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white p-3 border-t-2 border-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-xs mb-2 md:mb-0">Built by BrayanJay</div>
          <div className="flex space-x-3">
            <Link href="https://github.com/brayanj4y" className="hover:text-pink-500 transition-colors">
              <Github size={14} />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link href="https://instagram.com/brayanj4y" className="hover:text-pink-500 transition-colors">
              <Instagram size={14} />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="https://linkedin.com/in/brayan-j4y" className="hover:text-pink-500 transition-colors">
              <Linkedin size={14} />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
        <div className="text-center text-[8px] mt-2 text-gray-400">© 2025 BrayanJay All Rights Reserved</div>
      </footer>
    </div>
  )
}

interface MiniFeatureCardProps {
  title: string
  content: string
  color: string
  decade: string
  icon?: React.ReactNode
}

function MiniFeatureCard({ title, content, color, decade, icon }: MiniFeatureCardProps) {
  const borderRadius = {
    "70s": "0px",
    "80s": "10px",
    "90s": "15px",
    "00s": "20px",
    "10s": "25px",
    "20s": "30px",
  }[decade]

  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        rotate: Math.random() * 2 - 1,
        zIndex: 10,
      }}
      className="p-1.5 text-white"
      style={{
        backgroundColor: color,
        borderRadius,
        transform: `rotate(${Math.random() * 2 - 1}deg)`,
        boxShadow: "0.25rem 0.25rem 0px 0px rgba(0,0,0,0.3)",
      }}
    >
      <div className="flex items-center gap-1 mb-0.5">
        {icon && <div>{icon}</div>}
        <h3 className="text-[10px] font-bold">{title}</h3>
      </div>
      <p className="text-[8px] leading-tight">{content}</p>
    </motion.div>
  )
}
