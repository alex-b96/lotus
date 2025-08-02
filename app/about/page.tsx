import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-theme-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light mb-4 sm:mb-6 text-theme-primary">Despre Lotus</h1>
        </div>

        <div className="prose prose-lg max-w-none">
          {/* Main content in cards */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-pink-300/30 hover:bg-white/10 transition-all duration-300 mb-4 sm:mb-6">
            <div className="p-4 sm:p-8">
              <p className="leading-relaxed mb-4 sm:mb-6 font-light text-theme-secondary text-base sm:text-lg">
                Lotus s-a născut din dragoste pentru poezie și din credința că fiecare voce merită un loc în care să fie auzită și celebrată. Nu suntem doar un site, ci un un spațiu calm unde cuvintele pot respira, pot prinde rădăcini și, în cele din urmă, pot înflori.
              </p>
              <p className="leading-relaxed font-light text-theme-secondary text-base sm:text-lg">
                Misiunea noastră este simplă: să creăm o punte între autor și cititor, să cultivăm un mediu unde sensibilitatea și curajul de a te exprima sunt prețuite mai presus de orice.
              </p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-pink-300/30 hover:bg-white/10 transition-all duration-300 mb-4 sm:mb-6">
            <div className="p-4 sm:p-6 border-b border-white/10">
              <h2 className="text-xl sm:text-2xl font-light text-theme-primary">O Scenă Deschisă pentru Sufletul Tău</h2>
            </div>
            <div className="p-4 sm:p-8">
              <p className="leading-relaxed mb-4 sm:mb-6 font-light text-theme-secondary text-base sm:text-lg">
                Credem cu tărie în puterea creatoare care se află în fiecare dintre noi. De aceea, Lotus este o platformă deschisă oricui dorește să își împărtășească creațiile. Indiferent dacă ești un poet consacrat sau dacă abia acum așterni pe hârtie primele tale versuri, aici este locul tău.
              </p>
              <p className="leading-relaxed font-light text-theme-secondary text-base sm:text-lg">
                Pentru a menține coerența și calitatea estetică a acestui spațiu, echipa noastră citește cu atenție fiecare poem primit. Toate creațiile trec printr-un filtru editorial înainte de a ajunge pe site. Acest pas ne ajută să ne asigurăm că fiecare text publicat contribuie la armonia și valoarea întregii colecții, oferind cititorilor o experiență de lectură excepțională.
              </p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-pink-300/30 hover:bg-white/10 transition-all duration-300 mb-4 sm:mb-6">
            <div className="p-4 sm:p-6 border-b border-white/10">
              <h2 className="text-xl sm:text-2xl font-light text-theme-primary">Recunoaștere și Inspirație: Poemul Lunii și Poemul Anului</h2>
            </div>
            <div className="p-4 sm:p-8">
              <p className="leading-relaxed mb-4 sm:mb-6 font-light text-theme-secondary text-base sm:text-lg">
                Pentru a încuraja și a recompensa talentul din comunitatea noastră, am creat un sistem de recunoaștere a celor mai remarcabile creații.
              </p>
              <p className="leading-relaxed mb-4 sm:mb-6 font-light text-theme-secondary text-base sm:text-lg">
                <strong className="text-theme-accent">Poemul Lunii:</strong> La finalul fiecărei luni, echipa noastră, alături de votul cititorilor, va selecta un poem excepțional dintre toate lucrările publicate. Autorul acestuia va fi desemnat câștigătorul titlului "Poemul Lunii", va fi premiat cu suma de 200 RON și va beneficia de o promovare specială pe platforma noastră.
              </p>
              <p className="leading-relaxed font-light text-theme-secondary text-base sm:text-lg">
                <strong className="text-theme-accent">Poemul Anului:</strong> La finalul unui an calendaristic, miza devine și mai mare. Cele 12 poeme câștigătoare ale lunii vor intra automat în competiția finală pentru cel mai înalt titlu: "Poemul Anului". Marele câștigător, ales printr-un proces similar de jurizare și vot al comunității, va fi recompensat cu un premiu de 400 RON și va fi celebrat ca vocea reprezentativă a comunității Lotus pentru acel an.
              </p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-pink-300/30 hover:bg-white/10 transition-all duration-300 mb-4 sm:mb-6">
            <div className="p-4 sm:p-6 border-b border-white/10">
              <h2 className="text-xl sm:text-2xl font-light text-theme-primary">Cum poți participa?</h2>
            </div>
            <div className="p-4 sm:p-8">
              <p className="leading-relaxed mb-4 sm:mb-6 font-light text-theme-secondary text-base sm:text-lg">
                Este simplu. Trimite-ne creațiile tale folosind formularul de pe pagina noastră de <Link href="/submit" className="text-theme-accent hover:text-[rgb(var(--theme-accent-light))] transition-colors">Trimite un poem</Link>. Te rugăm să incluzi numele sau pseudonimul sub care dorești să publici.
              </p>
              <p className="leading-relaxed font-light text-theme-secondary text-base sm:text-lg">
                Lotus este mai mult decât un concurs; este o comunitate unită de emoție, artă și respect reciproc. Așteptăm cu nerăbdare să citim povestea ta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}