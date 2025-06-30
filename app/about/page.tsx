import { Button } from "@/components/ui/button"
import { Heart, Users, BookOpen, Award, Target, Eye, Lightbulb } from "lucide-react"
import Link from "next/link"
import { LotusLogo } from "@/components/lotus-logo"

export default function AboutPage() {
  const stats = [
    { icon: Users, label: "Active Poets", value: "500+" },
    { icon: BookOpen, label: "Published Poems", value: "2,000+" },
    { icon: Heart, label: "Community Likes", value: "15,000+" },
    { icon: Award, label: "Featured Authors", value: "50+" },
  ]

  const values = [
    {
      icon: Heart,
      title: "Passion for Poetry",
      description:
        "We believe poetry is a powerful form of human expression that connects hearts and minds across cultures and generations.",
    },
    {
      icon: Users,
      title: "Inclusive Community",
      description:
        "Our platform welcomes poets of all backgrounds, experience levels, and styles. Everyone has a voice worth hearing.",
    },
    {
      icon: Lightbulb,
      title: "Creative Growth",
      description:
        "We foster an environment where poets can experiment, learn, and grow through constructive feedback and inspiration.",
    },
    {
      icon: Target,
      title: "Quality Content",
      description:
        "We maintain high standards for published content while supporting emerging voices in their creative journey.",
    },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d0d0d' }}>
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-12">
        {/* Hero Section */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20">
              <LotusLogo />
            </div>
          </div>
          <h1 className="text-5xl lg:text-6xl font-light mb-6" style={{ color: '#e2e2e2' }}>About LOTUS</h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed font-light" style={{ color: '#9b9b9b' }}>
            A digital sanctuary where poetry blooms and creative souls connect. Just as a lotus rises from muddy waters to
            bloom in pristine beauty, we believe every poet's journey deserves a platform to flourish.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-pink-300/30 hover:bg-white/10 transition-all duration-300">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-2xl font-light flex items-center space-x-2" style={{ color: '#e2e2e2' }}>
                <Target className="w-6 h-6 text-pink-300" />
                <span>Our Mission</span>
              </h3>
            </div>
            <div className="p-6">
              <p className="leading-relaxed font-light" style={{ color: '#9b9b9b' }}>
                To create a nurturing digital space where poets can share their authentic voices, connect with like-minded
                individuals, and contribute to the rich tapestry of human expression. We strive to make poetry accessible,
                celebrated, and cherished by all.
              </p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-pink-300/30 hover:bg-white/10 transition-all duration-300">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-2xl font-light flex items-center space-x-2" style={{ color: '#e2e2e2' }}>
                <Eye className="w-6 h-6 text-pink-300" />
                <span>Our Vision</span>
              </h3>
            </div>
            <div className="p-6">
              <p className="leading-relaxed font-light" style={{ color: '#9b9b9b' }}>
                To become the world's most beloved poetry community, where every verse matters and every poet finds their
                audience. We envision a future where poetry thrives in the digital age, bridging cultures and inspiring
                generations.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-pink-300/30 hover:bg-white/10 transition-all duration-300">
          <div className="p-6 border-b border-white/10 text-center">
            <h3 className="text-2xl font-light" style={{ color: '#e2e2e2' }}>Our Growing Community</h3>
            <p className="font-light" style={{ color: '#9b9b9b' }}>Numbers that reflect our vibrant poetry ecosystem</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-pink-300/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-8 h-8 text-pink-300" />
                  </div>
                  <div className="text-2xl font-light mb-1" style={{ color: '#e2e2e2' }}>{stat.value}</div>
                  <div className="text-sm font-light" style={{ color: '#9b9b9b' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Our Values */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-light mb-4" style={{ color: '#e2e2e2' }}>Our Core Values</h2>
            <p className="text-lg max-w-2xl mx-auto font-light" style={{ color: '#9b9b9b' }}>
              The principles that guide everything we do at LOTUS
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-pink-300/30 hover:bg-white/10 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-pink-300/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <value.icon className="w-6 h-6 text-pink-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-light mb-2" style={{ color: '#e2e2e2' }}>{value.title}</h3>
                      <p className="font-light" style={{ color: '#9b9b9b' }}>{value.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Our Story */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-pink-300/30 hover:bg-white/10 transition-all duration-300">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-2xl font-light" style={{ color: '#e2e2e2' }}>Our Story</h3>
          </div>
          <div className="p-6 prose max-w-none">
            <p className="leading-relaxed mb-4 font-light" style={{ color: '#9b9b9b' }}>
              LOTUS was born from a simple observation: in our fast-paced digital world, poetry needed a dedicated space
              to breathe, grow, and connect people. Founded in 2024 by a group of poetry enthusiasts and technology
              advocates, we set out to create more than just another publishing platform.
            </p>
            <p className="leading-relaxed mb-4 font-light" style={{ color: '#9b9b9b' }}>
              We wanted to build a community where the ancient art of poetry could flourish in the modern age. Like the
              lotus flower that inspired our name, we believe beautiful art can emerge from any circumstance, and every
              poet deserves a chance to share their unique perspective with the world.
            </p>
            <p className="leading-relaxed font-light" style={{ color: '#9b9b9b' }}>
              Today, LOTUS continues to grow as a platform where established poets mentor newcomers, where diverse voices
              are celebrated, and where the timeless power of poetry brings people together across geographical and
              cultural boundaries.
            </p>
          </div>
        </div>

        {/* Features */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-light mb-4" style={{ color: '#e2e2e2' }}>What Makes LOTUS Special</h2>
            <p className="text-lg max-w-2xl mx-auto font-light" style={{ color: '#9b9b9b' }}>
              Features designed with poets and poetry lovers in mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-pink-300/30 hover:bg-white/10 transition-all duration-300 text-center">
              <div className="p-6">
                <div className="w-16 h-16 bg-pink-300/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-pink-300" />
                </div>
                <h3 className="text-lg font-light mb-2" style={{ color: '#e2e2e2' }}>Curated Collections</h3>
                <p className="font-light" style={{ color: '#9b9b9b' }}>Discover poems organized by themes, styles, and moods</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-pink-300/30 hover:bg-white/10 transition-all duration-300 text-center">
              <div className="p-6">
                <div className="w-16 h-16 bg-pink-300/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-pink-300" />
                </div>
                <h3 className="text-lg font-light mb-2" style={{ color: '#e2e2e2' }}>Supportive Community</h3>
                <p className="font-light" style={{ color: '#9b9b9b' }}>Connect with fellow poets and receive constructive feedback</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-pink-300/30 hover:bg-white/10 transition-all duration-300 text-center">
              <div className="p-6">
                <div className="w-16 h-16 bg-pink-300/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-pink-300" />
                </div>
                <h3 className="text-lg font-light mb-2" style={{ color: '#e2e2e2' }}>Recognition Platform</h3>
                <p className="font-light" style={{ color: '#9b9b9b' }}>Get featured and build your reputation as a poet</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-pink-900/30 to-pink-800/30 backdrop-blur-sm rounded-xl border border-pink-300/30 shadow-lg">
          <div className="p-8 text-center">
            <h2 className="text-2xl font-light mb-4" style={{ color: '#e2e2e2' }}>Join Our Poetry Community</h2>
            <p className="mb-6 max-w-2xl mx-auto font-light" style={{ color: '#9b9b9b' }}>
              Whether you're a seasoned poet or just beginning your creative journey, LOTUS welcomes you. Share your
              voice, discover new perspectives, and be part of a community that celebrates the beauty of words.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-pink-300/20 border border-pink-300/40 text-white hover:bg-pink-300/30 hover:border-pink-300/60 transition-all font-light">
                <Link href="/register">Start Writing Today</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-white/30 text-white hover:bg-white/10 font-light"
              >
                <Link href="/poems">Explore Poems</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}