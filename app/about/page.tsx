import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20">
            <LotusLogo />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-green-800 mb-4">About LOTUS</h1>
        <p className="text-xl text-green-600 max-w-3xl mx-auto leading-relaxed">
          A digital sanctuary where poetry blooms and creative souls connect. Just as a lotus rises from muddy waters to
          bloom in pristine beauty, we believe every poet's journey deserves a platform to flourish.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-white/70 backdrop-blur-sm border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-green-800 flex items-center space-x-2">
              <Target className="w-6 h-6" />
              <span>Our Mission</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700 leading-relaxed">
              To create a nurturing digital space where poets can share their authentic voices, connect with like-minded
              individuals, and contribute to the rich tapestry of human expression. We strive to make poetry accessible,
              celebrated, and cherished by all.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-green-800 flex items-center space-x-2">
              <Eye className="w-6 h-6" />
              <span>Our Vision</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700 leading-relaxed">
              To become the world's most beloved poetry community, where every verse matters and every poet finds their
              audience. We envision a future where poetry thrives in the digital age, bridging cultures and inspiring
              generations.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <Card className="bg-white/70 backdrop-blur-sm border-green-200 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-green-800">Our Growing Community</CardTitle>
          <p className="text-green-600">Numbers that reflect our vibrant poetry ecosystem</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-800 mb-1">{stat.value}</div>
                <div className="text-green-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Our Values */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-green-800 mb-4">Our Core Values</h2>
          <p className="text-green-600 text-lg max-w-2xl mx-auto">
            The principles that guide everything we do at LOTUS
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((value, index) => (
            <Card
              key={index}
              className="bg-white/70 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <value.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">{value.title}</h3>
                    <p className="text-green-700">{value.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <Card className="bg-white/70 backdrop-blur-sm border-green-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-green-800">Our Story</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-green max-w-none">
          <p className="text-green-700 leading-relaxed mb-4">
            LOTUS was born from a simple observation: in our fast-paced digital world, poetry needed a dedicated space
            to breathe, grow, and connect people. Founded in 2024 by a group of poetry enthusiasts and technology
            advocates, we set out to create more than just another publishing platform.
          </p>
          <p className="text-green-700 leading-relaxed mb-4">
            We wanted to build a community where the ancient art of poetry could flourish in the modern age. Like the
            lotus flower that inspired our name, we believe beautiful art can emerge from any circumstance, and every
            poet deserves a chance to share their unique perspective with the world.
          </p>
          <p className="text-green-700 leading-relaxed">
            Today, LOTUS continues to grow as a platform where established poets mentor newcomers, where diverse voices
            are celebrated, and where the timeless power of poetry brings people together across geographical and
            cultural boundaries.
          </p>
        </CardContent>
      </Card>

      {/* Features */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-green-800 mb-4">What Makes LOTUS Special</h2>
          <p className="text-green-600 text-lg max-w-2xl mx-auto">
            Features designed with poets and poetry lovers in mind
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-green-200 text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Curated Collections</h3>
              <p className="text-green-700">Discover poems organized by themes, styles, and moods</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-green-200 text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Supportive Community</h3>
              <p className="text-green-700">Connect with fellow poets and receive constructive feedback</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-green-200 text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Recognition Platform</h3>
              <p className="text-green-700">Get featured and build your reputation as a poet</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Poetry Community</h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Whether you're a seasoned poet or just beginning your creative journey, LOTUS welcomes you. Share your
            voice, discover new perspectives, and be part of a community that celebrates the beauty of words.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-green-700 hover:bg-green-50">
              <Link href="/register">Start Writing Today</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-green-700"
            >
              <Link href="/poems">Explore Poems</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
