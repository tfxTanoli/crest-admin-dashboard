export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] }

export interface Article {
  id: string
  title: string
  subtitle?: string
  image?: string
  imageAlt?: string
  order: number
  content: ContentBlock[]
}

export const staticArticles: Article[] = [
  {
    id: 'static-1',
    order: 1,
    title: 'How a Theological Discovery Became a Human Performance Instrument',
    subtitle:
      'CrestApp, a structured journey that reveals your True Self, strengthens your inner life, and issues your symbolic Crest as used in ancient times amongst nobility.',
    image: '/Personal_Image_1.jpg',
    imageAlt: 'Author portrait',
    content: [
      {
        type: 'paragraph',
        text: 'Over the past few months, many of you have followed the progress of my two new theological manuscripts on initiation, cosmology, and the deep structure of spiritual maturity. One of them has just been strengthened through a rigorous external critique that sharpened the theory and expanded the contemporary scholarship behind it.',
      },
      {
        type: 'paragraph',
        text: "But here's the part I'm most excited about: these ideas are no longer staying on paper. They're becoming something you can experience.",
      },
      {
        type: 'paragraph',
        text: 'And the funny thing is, I never set out to create an instrument.',
      },
      {
        type: 'paragraph',
        text: "Somewhere along the line, I realised my research had uncovered something so theologically deep that I couldn't simply leave it in manuscript form. I had to offer people a way to complete the missing phase of the spiritual lives they've already embarked upon: regardless of their tradition. It still amazes me. It feels like diving into the ocean and coming up with a whale instead of being swallowed by one.",
      },
      {
        type: 'paragraph',
        text: 'That realisation changed everything.',
      },
      {
        type: 'paragraph',
        text: "I've been quietly building a tool that translates the research: the four stages of transformation, the identity architecture, the reintegration arc: into a guided, six-week journey designed for everyone.",
      },
      {
        type: 'paragraph',
        text: "It's called CrestApp, and it will be launching in the coming days.",
      },
      {
        type: 'paragraph',
        text: 'CrestApp takes the core insights from the manuscripts and turns them into a personal transformation pathway:',
      },
      {
        type: 'list',
        items: [
          'A map of your True Self',
          'A Shadow Map that reveals what holds you back',
          'A Fruit Map that shows your strengths',
          'And finally, a Crest, a symbolic identity marking your reintegration, much like the family crests once reserved for the nobility of ancient Africa, Asia, and Great Britain',
        ],
      },
      {
        type: 'paragraph',
        text: 'CrestApp is a practical tool: an instrument: for anyone seeking clarity, grounding, and a renewed sense of who they are becoming. For everyone who has asked, "How does this research help me?": this is the answer you can now experience directly.',
      },
      {
        type: 'paragraph',
        text: 'Thank you again for walking with me on this journey.',
      },
    ],
  },
  {
    id: 'static-2',
    order: 2,
    title: 'The Identity Crisis in Modern Life: And Why We Need Better Instruments',
    image: '/Personal_Image_2.jpg',
    imageAlt: 'Author portrait',
    content: [
      {
        type: 'paragraph',
        text: "Something is happening quietly across our workplaces, churches, universities, and communities. It's not loud or dramatic, but it is unmistakable: people are losing their sense of who they are.",
      },
      {
        type: 'paragraph',
        text: 'Not their job titles. Not their strengths. Not their personality labels. Their identity: the inner coherence that tells a person, "This is who I am, and this is who I am becoming."',
      },
      {
        type: 'paragraph',
        text: 'And the truth is simple: the modern world is not built to support that kind of clarity.',
      },
      {
        type: 'heading',
        text: 'The Modern Identity Breakdown',
      },
      {
        type: 'paragraph',
        text: 'Everywhere I look, the same patterns keep appearing:',
      },
      {
        type: 'list',
        items: [
          'Professionals feel overwhelmed and unanchored',
          'Leaders feel internally divided',
          'Teams feel disconnected',
          'Young adults feel directionless',
          'Communities feel spiritually thin',
        ],
      },
      {
        type: 'paragraph',
        text: "This isn't because people lack information. It's because they lack integration.",
      },
      {
        type: 'paragraph',
        text: 'We have more content than ever, yet less clarity. More assessments than ever, yet less identity. More self-help than ever, yet less transformation.',
      },
      {
        type: 'paragraph',
        text: 'The modern world gives us data, but not direction. Labels, but not identity. Insights, but not reintegration.',
      },
      {
        type: 'paragraph',
        text: 'This is the heart of the crisis.',
      },
      {
        type: 'heading',
        text: "Why Today's Tools Aren't Enough",
      },
      {
        type: 'paragraph',
        text: 'Most popular tools: personality tests, leadership assessments, coaching frameworks: do one thing well: they describe you.',
      },
      {
        type: 'paragraph',
        text: 'But they rarely help you become you.',
      },
      {
        type: 'paragraph',
        text: 'They tell you:',
      },
      {
        type: 'list',
        items: ['Your tendencies', 'Your preferences', 'Your strengths', 'Your blind spots'],
      },
      {
        type: 'paragraph',
        text: 'But they do not guide you through:',
      },
      {
        type: 'list',
        items: [
          'Your transformation',
          'Your reintegration',
          'Your symbolic identity',
          'Your spiritual architecture',
          'Your emerging future',
        ],
      },
      {
        type: 'paragraph',
        text: 'They measure traits, not identity. They offer insight, not formation. They diagnose, but they do not integrate.',
      },
      {
        type: 'paragraph',
        text: 'This is why so many people feel "seen" by their assessments but not changed by them.',
      },
      {
        type: 'heading',
        text: 'Ancient Cultures Solved This Differently',
      },
      {
        type: 'paragraph',
        text: 'Across ancient Africa, Asia, the Near East, and early Christian communities, identity was not discovered through introspection alone: it was formed through a structured process.',
      },
      {
        type: 'paragraph',
        text: 'Identity was:',
      },
      {
        type: 'list',
        items: ['Initiated', 'Tested', 'Revealed', 'Symbolically marked'],
      },
      {
        type: 'paragraph',
        text: 'There were stages, thresholds, rites, and symbols that guided a person from fragmentation to reintegration.',
      },
      {
        type: 'paragraph',
        text: 'These were not personality tests. They were instruments of becoming.',
      },
      {
        type: 'paragraph',
        text: 'And they worked because they addressed the whole person:',
      },
      {
        type: 'list',
        items: [
          'The True Self',
          'The Shadow',
          'The gifts',
          'The calling',
          'The symbolic identity',
          'The reintegration of the inner life',
        ],
      },
      {
        type: 'paragraph',
        text: 'Modern life has no equivalent instrument.',
      },
      {
        type: 'heading',
        text: 'The Gap CrestApp Was Built to Fill',
      },
      {
        type: 'paragraph',
        text: 'CrestApp emerges precisely at this intersection: where ancient wisdom meets modern performance psychology, and where spiritual formation meets identity science.',
      },
      {
        type: 'paragraph',
        text: 'It is not a self-help app. It is a six-week identity-clarity instrument built on:',
      },
      {
        type: 'list',
        items: [
          'The four stages of transformation',
          'The cosmological blueprint model',
          'Cross-cultural initiation patterns',
          'Christian anthropology',
          'Symbolic identity theory',
          'Human-performance research',
        ],
      },
      {
        type: 'paragraph',
        text: 'It guides you through:',
      },
      {
        type: 'list',
        items: [
          'Your True Self',
          'Your Shadow',
          'Your Fruit (strengths)',
          'Your reintegration',
          'And finally, your symbolic Crest',
        ],
      },
      {
        type: 'paragraph',
        text: 'A structured journey that reveals who you are: and who you are becoming.',
      },
      {
        type: 'heading',
        text: 'Why This Matters Now',
      },
      {
        type: 'paragraph',
        text: 'We are in a moment where:',
      },
      {
        type: 'list',
        items: [
          'Leaders are overwhelmed',
          'Teams are fractured',
          'Communities are disoriented',
          'Individuals are spiritually hungry',
          'Workplaces are emotionally strained',
        ],
      },
      {
        type: 'paragraph',
        text: 'Identity clarity is no longer optional. It is a performance advantage, a spiritual anchor, and a psychological stabilizer.',
      },
      {
        type: 'paragraph',
        text: "People don't just need insight. They need integration. They don't just need information. They need identity. They don't just need tools. They need instruments.",
      },
      {
        type: 'paragraph',
        text: 'CrestApp is one such instrument. And it is coming soon.',
      },
    ],
  },
  {
    id: 'static-3',
    order: 3,
    title: 'The Four Stages of Transformation: The Architecture Behind CrestApp',
    image: '/Article_3.png',
    imageAlt: 'The four stages of transformation',
    content: [
      {
        type: 'paragraph',
        text: 'Every meaningful transformation: spiritual, psychological, or human-performance related: follows a pattern. Not a motivational cycle. Not a random emotional journey. A structure.',
      },
      {
        type: 'paragraph',
        text: 'Across my research in Igbo initiation systems, Ebionite Christianity, Catholic mysticism, and global anthropological patterns, the same architecture kept appearing. Different cultures. Different symbols. Same underlying movement.',
      },
      {
        type: 'paragraph',
        text: 'This discovery became the backbone of CrestApp.',
      },
      {
        type: 'paragraph',
        text: 'Before CrestApp became an instrument, it was a pattern: a four-stage journey that explains how human beings grow, integrate, and become whole.',
      },
      {
        type: 'paragraph',
        text: 'Here are the four stages.',
      },
      {
        type: 'heading',
        text: '1. Awakening: The True Self Emerges',
      },
      {
        type: 'paragraph',
        text: 'Every transformation begins with a moment of recognition: "There is more to me than I have been living."',
      },
      {
        type: 'paragraph',
        text: 'This is the stage where:',
      },
      {
        type: 'list',
        items: [
          'Your True Self becomes visible',
          'Your inner architecture begins to surface',
          'Your identity starts to clarify',
          'Your spiritual hunger intensifies',
        ],
      },
      {
        type: 'paragraph',
        text: 'Ancient traditions called this the call, the invitation, or the first light. It is the spark that begins the journey.',
      },
      {
        type: 'paragraph',
        text: 'In CrestApp, this becomes the True Self Map: a structured way to name who you are beneath roles, expectations, and survival patterns.',
      },
      {
        type: 'heading',
        text: '2. Confrontation: Meeting the Shadow',
      },
      {
        type: 'paragraph',
        text: 'Every tradition agrees: you cannot grow without confronting what holds you back.',
      },
      {
        type: 'paragraph',
        text: 'This is the stage where:',
      },
      {
        type: 'list',
        items: [
          'Your Shadow becomes visible',
          'Your patterns reveal themselves',
          'Your wounds speak',
          'Your fears surface',
          'Your contradictions demand attention',
        ],
      },
      {
        type: 'paragraph',
        text: 'This is not punishment. It is purification.',
      },
      {
        type: 'paragraph',
        text: 'In ancient initiation, this was the trial, the desert, the wrestling, the fire. In CrestApp, this becomes the Shadow Map: a compassionate but honest look at the forces that sabotage your becoming.',
      },
      {
        type: 'paragraph',
        text: 'This is the stage most people avoid. It is also the stage that makes transformation real.',
      },
      {
        type: 'heading',
        text: '3. Strengthening: The Fruit Appears',
      },
      {
        type: 'paragraph',
        text: 'Once the Shadow is named, something remarkable happens: your gifts begin to shine with new clarity.',
      },
      {
        type: 'paragraph',
        text: 'This is the stage where:',
      },
      {
        type: 'list',
        items: [
          'Your strengths become visible',
          'Your virtues mature',
          'Your inner life stabilizes',
          'Your calling becomes clearer',
          'Your identity gains momentum',
        ],
      },
      {
        type: 'paragraph',
        text: 'Ancient traditions called this the fruit, the virtues, the powers, or the gifts of the spirit.',
      },
      {
        type: 'paragraph',
        text: 'In CrestApp, this becomes the Fruit Map: a structured way to identify the strengths that emerge when your True Self is no longer fighting your Shadow.',
      },
      {
        type: 'paragraph',
        text: 'This is the stage where people begin to feel like themselves again.',
      },
      {
        type: 'heading',
        text: '4. Reintegration: The Crest Is Issued',
      },
      {
        type: 'paragraph',
        text: 'This is the final stage: the moment when the journey becomes identity.',
      },
      {
        type: 'paragraph',
        text: 'Reintegration is when:',
      },
      {
        type: 'list',
        items: [
          'Your True Self, Shadow, and Fruit align',
          'Your inner life becomes coherent',
          'Your calling becomes embodied',
          'Your identity becomes symbolic',
          'Your transformation becomes visible',
        ],
      },
      {
        type: 'paragraph',
        text: 'In ancient cultures, this was marked with:',
      },
      {
        type: 'list',
        items: ['A crest', 'A symbol', 'A name', 'A garment', 'A rite', 'A seal'],
      },
      {
        type: 'paragraph',
        text: 'A visible sign of an invisible transformation.',
      },
      {
        type: 'paragraph',
        text: 'In CrestApp, this becomes your Crest: a symbolic identity marking your reintegration, much like the crests once reserved for the nobility of ancient Africa, Asia, and Great Britain.',
      },
      {
        type: 'paragraph',
        text: 'It is not decoration. It is identity.',
      },
      {
        type: 'heading',
        text: 'Why This Architecture Matters',
      },
      {
        type: 'paragraph',
        text: 'Most modern tools describe you. Very few transform you.',
      },
      {
        type: 'paragraph',
        text: 'The four-stage architecture behind CrestApp is what makes it an instrument, not an app. It gives people a structured pathway: not random inspiration.',
      },
      {
        type: 'paragraph',
        text: 'It answers the question: "How do I become who I am meant to be?"',
      },
      {
        type: 'paragraph',
        text: 'With clarity. With structure. With depth. With ancient wisdom and modern psychology working together.',
      },
      {
        type: 'paragraph',
        text: 'This is the backbone of CrestApp. And this is why the next phase of the journey matters.',
      },
    ],
  },
  {
    id: 'static-4',
    order: 4,
    title: 'Identity Clarity: The New Competitive Advantage',
    content: [
      {
        type: 'paragraph',
        text: "In today's world, organizations invest heavily in skills training, leadership programs, and performance tools. Yet the most consistent breakdowns inside teams rarely come from a lack of skill. They come from a lack of identity clarity.",
      },
      {
        type: 'paragraph',
        text: "People know their job descriptions, but not their inner architecture. They know their strengths, but not their contradictions. They know their goals, but not who they are becoming.",
      },
      {
        type: 'paragraph',
        text: 'And when identity is unclear, performance becomes unstable.',
      },
      {
        type: 'paragraph',
        text: 'This is the gap CrestApp was built to address.',
      },
      {
        type: 'heading',
        text: 'Why Identity Clarity Matters More Than Ever',
      },
      {
        type: 'paragraph',
        text: 'Across industries, I keep seeing the same patterns:',
      },
      {
        type: 'list',
        items: [
          'Leaders who are technically competent but internally divided',
          'Teams that communicate well but lack cohesion',
          'High performers who burn out because their inner life is fragmented',
          'Organizations that struggle to develop people beyond surface-level skills',
        ],
      },
      {
        type: 'paragraph',
        text: "The issue isn't talent. It's integration.",
      },
      {
        type: 'paragraph',
        text: 'Identity clarity gives people:',
      },
      {
        type: 'list',
        items: [
          'Stability under pressure',
          'Coherence in decision-making',
          'Emotional maturity',
          'Grounded leadership presence',
          'A deeper sense of calling and direction',
        ],
      },
      {
        type: 'paragraph',
        text: 'In a world of constant change, identity becomes the anchor.',
      },
      {
        type: 'heading',
        text: 'The Missing Layer in Leadership Development',
      },
      {
        type: 'paragraph',
        text: 'Most leadership tools focus on:',
      },
      {
        type: 'list',
        items: [
          'Competencies',
          'Communication',
          'Strengths',
          'Personality',
          'Emotional intelligence',
        ],
      },
      {
        type: 'paragraph',
        text: 'All important: but incomplete.',
      },
      {
        type: 'paragraph',
        text: "What's missing is the identity layer:",
      },
      {
        type: 'list',
        items: [
          'Who am I beneath my roles?',
          'What patterns sabotage my leadership?',
          'What strengths emerge when I am integrated?',
          'What is the symbolic identity I lead from?',
          'Who am I becoming as a leader?',
        ],
      },
      {
        type: 'paragraph',
        text: 'Without this layer, leaders operate from fragmentation. With it, they operate from coherence.',
      },
      {
        type: 'paragraph',
        text: 'CrestApp was designed to deliver that coherence.',
      },
      {
        type: 'heading',
        text: 'How CrestApp Creates Identity Clarity',
      },
      {
        type: 'paragraph',
        text: 'CrestApp translates deep research into a structured, six-week identity-formation instrument built around the four stages of transformation:',
      },
      {
        type: 'list',
        items: [
          'True Self, your core identity',
          'Shadow, your internal contradictions',
          'Fruit, your strengths and virtues',
          'Reintegration, your symbolic identity, expressed as a Crest',
        ],
      },
      {
        type: 'paragraph',
        text: 'Each stage produces a map:',
      },
      {
        type: 'list',
        items: [
          'The True Self Map',
          'The Shadow Map',
          'The Fruit Map',
          'And finally, your Crest',
        ],
      },
      {
        type: 'paragraph',
        text: 'This is not personality typing. It is identity integration.',
      },
      {
        type: 'paragraph',
        text: 'And integrated people lead differently.',
      },
      {
        type: 'heading',
        text: 'Why Organizations Need This Now',
      },
      {
        type: 'paragraph',
        text: 'Identity clarity is no longer a personal luxury: it is a strategic advantage.',
      },
      {
        type: 'paragraph',
        text: 'Organizations that cultivate identity-integrated people see:',
      },
      {
        type: 'list',
        items: [
          'Better decision-making',
          'Higher emotional resilience',
          'Stronger leadership pipelines',
          'Healthier team dynamics',
          'Reduced burnout',
          'Deeper alignment with mission and values',
        ],
      },
      {
        type: 'paragraph',
        text: 'Because when people know who they are, they show up differently.',
      },
      {
        type: 'paragraph',
        text: 'They lead with stability. They collaborate with maturity. They perform with coherence. They navigate conflict with groundedness. They innovate without losing themselves.',
      },
      {
        type: 'paragraph',
        text: 'Identity clarity is the foundation of sustainable performance.',
      },
      {
        type: 'heading',
        text: 'CrestApp as a Human-Performance Instrument',
      },
      {
        type: 'paragraph',
        text: 'CrestApp is not a devotional tool. It is not a personality test. It is not a coaching framework.',
      },
      {
        type: 'paragraph',
        text: 'It is an instrument: a structured identity-clarity system that integrates:',
      },
      {
        type: 'list',
        items: [
          'Ancient initiation patterns',
          'Christian anthropology',
          'Performance psychology',
          'Symbolic identity theory',
          'Leadership development principles',
        ],
      },
      {
        type: 'paragraph',
        text: 'This is why CrestApp fits naturally into:',
      },
      {
        type: 'list',
        items: [
          'Leadership development programs',
          'Corporate chaplaincy',
          'Business school formation',
          'Executive coaching',
          'DEI identity work',
          'Team retreats and offsites',
        ],
      },
      {
        type: 'paragraph',
        text: 'It gives people what most tools cannot: a coherent inner life to lead from.',
      },
      {
        type: 'heading',
        text: 'The Future Belongs to Integrated Leaders',
      },
      {
        type: 'paragraph',
        text: 'The next era of leadership will not be defined by who has the most skills, but by who has the most identity clarity.',
      },
      {
        type: 'paragraph',
        text: 'CrestApp was built for that future.',
      },
      {
        type: 'paragraph',
        text: 'And that future is already here.',
      },
    ],
  },
  {
    id: 'static-5',
    order: 5,
    title: 'CrestApp: The Enterprise Instrument',
    content: [
      {
        type: 'paragraph',
        text: "Most organizations today are built on systems: systems for finance, systems for operations, systems for performance, systems for compliance. But when it comes to the inner lives of the people who lead, collaborate, and make decisions, most organizations rely on intuition, personality tests, or sporadic coaching.",
      },
      {
        type: 'paragraph',
        text: 'The result is predictable:',
      },
      {
        type: 'list',
        items: [
          'Leaders who are technically strong but internally unstable',
          'Teams that communicate well but lack cohesion',
          'High performers who burn out because their identity is fragmented',
          'Cultures that struggle to integrate people at a deeper level',
        ],
      },
      {
        type: 'paragraph',
        text: 'Enter CrestApp: not as an app, but as an enterprise instrument.',
      },
      {
        type: 'paragraph',
        text: 'A structured identity-clarity system that strengthens the inner architecture of the people who carry the organization.',
      },
      {
        type: 'heading',
        text: 'Why Organizations Need an Identity Instrument',
      },
      {
        type: 'paragraph',
        text: 'Every organization has strategy, structure, culture, and talent. But the one thing that determines how all of these function is the inner life of the people inside the system.',
      },
      {
        type: 'paragraph',
        text: 'When identity is unclear, organizations experience:',
      },
      {
        type: 'list',
        items: [
          'Inconsistent leadership',
          'Emotional volatility',
          'Poor decision-making',
          'Misalignment',
          'Burnout',
          'Shallow collaboration',
        ],
      },
      {
        type: 'paragraph',
        text: 'When identity is clear, organizations experience:',
      },
      {
        type: 'list',
        items: [
          'Stability',
          'Grounded leadership',
          'Coherent decision-making',
          'Deeper trust',
          'Healthier culture',
          'Sustainable performance',
        ],
      },
      {
        type: 'paragraph',
        text: 'Identity clarity is not a soft skill. It is a performance infrastructure.',
      },
      {
        type: 'heading',
        text: 'What Makes CrestApp an Enterprise Instrument',
      },
      {
        type: 'paragraph',
        text: 'CrestApp is built on the four stages of transformation:',
      },
      {
        type: 'list',
        items: [
          'Awakening, the True Self emerges',
          'Confrontation, the Shadow becomes visible',
          'Strengthening, the Fruit (strengths) stabilizes',
          'Reintegration, the symbolic Crest is issued',
        ],
      },
      {
        type: 'paragraph',
        text: "But what makes it enterprise-ready is not the theory: it's the structure.",
      },
      {
        type: 'paragraph',
        text: 'CrestApp provides:',
      },
      {
        type: 'list',
        items: [
          'A repeatable identity-formation process',
          'A shared language for inner development',
          'A consistent framework for leadership growth',
          'A symbolic identity system that aligns people with mission',
          'A way to integrate personal transformation into organizational life',
        ],
      },
      {
        type: 'paragraph',
        text: 'This is not a personality test. It is not a coaching model. It is not a motivational tool.',
      },
      {
        type: 'paragraph',
        text: 'It is an instrument: a structured system that produces identity clarity at scale.',
      },
      {
        type: 'heading',
        text: 'Where CrestApp Fits Inside an Organization',
      },
      {
        type: 'paragraph',
        text: 'CrestApp integrates naturally into:',
      },
      {
        type: 'list',
        items: [
          "Leadership Development: executives and emerging leaders gain identity clarity, emotional stability, and symbolic grounding",
          "Team Formation: teams gain a shared understanding of each member's True Self, Shadow patterns, and Fruit strengths",
          'Corporate Chaplaincy & Spiritual Care, a structured, theologically grounded pathway for spiritual formation inside the workplace',
          'Business Schools & Executive Education, students gain identity architecture alongside strategy, finance, and leadership theory',
          'DEI & Belonging Work, identity clarity deepens belonging by helping people understand who they are beneath cultural labels',
          'Coaching & Mentorship Programs, coaches gain a structured instrument to guide identity-level transformation',
        ],
      },
      {
        type: 'paragraph',
        text: 'CrestApp becomes the inner operating system that supports the outer work.',
      },
      {
        type: 'heading',
        text: 'Why Identity Instruments Outperform Personality Tools',
      },
      {
        type: 'paragraph',
        text: 'Personality tools describe. CrestApp integrates. Personality tools label. CrestApp transforms. Personality tools explain tendencies. CrestApp reveals identity. Personality tools show patterns. CrestApp aligns the True Self, Shadow, and Fruit into a coherent whole.',
      },
      {
        type: 'paragraph',
        text: 'This is why organizations that adopt identity instruments outperform those that rely on personality frameworks alone.',
      },
      {
        type: 'paragraph',
        text: 'Identity is the foundation of sustainable leadership.',
      },
      {
        type: 'heading',
        text: 'The Enterprise Advantage',
      },
      {
        type: 'paragraph',
        text: 'Organizations that deploy CrestApp experience:',
      },
      {
        type: 'list',
        items: [
          'Leaders who are grounded, not reactive',
          'Teams that collaborate from maturity, not insecurity',
          'Cultures that are stable, not chaotic',
          'Decision-making that is coherent, not fragmented',
          'Performance that is sustainable, not explosive then exhausted',
        ],
      },
      {
        type: 'paragraph',
        text: 'Because when people know who they are, everything else becomes clearer.',
      },
      {
        type: 'paragraph',
        text: 'Identity clarity is the new competitive advantage. CrestApp is the instrument that delivers it.',
      },
    ],
  },
  {
    id: 'static-6',
    order: 6,
    title: 'Symbolic Identity: Why the Crest Matters',
    image: '/crest_black_logo.png',
    imageAlt: 'Crest logo: symbol of identity and transformation',
    content: [
      {
        type: 'paragraph',
        text: 'Every culture that has taken human transformation seriously has used symbols to mark identity. Not as decoration. Not as branding. But as a visible sign of an invisible integration.',
      },
      {
        type: 'paragraph',
        text: 'Across ancient Africa, Asia, the Near East, and early Christianity, symbols were not optional. They were the final stage of becoming.',
      },
      {
        type: 'paragraph',
        text: 'A symbol said: "This is who I am now. This is who I have become."',
      },
      {
        type: 'paragraph',
        text: 'CrestApp restores that ancient logic: not by copying old symbols, but by helping each person discover their own.',
      },
      {
        type: 'heading',
        text: 'Why Identity Needs a Symbol',
      },
      {
        type: 'paragraph',
        text: 'Modern life has stripped identity of its symbolic dimension. We have:',
      },
      {
        type: 'list',
        items: ['Job titles', 'Personality labels', 'Social media bios', 'Organisational roles'],
      },
      {
        type: 'paragraph',
        text: 'But none of these express the inner architecture of a person.',
      },
      {
        type: 'paragraph',
        text: 'A symbolic identity does what titles cannot:',
      },
      {
        type: 'list',
        items: [
          'It integrates the True Self',
          'It acknowledges the Shadow',
          'It expresses the Fruit',
          'It marks the reintegration of the inner life',
        ],
      },
      {
        type: 'paragraph',
        text: 'A symbol is identity in its most distilled form. It is the moment when transformation becomes visible.',
      },
      {
        type: 'heading',
        text: 'The Ancient Logic of the Crest',
      },
      {
        type: 'paragraph',
        text: 'In ancient cultures, a crest was never ornamental. It was:',
      },
      {
        type: 'list',
        items: [
          'A sign of maturity',
          'A mark of belonging',
          'A seal of identity',
          'A recognition of inner transformation',
          'A signal of readiness for responsibility',
        ],
      },
      {
        type: 'paragraph',
        text: 'Nobility in Africa, Asia, and Great Britain used crests not to boast, but to declare identity.',
      },
      {
        type: 'paragraph',
        text: 'A crest said: "I have passed through the stages. I am integrated. I am ready."',
      },
      {
        type: 'paragraph',
        text: 'CrestApp brings this back: not as nostalgia, but as a psychological and spiritual technology.',
      },
      {
        type: 'heading',
        text: 'How CrestApp Issues a Symbolic Identity',
      },
      {
        type: 'paragraph',
        text: 'CrestApp guides you through the four stages:',
      },
      {
        type: 'list',
        items: [
          'Awakening, your True Self emerges',
          'Confrontation, your Shadow becomes visible',
          'Strengthening, your Fruit stabilizes',
          'Reintegration, your identity becomes coherent',
        ],
      },
      {
        type: 'paragraph',
        text: 'And then: only then: the Crest is issued.',
      },
      {
        type: 'paragraph',
        text: 'Your Crest is not random. It is not aesthetic. It is not chosen for you.',
      },
      {
        type: 'paragraph',
        text: 'It is revealed through:',
      },
      {
        type: 'list',
        items: [
          'Your patterns',
          'Your strengths',
          'Your contradictions',
          'Your calling',
          'Your symbolic architecture',
        ],
      },
      {
        type: 'paragraph',
        text: 'It is the visual expression of your reintegrated identity.',
      },
      {
        type: 'heading',
        text: 'Why Symbolic Identity Is Powerful',
      },
      {
        type: 'paragraph',
        text: 'Symbolic identity does three things that no personality test can do:',
      },
      {
        type: 'list',
        items: [
          'It anchors you, when life becomes chaotic, a symbol reminds you who you are',
          'It aligns you, a symbol pulls your True Self, Shadow, and Fruit into coherence',
          'It activates you, a symbol calls you forward into the person you are becoming',
        ],
      },
      {
        type: 'paragraph',
        text: 'This is why ancient cultures used symbols. This is why modern people feel lost without them. This is why CrestApp restores them.',
      },
      {
        type: 'heading',
        text: 'The Crest Is Not the End: It Is the Beginning',
      },
      {
        type: 'paragraph',
        text: 'Receiving your Crest is not a graduation. It is a commissioning.',
      },
      {
        type: 'paragraph',
        text: 'It marks the moment when:',
      },
      {
        type: 'list',
        items: [
          'Your identity becomes stable',
          'Your inner life becomes coherent',
          'Your calling becomes embodied',
          'Your transformation becomes visible',
        ],
      },
      {
        type: 'paragraph',
        text: 'It is the moment when you can say: "This is who I am. This is who I am becoming."',
      },
      {
        type: 'paragraph',
        text: 'The Crest is not a logo. It is a life.',
      },
      {
        type: 'heading',
        text: 'Why This Matters Now',
      },
      {
        type: 'paragraph',
        text: 'We live in a world where identity is fragmented, politicized, commercialized, and confused.',
      },
      {
        type: 'paragraph',
        text: 'People are searching for something deeper: something ancient, something true, something that integrates the whole person.',
      },
      {
        type: 'paragraph',
        text: 'CrestApp offers that.',
      },
      {
        type: 'paragraph',
        text: 'Not by giving people a new label, but by giving them a symbolic identity rooted in their own transformation.',
      },
      {
        type: 'paragraph',
        text: 'The Crest is the final stage of the journey. And for many, it will be the first time they have ever seen their identity made visible.',
      },
    ],
  },
]
