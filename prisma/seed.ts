import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data - AI Features first (due to foreign key constraints)
  await prisma.prediction.deleteMany();
  await prisma.mood.deleteMany();
  await prisma.homework.deleteMany();
  await prisma.decision.deleteMany();
  await prisma.session.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.user.deleteMany();

  // Clear existing data - Original models
  await prisma.stat.deleteMany();
  await prisma.company.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.service.deleteMany();
  await prisma.additionalService.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.timeSlot.deleteMany();

  // Seed Stats (Hero section)
  const stats = await prisma.stat.createMany({
    data: [
      { value: '500+', label: 'Clients Coached', order: 1 },
      { value: '15+', label: 'Years Experience', order: 2 },
      { value: '98%', label: 'Client Satisfaction', order: 3 },
    ],
  });
  console.log(`Created ${stats.count} stats`);

  // Seed Services (15+ items)
  const services = await prisma.service.createMany({
    data: [
      {
        title: 'Executive Coaching',
        description: 'One-on-one coaching for C-suite executives and senior leaders focused on strategic thinking, decision-making, and organizational impact.',
        features: ['12 bi-weekly sessions', '360-degree assessment', 'Leadership action plan', 'Email support between sessions'],
        price: '$5,000',
        duration: '6 months',
        popular: true,
        order: 1,
      },
      {
        title: 'Leadership Development',
        description: 'Comprehensive program for emerging leaders ready to step into senior roles with confidence and clarity.',
        features: ['8 bi-weekly sessions', 'Strengths assessment', 'Personalized development plan', 'Resource library access'],
        price: '$3,500',
        duration: '4 months',
        popular: false,
        order: 2,
      },
      {
        title: 'Team Coaching',
        description: 'Transform your leadership team\'s dynamics, communication, and collective performance.',
        features: ['Team assessment', '6 group sessions', 'Individual check-ins', 'Team alignment workshop'],
        price: '$8,000',
        duration: '3 months',
        popular: false,
        order: 3,
      },
      {
        title: 'Career Transition Coaching',
        description: 'Navigate major career transitions with confidence, clarity, and strategic positioning.',
        features: ['10 sessions', 'Career assessment tools', 'Personal branding strategy', 'Networking guidance'],
        price: '$4,000',
        duration: '3 months',
        popular: false,
        order: 4,
      },
      {
        title: 'New Manager Coaching',
        description: 'Essential coaching for first-time managers to develop core leadership competencies.',
        features: ['6 sessions', 'Management fundamentals', 'Feedback training', '30-60-90 day plan'],
        price: '$2,500',
        duration: '2 months',
        popular: false,
        order: 5,
      },
      {
        title: 'Performance Coaching',
        description: 'Intensive coaching to address specific performance challenges and accelerate improvement.',
        features: ['8 sessions', 'Performance assessment', 'Goal setting framework', 'Progress tracking'],
        price: '$3,000',
        duration: '2 months',
        popular: false,
        order: 6,
      },
      {
        title: 'Strategic Planning Coaching',
        description: 'Partner with an experienced coach to develop and execute strategic initiatives.',
        features: ['12 sessions', 'Strategic framework', 'Implementation roadmap', 'Quarterly reviews'],
        price: '$6,000',
        duration: '6 months',
        popular: false,
        order: 7,
      },
      {
        title: 'Communication Mastery',
        description: 'Enhance your executive presence, presentation skills, and stakeholder communication.',
        features: ['8 sessions', 'Video feedback', 'Presentation coaching', 'Stakeholder mapping'],
        price: '$3,500',
        duration: '3 months',
        popular: false,
        order: 8,
      },
      {
        title: 'Conflict Resolution Coaching',
        description: 'Develop skills to navigate and resolve workplace conflicts effectively.',
        features: ['6 sessions', 'Conflict style assessment', 'Mediation techniques', 'Difficult conversation scripts'],
        price: '$2,800',
        duration: '2 months',
        popular: false,
        order: 9,
      },
      {
        title: 'Work-Life Integration',
        description: 'Achieve sustainable success by aligning your professional and personal priorities.',
        features: ['10 sessions', 'Life audit', 'Boundary setting', 'Energy management'],
        price: '$3,200',
        duration: '3 months',
        popular: false,
        order: 10,
      },
      {
        title: 'Board Readiness Program',
        description: 'Prepare for board-level leadership with governance training and strategic oversight skills.',
        features: ['12 sessions', 'Governance training', 'Board simulation', 'Executive presence'],
        price: '$7,500',
        duration: '6 months',
        popular: false,
        order: 11,
      },
      {
        title: 'Startup Founder Coaching',
        description: 'Specialized coaching for founders navigating the unique challenges of building a company.',
        features: ['Flexible scheduling', 'Investor prep', 'Team building', 'Scaling strategies'],
        price: '$4,500',
        duration: '4 months',
        popular: false,
        order: 12,
      },
      {
        title: 'Women in Leadership',
        description: 'Empowering women leaders to break barriers and achieve their full potential.',
        features: ['10 sessions', 'Bias navigation', 'Negotiation skills', 'Executive sponsorship'],
        price: '$4,000',
        duration: '4 months',
        popular: false,
        order: 13,
      },
      {
        title: 'Cross-Cultural Leadership',
        description: 'Develop cultural intelligence to lead effectively in global and diverse environments.',
        features: ['8 sessions', 'Cultural assessment', 'Global mindset training', 'Inclusive leadership'],
        price: '$3,500',
        duration: '3 months',
        popular: false,
        order: 14,
      },
      {
        title: 'Retirement Transition',
        description: 'Plan your next chapter with purpose, legacy, and continued impact.',
        features: ['8 sessions', 'Legacy planning', 'Identity transition', 'Board/Advisory preparation'],
        price: '$3,000',
        duration: '3 months',
        popular: false,
        order: 15,
      },
    ],
  });
  console.log(`Created ${services.count} services`);

  // Seed Additional Services
  const additionalServices = await prisma.additionalService.createMany({
    data: [
      {
        title: 'Virtual Sessions',
        description: 'Flexible video coaching sessions that fit your schedule, wherever you are.',
        iconName: 'video',
        order: 1,
      },
      {
        title: 'On-Site Workshops',
        description: 'Half-day and full-day workshops for your organization\'s leadership teams.',
        iconName: 'building',
        order: 2,
      },
      {
        title: 'Speaking & Keynotes',
        description: 'Inspiring talks on leadership, transformation, and peak performance.',
        iconName: 'lightbulb',
        order: 3,
      },
      {
        title: 'Assessment Services',
        description: 'Comprehensive leadership and team assessments using validated instruments.',
        iconName: 'clipboard',
        order: 4,
      },
      {
        title: 'Group Coaching Circles',
        description: 'Peer learning groups for leaders facing similar challenges.',
        iconName: 'users',
        order: 5,
      },
    ],
  });
  console.log(`Created ${additionalServices.count} additional services`);

  // Seed Testimonials (15+ items)
  const testimonials = await prisma.testimonial.createMany({
    data: [
      {
        quote: 'Working with this coach transformed not just my leadership approach, but my entire perspective on what\'s possible. I\'ve seen a 40% improvement in team engagement scores within six months.',
        author: 'Sarah Chen',
        title: 'CEO',
        company: 'TechVenture Inc.',
        featured: true,
        order: 1,
      },
      {
        quote: 'The executive coaching program gave me the clarity and confidence I needed to navigate a complex merger. The ROI has been immeasurable.',
        author: 'Michael Rodriguez',
        title: 'CFO',
        company: 'Global Finance Corp',
        featured: false,
        order: 2,
      },
      {
        quote: 'I was skeptical about coaching at first, but this experience exceeded all expectations. I\'ve become a more empathetic and effective leader.',
        author: 'Jennifer Park',
        title: 'VP of Operations',
        company: 'Healthcare Plus',
        featured: false,
        order: 3,
      },
      {
        quote: 'The personalized approach and genuine investment in my growth made all the difference. I recommend this coaching to any executive looking to level up.',
        author: 'David Thompson',
        title: 'Managing Director',
        company: 'Investment Partners',
        featured: false,
        order: 4,
      },
      {
        quote: 'After years of feeling stuck, the coaching sessions helped me break through to the next level. I\'m now leading our largest division.',
        author: 'Amanda Foster',
        title: 'Senior Director',
        company: 'Retail Giants',
        featured: false,
        order: 5,
      },
      {
        quote: 'The frameworks and insights I gained have become essential tools in my leadership toolkit. Truly transformative experience.',
        author: 'Robert Kim',
        title: 'CTO',
        company: 'Innovation Labs',
        featured: false,
        order: 6,
      },
      {
        quote: 'This coaching program helped me transition from a technical role to executive leadership seamlessly. The support was invaluable.',
        author: 'Lisa Wang',
        title: 'Chief Product Officer',
        company: 'SaaS Solutions',
        featured: false,
        order: 7,
      },
      {
        quote: 'My communication skills and executive presence have improved dramatically. I now command the boardroom with confidence.',
        author: 'James Mitchell',
        title: 'CEO',
        company: 'Manufacturing Co',
        featured: false,
        order: 8,
      },
      {
        quote: 'The 360-degree feedback process was eye-opening. It gave me insights I never would have discovered on my own.',
        author: 'Patricia Gomez',
        title: 'SVP Human Resources',
        company: 'Enterprise Tech',
        featured: false,
        order: 9,
      },
      {
        quote: 'As a first-time CEO, having an experienced coach in my corner was crucial. I avoided so many common pitfalls.',
        author: 'Thomas Anderson',
        title: 'CEO',
        company: 'Startup Ventures',
        featured: false,
        order: 10,
      },
      {
        quote: 'The team coaching transformed our executive committee. We went from siloed to collaborative in just three months.',
        author: 'Rachel Green',
        title: 'COO',
        company: 'Media Group',
        featured: false,
        order: 11,
      },
      {
        quote: 'I learned to delegate effectively and focus on strategic priorities. My stress levels dropped while our results improved.',
        author: 'Marcus Johnson',
        title: 'President',
        company: 'Logistics Inc',
        featured: false,
        order: 12,
      },
      {
        quote: 'The work-life integration coaching changed my life. I\'m now a better leader AND a more present parent.',
        author: 'Emily Davis',
        title: 'CMO',
        company: 'Consumer Brands',
        featured: false,
        order: 13,
      },
      {
        quote: 'Preparing for my board presentation was daunting until I had coaching support. I nailed it and secured our Series C.',
        author: 'Andrew Lee',
        title: 'Founder & CEO',
        company: 'FinTech Startup',
        featured: false,
        order: 14,
      },
      {
        quote: 'The cultural intelligence training helped me lead our global expansion effectively. We\'re now operating in 12 new countries.',
        author: 'Sophia Martinez',
        title: 'VP International',
        company: 'Global Retail',
        featured: false,
        order: 15,
      },
      {
        quote: 'My coach helped me navigate a toxic work culture and ultimately transform it. Our employee satisfaction is at an all-time high.',
        author: 'Brian O\'Connor',
        title: 'Chief People Officer',
        company: 'Professional Services',
        featured: false,
        order: 16,
      },
    ],
  });
  console.log(`Created ${testimonials.count} testimonials`);

  // Seed Companies (trusted by section)
  const companies = await prisma.company.createMany({
    data: [
      { name: 'Fortune 500 Company', order: 1 },
      { name: 'Leading Tech Firm', order: 2 },
      { name: 'Global Consulting', order: 3 },
      { name: 'Major Healthcare', order: 4 },
      { name: 'Financial Services', order: 5 },
      { name: 'Manufacturing Leaders', order: 6 },
      { name: 'Retail Giants', order: 7 },
      { name: 'Media Conglomerate', order: 8 },
    ],
  });
  console.log(`Created ${companies.count} companies`);

  // Seed Blog Posts (15+ items)
  const blogPosts = await prisma.blogPost.createMany({
    data: [
      {
        title: '5 Leadership Habits That Transform Team Performance',
        slug: '5-leadership-habits-transform-team-performance',
        excerpt: 'Discover the daily practices that separate exceptional leaders from the rest. Learn how small changes create massive impact.',
        category: 'Leadership',
        readTime: '5 min read',
        featured: true,
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
      },
      {
        title: 'Navigating Executive Transitions: A Complete Guide',
        slug: 'navigating-executive-transitions-complete-guide',
        excerpt: 'Moving into a new executive role? Here\'s your roadmap for the critical first 90 days.',
        category: 'Career Growth',
        readTime: '8 min read',
        featured: false,
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
      },
      {
        title: 'The Art of Strategic Decision-Making Under Pressure',
        slug: 'strategic-decision-making-under-pressure',
        excerpt: 'How to maintain clarity and make sound decisions when the stakes are highest.',
        category: 'Strategy',
        readTime: '6 min read',
        featured: false,
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
      },
      {
        title: 'Building Psychological Safety in Your Team',
        slug: 'building-psychological-safety-team',
        excerpt: 'Why the best teams feel safe to take risks and how you can create that environment.',
        category: 'Team Building',
        readTime: '7 min read',
        featured: false,
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
      },
      {
        title: 'The Power of Vulnerability in Leadership',
        slug: 'power-vulnerability-leadership',
        excerpt: 'Why showing vulnerability is a strength, not a weakness, and how it builds trust.',
        category: 'Leadership',
        readTime: '5 min read',
        featured: false,
        imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80',
      },
      {
        title: 'Mastering Difficult Conversations as an Executive',
        slug: 'mastering-difficult-conversations-executive',
        excerpt: 'Frameworks for handling tough talks with grace, directness, and positive outcomes.',
        category: 'Communication',
        readTime: '7 min read',
        featured: false,
        imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
      },
      {
        title: 'Creating a Culture of Continuous Feedback',
        slug: 'culture-continuous-feedback',
        excerpt: 'Move beyond annual reviews to build a feedback-rich environment that drives growth.',
        category: 'Team Building',
        readTime: '6 min read',
        featured: false,
        imageUrl: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800&q=80',
      },
      {
        title: 'Executive Burnout: Prevention and Recovery Strategies',
        slug: 'executive-burnout-prevention-recovery',
        excerpt: 'Recognize the signs of burnout and implement sustainable practices for long-term success.',
        category: 'Wellness',
        readTime: '8 min read',
        featured: false,
        imageUrl: 'https://images.unsplash.com/photo-1541199249251-f713e6145474?w=800&q=80',
      },
      {
        title: 'Leading Through Organizational Change',
        slug: 'leading-organizational-change',
        excerpt: 'A practical guide to guiding your team through transformation with minimal disruption.',
        category: 'Change Management',
        readTime: '9 min read',
        featured: false,
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
      },
      {
        title: 'The Executive\'s Guide to Effective Delegation',
        slug: 'executives-guide-effective-delegation',
        excerpt: 'Stop doing everything yourself and learn to empower your team for better results.',
        category: 'Leadership',
        readTime: '6 min read',
        featured: false,
        imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
      },
      {
        title: 'Building Your Personal Board of Advisors',
        slug: 'building-personal-board-advisors',
        excerpt: 'How to assemble a trusted circle of mentors and advisors to accelerate your career.',
        category: 'Career Growth',
        readTime: '5 min read',
        featured: false,
        imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
      },
      {
        title: 'Emotional Intelligence for Senior Leaders',
        slug: 'emotional-intelligence-senior-leaders',
        excerpt: 'Developing the EQ skills that differentiate good leaders from great ones.',
        category: 'Leadership',
        readTime: '7 min read',
        featured: false,
        imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80',
      },
      {
        title: 'Strategic Networking for Executives',
        slug: 'strategic-networking-executives',
        excerpt: 'Build meaningful connections that advance your career and organization.',
        category: 'Career Growth',
        readTime: '6 min read',
        featured: false,
        imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
      },
      {
        title: 'Managing Up: Working Effectively with Your Board',
        slug: 'managing-up-working-with-board',
        excerpt: 'Best practices for productive board relationships and effective governance.',
        category: 'Strategy',
        readTime: '8 min read',
        featured: false,
        imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
      },
      {
        title: 'Developing Your Executive Presence',
        slug: 'developing-executive-presence',
        excerpt: 'The key elements of commanding presence and how to develop them authentically.',
        category: 'Leadership',
        readTime: '6 min read',
        featured: false,
        imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80',
      },
      {
        title: 'Remote Leadership: Best Practices for the Hybrid Era',
        slug: 'remote-leadership-hybrid-era',
        excerpt: 'Lead effectively across distributed teams with these proven strategies.',
        category: 'Leadership',
        readTime: '7 min read',
        featured: false,
        imageUrl: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&q=80',
      },
    ],
  });
  console.log(`Created ${blogPosts.count} blog posts`);

  // Seed Resources (15+ items)
  const resources = await prisma.resource.createMany({
    data: [
      {
        title: 'Leadership Self-Assessment',
        description: 'Free 15-minute assessment to identify your leadership strengths and growth areas.',
        type: 'Assessment',
        iconName: 'clipboard-check',
        order: 1,
      },
      {
        title: 'Executive Coaching Workbook',
        description: 'A comprehensive workbook with exercises to accelerate your leadership development.',
        type: 'PDF Guide',
        iconName: 'book-open',
        order: 2,
      },
      {
        title: 'Weekly Leadership Insights',
        description: 'Subscribe to receive actionable leadership tips and exclusive content every week.',
        type: 'Newsletter',
        iconName: 'mail',
        order: 3,
      },
      {
        title: '90-Day Leadership Plan Template',
        description: 'A structured template for new leaders to hit the ground running.',
        type: 'Template',
        iconName: 'calendar',
        order: 4,
      },
      {
        title: 'Difficult Conversations Cheat Sheet',
        description: 'Quick reference guide for navigating challenging workplace discussions.',
        type: 'PDF Guide',
        iconName: 'chat-bubble',
        order: 5,
      },
      {
        title: 'Team Health Check Survey',
        description: 'Assess your team\'s dynamics and identify areas for improvement.',
        type: 'Assessment',
        iconName: 'heart',
        order: 6,
      },
      {
        title: 'Strategic Planning Canvas',
        description: 'Visual framework for mapping out your strategic initiatives.',
        type: 'Template',
        iconName: 'map',
        order: 7,
      },
      {
        title: 'Executive Book Recommendations',
        description: 'Curated list of must-read books for aspiring and current executives.',
        type: 'Reading List',
        iconName: 'book',
        order: 8,
      },
      {
        title: 'Stakeholder Mapping Template',
        description: 'Tool for identifying and prioritizing key stakeholder relationships.',
        type: 'Template',
        iconName: 'users',
        order: 9,
      },
      {
        title: 'Personal Vision Statement Guide',
        description: 'Step-by-step process for crafting your leadership vision.',
        type: 'PDF Guide',
        iconName: 'eye',
        order: 10,
      },
      {
        title: 'Meeting Effectiveness Toolkit',
        description: 'Resources to transform your meetings from time-wasters to value-creators.',
        type: 'Toolkit',
        iconName: 'clock',
        order: 11,
      },
      {
        title: 'Feedback Framework Cards',
        description: 'Printable cards with frameworks for giving and receiving feedback.',
        type: 'Cards',
        iconName: 'chat',
        order: 12,
      },
      {
        title: 'Change Management Checklist',
        description: 'Ensure you don\'t miss critical steps when leading organizational change.',
        type: 'Checklist',
        iconName: 'check-square',
        order: 13,
      },
      {
        title: 'Executive Podcast Playlist',
        description: 'Top podcast episodes on leadership, strategy, and personal development.',
        type: 'Playlist',
        iconName: 'microphone',
        order: 14,
      },
      {
        title: 'Goal Setting Workshop Recording',
        description: 'Video recording of our popular annual goal-setting workshop.',
        type: 'Video',
        iconName: 'video',
        order: 15,
      },
    ],
  });
  console.log(`Created ${resources.count} resources`);

  // Seed Time Slots
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

  for (const day of days) {
    for (const time of times) {
      await prisma.timeSlot.create({
        data: { day, time, available: true },
      });
    }
  }
  console.log('Created time slots for all days');

  // Clear existing bookings and contacts
  await prisma.booking.deleteMany();
  await prisma.contact.deleteMany();

  // Seed Bookings (15 items)
  const bookings = await prisma.booking.createMany({
    data: [
      { name: 'Michael Chen', email: 'michael.chen@techcorp.com', phone: '555-0101', topic: 'Executive coaching for new CEO role', day: 'Monday', time: '9:00 AM', status: 'confirmed' },
      { name: 'Sarah Johnson', email: 'sarah.j@innovation.io', phone: '555-0102', topic: 'Leadership development program inquiry', day: 'Monday', time: '2:00 PM', status: 'pending' },
      { name: 'David Williams', email: 'dwilliams@globalfinance.com', phone: '555-0103', topic: 'Team coaching for senior leadership team', day: 'Tuesday', time: '10:00 AM', status: 'confirmed' },
      { name: 'Emily Rodriguez', email: 'emily.r@startupventures.com', phone: '555-0104', topic: 'Career transition coaching', day: 'Tuesday', time: '3:00 PM', status: 'completed' },
      { name: 'James Thompson', email: 'jthompson@enterprise.net', phone: '555-0105', topic: 'Executive presence development', day: 'Wednesday', time: '11:00 AM', status: 'confirmed' },
      { name: 'Lisa Anderson', email: 'landerson@healthcare.org', phone: '555-0106', topic: 'Conflict resolution coaching', day: 'Wednesday', time: '1:00 PM', status: 'pending' },
      { name: 'Robert Martinez', email: 'rmartinez@manufacturing.com', phone: '555-0107', topic: 'Strategic planning facilitation', day: 'Thursday', time: '9:00 AM', status: 'confirmed' },
      { name: 'Jennifer Lee', email: 'jlee@retailgiants.com', phone: '555-0108', topic: 'Change management support', day: 'Thursday', time: '2:00 PM', status: 'cancelled' },
      { name: 'Christopher Brown', email: 'cbrown@consulting.co', phone: '555-0109', topic: 'Partnership development discussion', day: 'Friday', time: '10:00 AM', status: 'completed' },
      { name: 'Amanda Wilson', email: 'awilson@nonprofit.org', phone: '555-0110', topic: 'Board presentation coaching', day: 'Friday', time: '4:00 PM', status: 'pending' },
      { name: 'Daniel Garcia', email: 'dgarcia@techstartup.io', phone: '555-0111', topic: 'First-time CEO coaching', day: 'Monday', time: '11:00 AM', status: 'confirmed' },
      { name: 'Michelle Taylor', email: 'mtaylor@mediagroup.com', phone: '555-0112', topic: 'Communication skills enhancement', day: 'Tuesday', time: '1:00 PM', status: 'pending' },
      { name: 'Kevin Moore', email: 'kmoore@lawfirm.com', phone: '555-0113', topic: 'Work-life balance coaching', day: 'Wednesday', time: '4:00 PM', status: 'confirmed' },
      { name: 'Rachel Davis', email: 'rdavis@education.edu', phone: '555-0114', topic: 'Academic leadership development', day: 'Thursday', time: '11:00 AM', status: 'completed' },
      { name: 'Steven Clark', email: 'sclark@investment.com', phone: '555-0115', topic: 'High-stakes negotiation prep', day: 'Friday', time: '1:00 PM', status: 'pending' },
    ],
  });
  console.log(`Created ${bookings.count} bookings`);

  // Seed Contacts (15 items)
  const contacts = await prisma.contact.createMany({
    data: [
      { name: 'Patricia White', email: 'pwhite@bigcorp.com', company: 'BigCorp Industries', message: 'Interested in executive coaching for our C-suite. Can you share more about your enterprise packages?', status: 'new' },
      { name: 'Thomas Harris', email: 'tharris@startup.io', company: 'Startup.io', message: 'I saw your talk at the leadership conference. Would love to discuss coaching options for our founding team.', status: 'replied' },
      { name: 'Nancy Lewis', email: 'nlewis@healthcare.net', company: 'HealthCare Network', message: 'We need leadership development for 20 department heads. Do you offer group programs?', status: 'new' },
      { name: 'Mark Robinson', email: 'mrobinson@finance.com', company: 'Finance Corp', message: 'Looking for an executive coach who specializes in the financial sector. Your background looks perfect.', status: 'in_progress' },
      { name: 'Sandra Walker', email: 'swalker@tech.co', company: 'Tech Company', message: 'Can you help with team dynamics issues? We have a high-performing but siloed leadership team.', status: 'replied' },
      { name: 'Paul Hall', email: 'phall@manufacturing.net', company: 'Manufacturing Plus', message: 'Interested in your 90-day leadership plan template. Is there coaching that goes with it?', status: 'new' },
      { name: 'Karen Allen', email: 'kallen@nonprofit.org', company: 'Community Foundation', message: 'We have limited budget but need coaching for our new Executive Director. Any sliding scale options?', status: 'in_progress' },
      { name: 'George Young', email: 'gyoung@law.com', company: 'Young & Associates Law', message: 'Partner retreat coming up. Looking for a facilitator who understands professional services.', status: 'replied' },
      { name: 'Betty King', email: 'bking@retail.com', company: 'Retail Brands Inc', message: 'Need help preparing for a board presentation next month. Is that something you can help with?', status: 'completed' },
      { name: 'Edward Wright', email: 'ewright@energy.co', company: 'Energy Solutions', message: 'Transitioning from COO to CEO. Looking for coaching support during this change.', status: 'new' },
      { name: 'Dorothy Scott', email: 'dscott@media.net', company: 'Media Networks', message: 'Our leadership team struggles with remote work dynamics. Can you help us improve?', status: 'in_progress' },
      { name: 'Frank Green', email: 'fgreen@consulting.io', company: 'Green Consulting', message: 'Potential partnership opportunity. We refer clients who need executive coaching.', status: 'replied' },
      { name: 'Ruth Adams', email: 'radams@education.org', company: 'State University', message: 'Looking for coaching for our academic deans. Do you have experience in higher education?', status: 'new' },
      { name: 'Henry Baker', email: 'hbaker@insurance.com', company: 'Insurance Group', message: 'Need coaching for newly promoted VP. She is brilliant but struggling with the transition.', status: 'in_progress' },
      { name: 'Gloria Nelson', email: 'gnelson@pharma.co', company: 'Pharma Industries', message: 'Interested in a workshop on difficult conversations for our management team.', status: 'new' },
    ],
  });
  console.log(`Created ${contacts.count} contacts`);

  // ==================== SEED AI FEATURES DATA ====================

  // Seed Users (for AI features)
  const user1 = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      password: 'demo123',
      name: 'Demo User',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      password: 'john123',
      name: 'John Smith',
    },
  });
  console.log('Created 2 demo users');

  // Seed Goals (15+ items)
  const goals = await prisma.goal.createMany({
    data: [
      { title: 'Complete Marathon Training', description: 'Train and complete a full marathon within 6 months', category: 'Health', targetDate: new Date('2025-06-01'), progress: 45, status: 'active', priority: 'high', milestones: ['Run 5K', 'Run 10K', 'Run Half Marathon', 'Complete Marathon'], aiInsights: 'Based on your current progress, you are on track to complete this goal. Consider increasing your weekly mileage gradually.', userId: user1.id },
      { title: 'Learn Spanish Fluently', description: 'Achieve B2 level proficiency in Spanish', category: 'Education', targetDate: new Date('2025-08-15'), progress: 30, status: 'active', priority: 'medium', milestones: ['Complete A1', 'Complete A2', 'Complete B1', 'Complete B2'], aiInsights: 'Your vocabulary growth is strong. Focus more on conversational practice to improve fluency.', userId: user1.id },
      { title: 'Save $20,000 Emergency Fund', description: 'Build a solid emergency fund for financial security', category: 'Finance', targetDate: new Date('2025-12-31'), progress: 60, status: 'active', priority: 'high', milestones: ['Save $5K', 'Save $10K', 'Save $15K', 'Save $20K'], aiInsights: 'Excellent progress! At your current savings rate, you will reach this goal 2 months early.', userId: user1.id },
      { title: 'Get Promoted to Senior Developer', description: 'Achieve promotion to senior software developer position', category: 'Career', targetDate: new Date('2025-03-01'), progress: 75, status: 'active', priority: 'high', milestones: ['Lead a project', 'Mentor junior devs', 'Complete certifications', 'Performance review'], aiInsights: 'You are very close to achieving this goal. Document your accomplishments for the review.', userId: user1.id },
      { title: 'Read 24 Books This Year', description: 'Read at least 2 books per month', category: 'Personal', targetDate: new Date('2025-12-31'), progress: 50, status: 'active', priority: 'low', milestones: ['Read 6 books', 'Read 12 books', 'Read 18 books', 'Read 24 books'], aiInsights: 'You are on pace! Consider audiobooks for commute time to maintain momentum.', userId: user1.id },
      { title: 'Launch Side Business', description: 'Start and launch an online consulting business', category: 'Business', targetDate: new Date('2025-09-01'), progress: 20, status: 'active', priority: 'medium', milestones: ['Business plan', 'Legal setup', 'Website launch', 'First client'], aiInsights: 'Focus on completing the business plan first. Consider starting with freelance projects.', userId: user1.id },
      { title: 'Lose 20 Pounds', description: 'Reach target weight through diet and exercise', category: 'Health', targetDate: new Date('2025-05-01'), progress: 35, status: 'active', priority: 'high', milestones: ['Lose 5 lbs', 'Lose 10 lbs', 'Lose 15 lbs', 'Lose 20 lbs'], aiInsights: 'Good progress! Maintain consistency with meal prep and scheduled workouts.', userId: user1.id },
      { title: 'Master React and TypeScript', description: 'Become proficient in React and TypeScript development', category: 'Education', targetDate: new Date('2025-04-01'), progress: 65, status: 'active', priority: 'medium', milestones: ['Complete tutorial', 'Build 3 projects', 'Contribute to OSS', 'Pass assessment'], aiInsights: 'Strong foundation built. Start contributing to open source for real-world experience.', userId: user1.id },
      { title: 'Improve Public Speaking', description: 'Become confident in public speaking and presentations', category: 'Personal', targetDate: new Date('2025-07-01'), progress: 40, status: 'active', priority: 'medium', milestones: ['Join Toastmasters', '5 presentations', '10 presentations', 'Lead workshop'], aiInsights: 'Regular practice is key. Consider recording yourself to identify areas for improvement.', userId: user1.id },
      { title: 'Build Investment Portfolio', description: 'Create diversified investment portfolio with $50K', category: 'Finance', targetDate: new Date('2025-12-31'), progress: 25, status: 'active', priority: 'medium', milestones: ['Open accounts', 'Invest $15K', 'Invest $30K', 'Invest $50K'], aiInsights: 'Consider dollar-cost averaging to reduce risk. Review asset allocation quarterly.', userId: user1.id },
      { title: 'Complete Home Renovation', description: 'Renovate kitchen and bathroom', category: 'Home', targetDate: new Date('2025-08-01'), progress: 15, status: 'active', priority: 'low', milestones: ['Get quotes', 'Kitchen design', 'Kitchen done', 'Bathroom done'], aiInsights: 'Get at least 3 contractor quotes. Plan for 20% budget contingency.', userId: user1.id },
      { title: 'Meditate Daily for 1 Year', description: 'Establish consistent daily meditation practice', category: 'Wellness', targetDate: new Date('2025-12-31'), progress: 55, status: 'active', priority: 'medium', milestones: ['30 day streak', '90 day streak', '180 day streak', '365 day streak'], aiInsights: 'Great consistency! Try extending session length gradually for deeper practice.', userId: user1.id },
      { title: 'Earn AWS Certification', description: 'Pass AWS Solutions Architect certification exam', category: 'Career', targetDate: new Date('2025-06-15'), progress: 40, status: 'active', priority: 'high', milestones: ['Complete course', 'Practice exams', 'Review weak areas', 'Pass exam'], aiInsights: 'Focus on hands-on labs. Practice exams show networking as an area to improve.', userId: user1.id },
      { title: 'Plan Dream Vacation', description: 'Plan and save for 2-week European trip', category: 'Travel', targetDate: new Date('2025-09-01'), progress: 30, status: 'active', priority: 'low', milestones: ['Research destinations', 'Book flights', 'Book hotels', 'Final itinerary'], aiInsights: 'Start booking 6 months in advance for best rates. Consider shoulder season travel.', userId: user1.id },
      { title: 'Write a Novel', description: 'Complete first draft of fiction novel (80,000 words)', category: 'Creative', targetDate: new Date('2025-11-01'), progress: 10, status: 'active', priority: 'low', milestones: ['Outline done', '25K words', '50K words', '80K words'], aiInsights: 'Establish a daily writing routine. Even 500 words/day will get you there.', userId: user1.id },
      { title: 'Network More Actively', description: 'Attend 2 professional events monthly and grow LinkedIn network', category: 'Career', targetDate: new Date('2025-12-31'), progress: 45, status: 'active', priority: 'medium', milestones: ['10 events', '20 events', '500 connections', '1000 connections'], aiInsights: 'Quality over quantity. Follow up within 48 hours of meeting new contacts.', userId: user2.id },
    ],
  });
  console.log(`Created ${goals.count} goals`);

  // Seed Habits (15+ items)
  const habits = await prisma.habit.createMany({
    data: [
      { name: 'Morning Meditation', description: '10 minutes of guided meditation every morning', frequency: 'daily', category: 'Wellness', streak: 15, bestStreak: 30, totalCount: 120, lastCompleted: new Date(), reminder: '7:00 AM', status: 'active', aiSuggestions: 'Try extending to 15 minutes. Studies show longer sessions increase benefits.', userId: user1.id },
      { name: 'Exercise', description: 'At least 30 minutes of physical activity', frequency: 'daily', category: 'Health', streak: 8, bestStreak: 45, totalCount: 200, lastCompleted: new Date(), reminder: '6:00 AM', status: 'active', aiSuggestions: 'Mix up your routine with HIIT for better cardiovascular health.', userId: user1.id },
      { name: 'Read for 30 Minutes', description: 'Read non-fiction or educational content', frequency: 'daily', category: 'Learning', streak: 22, bestStreak: 60, totalCount: 180, lastCompleted: new Date(), reminder: '9:00 PM', status: 'active', aiSuggestions: 'Consider keeping a reading journal to improve retention.', userId: user1.id },
      { name: 'Drink 8 Glasses of Water', description: 'Stay hydrated throughout the day', frequency: 'daily', category: 'Health', streak: 5, bestStreak: 20, totalCount: 90, lastCompleted: new Date(), reminder: '8:00 AM', status: 'active', aiSuggestions: 'Use a water tracking app or marked water bottle for consistency.', userId: user1.id },
      { name: 'Practice Spanish', description: 'Complete Duolingo lessons and practice speaking', frequency: 'daily', category: 'Learning', streak: 45, bestStreak: 100, totalCount: 250, lastCompleted: new Date(), reminder: '12:00 PM', status: 'active', aiSuggestions: 'Add conversation practice with native speakers via language exchange apps.', userId: user1.id },
      { name: 'Journal Before Bed', description: 'Write about the day and plan for tomorrow', frequency: 'daily', category: 'Wellness', streak: 12, bestStreak: 28, totalCount: 85, lastCompleted: new Date(), reminder: '10:00 PM', status: 'active', aiSuggestions: 'Include gratitude entries. Research shows it improves sleep quality.', userId: user1.id },
      { name: 'No Social Media Before 10 AM', description: 'Start the day focused without digital distractions', frequency: 'daily', category: 'Productivity', streak: 3, bestStreak: 14, totalCount: 40, lastCompleted: new Date(), reminder: '6:30 AM', status: 'active', aiSuggestions: 'Consider using app blockers to make this easier to maintain.', userId: user1.id },
      { name: 'Weekly Meal Prep', description: 'Prepare healthy meals for the week ahead', frequency: 'weekly', category: 'Health', streak: 6, bestStreak: 12, totalCount: 30, lastCompleted: new Date(), reminder: 'Sunday 2:00 PM', status: 'active', aiSuggestions: 'Create a rotating menu of 8-10 recipes to reduce decision fatigue.', userId: user1.id },
      { name: 'Review Goals', description: 'Review and update progress on all active goals', frequency: 'weekly', category: 'Productivity', streak: 8, bestStreak: 20, totalCount: 45, lastCompleted: new Date(), reminder: 'Sunday 7:00 PM', status: 'active', aiSuggestions: 'Add visualization exercises when reviewing goals for better motivation.', userId: user1.id },
      { name: 'Call Family', description: 'Weekly call with parents or siblings', frequency: 'weekly', category: 'Relationships', streak: 10, bestStreak: 52, totalCount: 100, lastCompleted: new Date(), reminder: 'Saturday 11:00 AM', status: 'active', aiSuggestions: 'Consider video calls to strengthen connection.', userId: user1.id },
      { name: 'Deep Work Session', description: '2 hours of focused, uninterrupted work', frequency: 'daily', category: 'Productivity', streak: 7, bestStreak: 21, totalCount: 95, lastCompleted: new Date(), reminder: '9:00 AM', status: 'active', aiSuggestions: 'Use the Pomodoro technique with longer intervals (50/10) for deep work.', userId: user1.id },
      { name: 'Stretch/Yoga', description: '15 minutes of stretching or yoga practice', frequency: 'daily', category: 'Health', streak: 4, bestStreak: 18, totalCount: 60, lastCompleted: new Date(), reminder: '6:30 PM', status: 'active', aiSuggestions: 'Focus on hip flexors if you sit for work. They get tight quickly.', userId: user1.id },
      { name: 'Learn Something New', description: 'Watch educational video or take course lesson', frequency: 'daily', category: 'Learning', streak: 11, bestStreak: 35, totalCount: 150, lastCompleted: new Date(), reminder: '8:00 PM', status: 'active', aiSuggestions: 'Take notes while learning. Active engagement increases retention by 40%.', userId: user1.id },
      { name: 'Monthly Budget Review', description: 'Review spending and adjust budget categories', frequency: 'monthly', category: 'Finance', streak: 4, bestStreak: 8, totalCount: 10, lastCompleted: new Date(), reminder: '1st of month', status: 'active', aiSuggestions: 'Use the 50/30/20 rule as a starting framework for allocation.', userId: user1.id },
      { name: 'Clean/Organize Space', description: 'Tidy workspace and living area', frequency: 'daily', category: 'Productivity', streak: 6, bestStreak: 25, totalCount: 80, lastCompleted: new Date(), reminder: '5:00 PM', status: 'active', aiSuggestions: 'Try the 2-minute rule: if it takes less than 2 minutes, do it now.', userId: user1.id },
      { name: 'Practice Gratitude', description: 'Write down 3 things grateful for', frequency: 'daily', category: 'Wellness', streak: 20, bestStreak: 45, totalCount: 130, lastCompleted: new Date(), reminder: '7:30 AM', status: 'active', aiSuggestions: 'Be specific in gratitude entries. "Fresh coffee this morning" beats "coffee".', userId: user2.id },
    ],
  });
  console.log(`Created ${habits.count} habits`);

  // Seed Sessions (15+ items)
  const sessions = await prisma.session.createMany({
    data: [
      { title: 'Morning Productivity Block', duration: 120, notes: 'Completed 3 major tasks. Good focus until 10am, then minor interruptions.', category: 'Work', mood: 'Focused', productivity: 8, keyTakeaways: ['Deep work early is effective', 'Disable notifications', 'Take short breaks'], aiSummary: 'Highly productive session with strong morning focus. The early start and notification blocking significantly improved output. Consider scheduling complex tasks in this time window.', actionItems: ['Schedule more early deep work', 'Use website blocker during focus time'], userId: user1.id },
      { title: 'Weekly Team Meeting', duration: 60, notes: 'Discussed Q2 roadmap and resource allocation. Some tension about priorities.', category: 'Meetings', mood: 'Neutral', productivity: 6, keyTakeaways: ['Need clearer priority framework', 'Team wants more autonomy', 'Budget concerns raised'], aiSummary: 'Meeting revealed team alignment issues around priorities. Tension suggests need for clearer communication of strategic goals. Consider one-on-ones to address individual concerns.', actionItems: ['Create priority matrix', 'Schedule skip-level meetings', 'Share budget context'], userId: user1.id },
      { title: 'Learning: TypeScript Advanced', duration: 90, notes: 'Covered generics, utility types, and advanced patterns. Built sample project.', category: 'Learning', mood: 'Engaged', productivity: 9, keyTakeaways: ['Generics are powerful for reusability', 'Utility types save time', 'Practice with real projects'], aiSummary: 'Excellent learning session with high engagement. Practical application through sample project reinforced concepts. TypeScript generics mastery will improve code quality.', actionItems: ['Apply generics to current project', 'Review utility types documentation', 'Build type-safe API client'], userId: user1.id },
      { title: 'Client Strategy Call', duration: 45, notes: 'Presented Q1 results and proposed expansion plan. Client enthusiastic about phase 2.', category: 'Client', mood: 'Energized', productivity: 8, keyTakeaways: ['Client values data-driven approach', 'Budget approved for expansion', 'Timeline is aggressive'], aiSummary: 'Successful client interaction with positive outcome. Enthusiasm for expansion is promising but aggressive timeline requires careful planning. Prioritize resource allocation.', actionItems: ['Draft phase 2 project plan', 'Identify additional resources needed', 'Schedule weekly check-ins'], userId: user1.id },
      { title: 'Code Review Session', duration: 75, notes: 'Reviewed 5 PRs from junior devs. Found common patterns in issues.', category: 'Work', mood: 'Focused', productivity: 7, keyTakeaways: ['Error handling needs improvement', 'Testing coverage low', 'Documentation gaps'], aiSummary: 'Code review revealed systematic knowledge gaps in team. Patterns in issues suggest need for training session. Consider pair programming to address fundamentals.', actionItems: ['Create error handling guide', 'Set up testing workshop', 'Update code standards doc'], userId: user1.id },
      { title: 'Personal Project: AI Bot', duration: 180, notes: 'Made significant progress on NLP integration. Chatbot now handles 80% of queries.', category: 'Personal', mood: 'Excited', productivity: 9, keyTakeaways: ['OpenRouter API is flexible', 'Prompt engineering is key', 'Need better error handling'], aiSummary: 'Highly productive personal project session. NLP integration milestone achieved. Consider documenting this project for portfolio or blog post.', actionItems: ['Add conversation history', 'Improve error messages', 'Write blog post about learnings'], userId: user1.id },
      { title: 'One-on-One with Manager', duration: 30, notes: 'Discussed career growth and upcoming opportunities. Positive feedback on recent work.', category: 'Career', mood: 'Optimistic', productivity: 7, keyTakeaways: ['Promotion track looks good', 'Need more visibility projects', 'Conference speaking opportunity'], aiSummary: 'Encouraging career discussion with clear path forward. Manager support is strong. Focus on visibility projects to strengthen promotion case.', actionItems: ['Propose conference talk topic', 'Volunteer for cross-team project', 'Document achievements'], userId: user1.id },
      { title: 'Brainstorming: Product Features', duration: 60, notes: 'Generated 20+ ideas for next release. Narrowed to top 5 based on impact/effort.', category: 'Creative', mood: 'Creative', productivity: 8, keyTakeaways: ['AI integration most requested', 'Mobile experience needs work', 'Quick wins available'], aiSummary: 'Productive ideation session with strong output. Prioritization framework worked well. AI integration theme suggests market direction.', actionItems: ['Create detailed specs for top 3', 'Research AI integration options', 'Survey users on mobile pain points'], userId: user1.id },
      { title: 'Morning Exercise', duration: 45, notes: 'HIIT workout followed by stretching. Felt energized for the day.', category: 'Health', mood: 'Energized', productivity: 8, keyTakeaways: ['Morning exercise improves focus', 'HIIT is time-efficient', 'Stretching prevents soreness'], aiSummary: 'Effective workout session contributing to daily energy levels. Consistent morning exercise correlates with higher productivity scores. Maintain this routine.', actionItems: ['Increase HIIT intensity gradually', 'Add yoga on rest days', 'Track energy levels'], userId: user1.id },
      { title: 'Budget Planning Session', duration: 90, notes: 'Reviewed Q1 spending, adjusted categories, planned for upcoming expenses.', category: 'Finance', mood: 'Focused', productivity: 7, keyTakeaways: ['Food spending over budget', 'Subscriptions need audit', 'Emergency fund on track'], aiSummary: 'Thorough financial review with actionable insights. Food category overspend is a recurring pattern. Meal planning could reduce this significantly.', actionItems: ['Cancel unused subscriptions', 'Start meal planning', 'Automate emergency fund transfers'], userId: user1.id },
      { title: 'Networking Event', duration: 120, notes: 'Tech meetup downtown. Made 5 meaningful connections, exchanged info with 12 people.', category: 'Networking', mood: 'Social', productivity: 7, keyTakeaways: ['Industry moving to AI', 'Hiring market competitive', 'Good speaking opportunity identified'], aiSummary: 'Successful networking event with quality connections. Follow-up is crucial within 48 hours. Speaking opportunity could increase visibility significantly.', actionItems: ['Send follow-up emails', 'Connect on LinkedIn', 'Submit speaker proposal'], userId: user1.id },
      { title: 'Writing: Blog Post Draft', duration: 90, notes: 'Completed first draft of technical tutorial. Needs editing and screenshots.', category: 'Creative', mood: 'Focused', productivity: 8, keyTakeaways: ['Outline first is effective', 'Examples take longer than expected', 'Need better screenshot tool'], aiSummary: 'Good progress on content creation. First draft completion is the hardest part. Schedule editing session separately for fresh perspective.', actionItems: ['Add code examples', 'Take screenshots', 'Schedule editing session'], userId: user1.id },
      { title: 'Meditation and Reflection', duration: 30, notes: 'Guided meditation followed by journaling about weekly progress.', category: 'Wellness', mood: 'Calm', productivity: 6, keyTakeaways: ['Stress levels decreasing', 'Sleep quality improved', 'Need more mindful breaks'], aiSummary: 'Valuable reflection session contributing to overall wellbeing. Regular meditation practice showing positive effects. Consider adding brief midday session.', actionItems: ['Try midday 5-min meditation', 'Continue journaling streak', 'Explore new meditation styles'], userId: user1.id },
      { title: 'System Architecture Review', duration: 120, notes: 'Analyzed current architecture, identified bottlenecks, proposed improvements.', category: 'Work', mood: 'Analytical', productivity: 9, keyTakeaways: ['Database queries need optimization', 'Caching layer would help', 'Microservices migration complex'], aiSummary: 'Thorough technical analysis with clear improvement path. Database optimization should yield quick wins. Microservices migration needs careful planning.', actionItems: ['Implement query optimization', 'Research caching solutions', 'Create migration roadmap'], userId: user1.id },
      { title: 'Language Practice: Spanish', duration: 45, notes: 'Conversation practice with language partner. Discussed travel and hobbies.', category: 'Learning', mood: 'Engaged', productivity: 7, keyTakeaways: ['Verb conjugation improving', 'Vocabulary gaps in food terms', 'Confidence increasing'], aiSummary: 'Productive language practice with native speaker. Conversation skills developing well. Focus on specific vocabulary domains to fill gaps.', actionItems: ['Study food vocabulary', 'Practice past tense more', 'Schedule next session'], userId: user2.id },
    ],
  });
  console.log(`Created ${sessions.count} sessions`);

  // Seed Decisions (15+ items)
  const decisions = await prisma.decision.createMany({
    data: [
      { title: 'Should I Accept the Job Offer?', description: 'Received offer from competitor with 20% salary increase but less interesting work', category: 'Career', options: ['Accept the offer', 'Negotiate current role', 'Decline and stay'], pros: ['Higher salary', 'New challenges', 'Better title'], cons: ['Less interesting work', 'Unknown culture', 'Longer commute'], urgency: 'high', importance: 'high', status: 'pending', aiAnalysis: 'This is a significant career decision. While the salary increase is attractive, consider long-term career trajectory. The work content and learning opportunities often matter more than immediate compensation. Consider negotiating with current employer first.', userId: user1.id },
      { title: 'Buy vs Rent a House', description: 'Considering whether to purchase first home or continue renting', category: 'Finance', options: ['Buy a house', 'Continue renting', 'Buy a condo'], pros: ['Building equity', 'Stability', 'Tax benefits'], cons: ['Large down payment', 'Maintenance costs', 'Less flexibility'], urgency: 'medium', importance: 'high', status: 'pending', aiAnalysis: 'This decision depends heavily on your timeline and local market. If planning to stay 5+ years, buying often makes sense. Consider total cost of ownership including maintenance, taxes, and opportunity cost of down payment.', userId: user1.id },
      { title: 'Which Technology Stack for New Project?', description: 'Choosing between React/Node and Vue/Python for new web application', category: 'Technical', options: ['React + Node.js', 'Vue + Python', 'React + Python'], pros: ['React has larger ecosystem', 'Python better for AI/ML', 'Team expertise'], cons: ['Context switching', 'Learning curve', 'Maintenance burden'], urgency: 'high', importance: 'medium', status: 'resolved', finalChoice: 'React + Python', aiAnalysis: 'Consider team expertise and project requirements. React + Python combination offers flexibility: React for robust frontend ecosystem, Python for potential AI/ML features. This is a solid choice for modern applications.', userId: user1.id },
      { title: 'Pursue MBA or Professional Certifications?', description: 'Deciding between full MBA program or focused professional certifications', category: 'Education', options: ['Full-time MBA', 'Part-time MBA', 'Professional certifications'], pros: ['MBA opens doors', 'Certifications are focused', 'Part-time allows working'], cons: ['MBA expensive', 'Time commitment', 'Certifications less prestigious'], urgency: 'low', importance: 'high', status: 'pending', aiAnalysis: 'Consider your specific career goals. MBA is valuable for career pivots or leadership roles. Certifications are more cost-effective for specific skill gaps. Part-time MBA offers good balance if employer supports.', userId: user1.id },
      { title: 'Relocate for Partner\'s Job?', description: 'Partner received dream job offer in another city', category: 'Personal', options: ['Relocate together', 'Try long-distance', 'Ask partner to decline'], pros: ['Support partner', 'New opportunities', 'Adventure'], cons: ['Leave current job', 'Away from family', 'Cost of moving'], urgency: 'high', importance: 'high', status: 'pending', aiAnalysis: 'Relationship decisions require weighing both partners needs. Consider remote work options for your role. The new city might offer unexpected opportunities. Have open conversation about expectations and timeline.', userId: user1.id },
      { title: 'Start Side Business or Focus on Career?', description: 'Considering launching consulting business while employed full-time', category: 'Career', options: ['Start side business', 'Focus on promotion', 'Do both part-time'], pros: ['Additional income', 'Build something own', 'Learn entrepreneurship'], cons: ['Time intensive', 'Potential conflict', 'Burnout risk'], urgency: 'low', importance: 'medium', status: 'pending', aiAnalysis: 'Starting a side business while employed is manageable with clear boundaries. Check employment contract for restrictions. Start small to validate idea before major time investment. Focus on promotion might offer faster financial return.', userId: user1.id },
      { title: 'Which Car to Buy?', description: 'Choosing between Tesla Model 3, Toyota Camry Hybrid, or used luxury car', category: 'Finance', options: ['Tesla Model 3', 'Toyota Camry Hybrid', 'Used BMW 3 Series'], pros: ['Tesla: tech and savings', 'Toyota: reliability', 'BMW: luxury for less'], cons: ['Tesla: expensive', 'Toyota: boring', 'BMW: maintenance'], urgency: 'medium', importance: 'medium', status: 'resolved', finalChoice: 'Tesla Model 3', aiAnalysis: 'Given rising fuel costs and your tech-forward preferences, Tesla Model 3 offers best total cost of ownership. Lower maintenance and fuel savings offset higher purchase price over 5 years. Good choice for your situation.', userId: user1.id },
      { title: 'Have Another Child?', description: 'Considering expanding family with second child', category: 'Personal', options: ['Have another child', 'Wait 2 more years', 'One child is enough'], pros: ['Sibling for first child', 'Younger parents', 'Complete family'], cons: ['Financial strain', 'Career impact', 'Less time per child'], urgency: 'low', importance: 'high', status: 'pending', aiAnalysis: 'This deeply personal decision should consider financial stability, career timing, and emotional readiness. There is no wrong answer. Consider discussing with a counselor to explore all feelings about this decision.', userId: user1.id },
      { title: 'Investment Strategy: Aggressive or Conservative?', description: 'Rebalancing portfolio and considering risk tolerance', category: 'Finance', options: ['80/20 stocks/bonds', '60/40 stocks/bonds', '40/60 stocks/bonds'], pros: ['Higher returns potential', 'Balanced approach', 'Lower volatility'], cons: ['Higher risk', 'Moderate returns', 'Inflation risk'], urgency: 'medium', importance: 'medium', status: 'resolved', finalChoice: '60/40 stocks/bonds', aiAnalysis: 'At your age and with stable income, 60/40 offers good balance of growth and stability. This allocation historically provides reasonable returns while limiting downside risk. Rebalance annually.', userId: user1.id },
      { title: 'Work From Home or Return to Office?', description: 'Company offering choice between full remote and hybrid', category: 'Career', options: ['Full remote', 'Hybrid (3 days office)', 'Full office'], pros: ['Remote: flexibility', 'Hybrid: balance', 'Office: collaboration'], cons: ['Remote: isolation', 'Hybrid: commute days', 'Office: long commute'], urgency: 'high', importance: 'medium', status: 'resolved', finalChoice: 'Hybrid (3 days office)', aiAnalysis: 'Hybrid model offers best of both worlds: in-person collaboration for key meetings while maintaining flexibility. This choice supports both productivity and work-life balance. Good decision.', userId: user1.id },
      { title: 'Which Vacation: Beach or Adventure?', description: 'Planning annual vacation between relaxing beach resort or active adventure trip', category: 'Personal', options: ['Beach resort (Maldives)', 'Adventure (Patagonia hiking)', 'Mix (Costa Rica)'], pros: ['Beach: relaxation', 'Adventure: memories', 'Mix: variety'], cons: ['Beach: expensive', 'Adventure: physical demand', 'Mix: more planning'], urgency: 'low', importance: 'low', status: 'pending', aiAnalysis: 'Given your stress levels this year, relaxation might be more beneficial. However, Costa Rica offers good balance with beaches and optional adventures. Consider your energy levels closer to trip date.', userId: user1.id },
      { title: 'Switch to New Tech Lead Role?', description: 'Offered tech lead position with more responsibility but same pay initially', category: 'Career', options: ['Accept tech lead role', 'Stay as senior developer', 'Negotiate terms'], pros: ['Leadership experience', 'Career growth', 'More influence'], cons: ['More stress', 'Same pay initially', 'Less coding time'], urgency: 'medium', importance: 'high', status: 'pending', aiAnalysis: 'Tech lead experience is valuable for long-term career progression. While pay is same initially, leadership roles typically lead to faster compensation growth. Consider negotiating a 6-month review for salary adjustment.', userId: user1.id },
      { title: 'Keep or Cancel Gym Membership?', description: 'Expensive gym membership used only 2x per month', category: 'Finance', options: ['Keep membership', 'Cancel and home workout', 'Downgrade to basic'], pros: ['Good equipment', 'Save money', 'Still have access'], cons: ['Expensive if unused', 'Need discipline', 'Limited equipment'], urgency: 'low', importance: 'low', status: 'resolved', finalChoice: 'Cancel and home workout', aiAnalysis: 'With only 2 visits per month, home workouts offer better ROI. Invest savings in quality home equipment. You can always rejoin if habits change. Good financial decision.', userId: user1.id },
      { title: 'Learn New Language or Deepen Existing Skills?', description: 'Should I start Japanese or continue advancing Spanish?', category: 'Education', options: ['Start Japanese', 'Focus on Spanish fluency', 'Do both casually'], pros: ['Japanese: new opportunities', 'Spanish: near fluency', 'Both: variety'], cons: ['Japanese: harder', 'Spanish: plateau risk', 'Both: slower progress'], urgency: 'low', importance: 'low', status: 'pending', aiAnalysis: 'Reaching fluency in one language is more valuable than basics in two. Continue Spanish to B2/C1 level first. You can start Japanese later with language learning skills already developed.', userId: user1.id },
      { title: 'Attend Conference In-Person or Virtual?', description: 'Major industry conference offers both options', category: 'Career', options: ['Attend in-person', 'Virtual attendance', 'Skip this year'], pros: ['In-person: networking', 'Virtual: cheaper', 'Skip: save time'], cons: ['In-person: expensive', 'Virtual: less impact', 'Skip: miss content'], urgency: 'medium', importance: 'medium', status: 'pending', aiAnalysis: 'In-person attendance offers significantly better networking ROI. The connections made at conferences often lead to opportunities that far exceed the cost. Prioritize key sessions and networking events.', userId: user2.id },
    ],
  });
  console.log(`Created ${decisions.count} decisions`);

  // Seed Homework (15+ items)
  const homework = await prisma.homework.createMany({
    data: [
      { subject: 'Mathematics', topic: 'Quadratic Equations', gradeLevel: 'High School', difficulty: 'medium', questions: ['Solve x² + 5x + 6 = 0', 'Factor x² - 9', 'Find the vertex of y = x² - 4x + 3', 'Solve 2x² - 8 = 0', 'Complete the square for x² + 6x + 5'], answers: ['x = -2 or x = -3', '(x+3)(x-3)', '(2, -1)', 'x = ±2', '(x+3)² - 4'], hints: ['Use factoring or quadratic formula', 'Difference of squares pattern', 'Use vertex formula -b/2a', 'Isolate x² first', 'Add and subtract (b/2)²'], explanation: 'Quadratic equations are polynomial equations of degree 2. They can be solved by factoring, completing the square, or using the quadratic formula.', aiGenerated: true, status: 'active', userId: user1.id },
      { subject: 'Physics', topic: 'Newton\'s Laws of Motion', gradeLevel: 'High School', difficulty: 'medium', questions: ['State Newton\'s First Law', 'A 5kg object accelerates at 2m/s². What is the force?', 'Explain action-reaction pairs', 'Calculate net force: 10N right, 3N left', 'What is inertia?'], answers: ['An object at rest stays at rest unless acted upon by a force', 'F = ma = 5 × 2 = 10N', 'Every action has an equal and opposite reaction', '7N to the right', 'Resistance to change in motion'], hints: ['Think about objects in space', 'Use F = ma formula', 'Think about pushing a wall', 'Subtract opposing forces', 'Related to mass'], explanation: 'Newton\'s three laws form the foundation of classical mechanics and describe how objects move in response to forces.', aiGenerated: true, status: 'active', userId: user1.id },
      { subject: 'English', topic: 'Essay Writing: Thesis Statements', gradeLevel: 'High School', difficulty: 'medium', questions: ['What makes a strong thesis statement?', 'Identify the thesis in the sample paragraph', 'Rewrite this weak thesis to be stronger', 'Write a thesis for: effects of social media', 'Where should thesis appear in essay?'], answers: ['Specific, arguable, clear position', 'Second sentence of paragraph', 'Sample improved thesis provided', 'Social media has fundamentally changed how teenagers form relationships, creating both opportunities and challenges for social development.', 'End of introduction paragraph'], hints: ['Should be debatable', 'Look for the main argument', 'Add specific details', 'Take a clear stance', 'Think about essay structure'], explanation: 'A thesis statement is the central argument of an essay. It should be specific, arguable, and provide a roadmap for the essay.', aiGenerated: true, status: 'active', userId: user1.id },
      { subject: 'Chemistry', topic: 'Balancing Chemical Equations', gradeLevel: 'High School', difficulty: 'hard', questions: ['Balance: H₂ + O₂ → H₂O', 'Balance: Fe + O₂ → Fe₂O₃', 'Balance: CH₄ + O₂ → CO₂ + H₂O', 'What is the law of conservation of mass?', 'Balance: Na + Cl₂ → NaCl'], answers: ['2H₂ + O₂ → 2H₂O', '4Fe + 3O₂ → 2Fe₂O₃', 'CH₄ + 2O₂ → CO₂ + 2H₂O', 'Mass cannot be created or destroyed in a chemical reaction', '2Na + Cl₂ → 2NaCl'], hints: ['Count atoms on each side', 'Start with the most complex molecule', 'Balance C first, then H, then O', 'Think about atomic conservation', 'Cl₂ means 2 chlorine atoms'], explanation: 'Balancing equations ensures the same number of atoms of each element on both sides, following the law of conservation of mass.', aiGenerated: true, status: 'active', userId: user1.id },
      { subject: 'History', topic: 'World War II Causes', gradeLevel: 'High School', difficulty: 'medium', questions: ['What was the Treaty of Versailles?', 'How did the Great Depression contribute to WWII?', 'Describe Hitler\'s rise to power', 'What was appeasement policy?', 'When and why did WWII begin?'], answers: ['Peace treaty ending WWI with harsh terms for Germany', 'Economic hardship made extremist ideologies appealing', 'Used propaganda and economic promises during crisis', 'Allowing German expansion to avoid conflict', 'September 1939, Germany invaded Poland'], hints: ['End of WWI document', 'Think about economic desperation', 'Consider 1930s Germany conditions', 'Think Chamberlain and Munich', 'Think Poland invasion'], explanation: 'WWII had multiple causes including the punitive Treaty of Versailles, economic instability, and the rise of fascism in Europe.', aiGenerated: true, status: 'active', userId: user1.id },
      { subject: 'Biology', topic: 'Cell Division: Mitosis', gradeLevel: 'High School', difficulty: 'medium', questions: ['Name the 4 phases of mitosis', 'What happens during prophase?', 'How does cytokinesis differ in plant/animal cells?', 'What is the purpose of mitosis?', 'Compare mitosis to meiosis'], answers: ['Prophase, Metaphase, Anaphase, Telophase', 'Chromosomes condense, nuclear envelope breaks down', 'Animal: cleavage furrow; Plant: cell plate forms', 'Growth, repair, and asexual reproduction', 'Mitosis: 2 identical cells; Meiosis: 4 different cells'], hints: ['PMAT mnemonic', 'First visible changes', 'Think about cell wall', 'Why do cells divide?', 'Think about genetic variation'], explanation: 'Mitosis is the process of cell division that produces two identical daughter cells for growth and repair.', aiGenerated: true, status: 'active', userId: user1.id },
      { subject: 'Mathematics', topic: 'Trigonometry Basics', gradeLevel: 'High School', difficulty: 'hard', questions: ['Define sine, cosine, and tangent', 'Find sin(30°)', 'Solve: sin(x) = 0.5, find x', 'What is the Pythagorean identity?', 'Find cos(45°)'], answers: ['sin=opp/hyp, cos=adj/hyp, tan=opp/adj', '0.5 or 1/2', 'x = 30° or 150°', 'sin²θ + cos²θ = 1', '√2/2 or approximately 0.707'], hints: ['SOH-CAH-TOA', 'Special angle values', 'Consider unit circle', 'Relates sin and cos', 'Special 45-45-90 triangle'], explanation: 'Trigonometry deals with relationships between angles and sides of triangles, essential for physics and engineering.', aiGenerated: true, status: 'active', userId: user1.id },
      { subject: 'Computer Science', topic: 'Introduction to Algorithms', gradeLevel: 'High School', difficulty: 'medium', questions: ['What is an algorithm?', 'Write pseudocode for finding max in array', 'What is Big O notation?', 'Compare linear vs binary search', 'What is a sorting algorithm?'], answers: ['Step-by-step procedure to solve a problem', 'Set max to first element, loop through comparing each', 'Describes algorithm efficiency/growth rate', 'Linear: O(n); Binary: O(log n) but needs sorted array', 'Algorithm that arranges elements in order'], hints: ['Like a recipe', 'Track current maximum', 'How time grows with input size', 'Think about phone book search', 'Examples: bubble, merge, quick sort'], explanation: 'Algorithms are fundamental to computer science, providing systematic approaches to solving computational problems efficiently.', aiGenerated: true, status: 'active', userId: user1.id },
      { subject: 'Spanish', topic: 'Past Tense Conjugation', gradeLevel: 'High School', difficulty: 'medium', questions: ['Conjugate "hablar" in preterite (yo)', 'What is the difference between preterite and imperfect?', 'Conjugate "comer" in preterite (ellos)', 'Translate: "I went to the store yesterday"', 'List 3 irregular preterite verbs'], answers: ['hablé', 'Preterite: completed actions; Imperfect: ongoing/habitual past', 'comieron', 'Fui a la tienda ayer', 'ir/ser (fui), hacer (hice), tener (tuve)'], hints: ['-ar verbs drop -ar, add -é', 'Think specific vs ongoing', '-er verbs: -ieron ending for ellos', 'ir is irregular in past', 'Most common irregulars'], explanation: 'Spanish has two main past tenses: preterite for completed actions and imperfect for ongoing or habitual past actions.', aiGenerated: true, status: 'active', userId: user1.id },
      { subject: 'Geography', topic: 'Climate Zones', gradeLevel: 'Middle School', difficulty: 'easy', questions: ['Name the 5 main climate zones', 'What causes different climate zones?', 'Describe tropical climate characteristics', 'Where are polar zones located?', 'What is a temperate climate?'], answers: ['Tropical, Dry, Temperate, Continental, Polar', 'Latitude, elevation, and distance from water', 'Hot year-round, high rainfall, near equator', 'Arctic (North Pole) and Antarctic (South Pole)', 'Moderate temperatures, distinct seasons'], hints: ['Think latitude bands', 'Sun angle and geography', 'Think rainforests', 'Extreme north and south', 'Middle latitudes'], explanation: 'Climate zones are determined by latitude, elevation, and proximity to water bodies, creating distinct weather patterns.', aiGenerated: true, status: 'active', userId: user1.id },
      { subject: 'Art', topic: 'Color Theory Basics', gradeLevel: 'Middle School', difficulty: 'easy', questions: ['What are the primary colors?', 'How do you make secondary colors?', 'What are complementary colors?', 'Define warm and cool colors', 'What is a color wheel?'], answers: ['Red, yellow, blue', 'Mix two primary colors together', 'Colors opposite on the color wheel', 'Warm: red/orange/yellow; Cool: blue/green/purple', 'Circular diagram showing color relationships'], hints: ['Cannot be mixed from other colors', 'Red+yellow=?', 'Think opposite sides', 'Think fire vs ice', 'Circular arrangement'], explanation: 'Color theory is fundamental to visual arts, helping artists understand how colors interact and create visual harmony.', aiGenerated: true, status: 'active', userId: user1.id },
      { subject: 'Economics', topic: 'Supply and Demand', gradeLevel: 'High School', difficulty: 'medium', questions: ['Define the law of demand', 'What shifts the supply curve?', 'What is equilibrium price?', 'How does a price ceiling affect markets?', 'Define elasticity of demand'], answers: ['As price increases, quantity demanded decreases', 'Production costs, technology, number of sellers', 'Price where supply equals demand', 'Creates shortage if below equilibrium', 'How much quantity demanded changes with price'], hints: ['Inverse relationship', 'What affects producers?', 'Where curves intersect', 'Think rent control', 'Percentage change comparison'], explanation: 'Supply and demand are fundamental economic concepts that explain how prices are determined in markets.', aiGenerated: true, status: 'active', userId: user1.id },
      { subject: 'Literature', topic: 'Shakespeare: Romeo and Juliet', gradeLevel: 'High School', difficulty: 'medium', questions: ['What is the main conflict in the play?', 'Explain the significance of the balcony scene', 'Who is responsible for the deaths?', 'What literary devices does Shakespeare use?', 'What is the theme of fate vs free will?'], answers: ['Family feud between Montagues and Capulets', 'Romeo and Juliet declare love despite family hatred', 'Multiple factors: families, Friar Lawrence, fate', 'Metaphor, foreshadowing, dramatic irony, oxymoron', 'Characters choices constrained by destiny'], hints: ['Think family rivalry', 'Where they confess love', 'Consider all contributing factors', 'Think figurative language', 'Star-crossed lovers concept'], explanation: 'Romeo and Juliet explores themes of love, fate, and conflict through Shakespeare\'s masterful use of language and dramatic structure.', aiGenerated: true, status: 'active', userId: user1.id },
      { subject: 'Psychology', topic: 'Classical Conditioning', gradeLevel: 'High School', difficulty: 'medium', questions: ['Who developed classical conditioning theory?', 'Explain Pavlov\'s dog experiment', 'Define unconditioned stimulus', 'What is extinction in conditioning?', 'Give a real-life example of classical conditioning'], answers: ['Ivan Pavlov', 'Dogs learned to salivate at bell sound paired with food', 'Stimulus that naturally triggers response', 'Gradual weakening of conditioned response', 'Phone notification sound causing excitement'], hints: ['Russian physiologist', 'Food and bell association', 'No learning needed', 'When CS presented alone repeatedly', 'Think everyday associations'], explanation: 'Classical conditioning is a learning process where a neutral stimulus becomes associated with a meaningful stimulus to trigger a response.', aiGenerated: true, status: 'active', userId: user1.id },
      { subject: 'Music Theory', topic: 'Reading Sheet Music', gradeLevel: 'Middle School', difficulty: 'easy', questions: ['What are the lines of the treble clef?', 'What does a sharp symbol mean?', 'How many beats in a whole note?', 'What is tempo?', 'Define dynamics in music'], answers: ['E, G, B, D, F (Every Good Boy Does Fine)', 'Raise the note by half step', '4 beats (in 4/4 time)', 'Speed of the music', 'Volume/loudness of music'], hints: ['Use mnemonic device', 'Think higher pitch', 'Longest basic note value', 'Fast or slow', 'Piano means soft'], explanation: 'Sheet music is a written representation of music using notes, symbols, and markings to guide performance.', aiGenerated: true, status: 'active', userId: user2.id },
    ],
  });
  console.log(`Created ${homework.count} homework items`);

  // Seed Moods (15+ items)
  const moods = await prisma.mood.createMany({
    data: [
      { rating: 8, emotion: 'Happy', notes: 'Great day at work, completed major project milestone', factors: ['Work success', 'Good weather', 'Exercise'], activities: ['Working', 'Running', 'Socializing'], energy: 8, stress: 3, sleep: 7, aiAnalysis: 'Your mood correlates strongly with work accomplishments and physical activity. The combination of exercise and meaningful work progress creates positive momentum. Maintain this balance.', suggestions: ['Continue daily exercise routine', 'Celebrate small wins more', 'Keep work-life balance'], userId: user1.id },
      { rating: 6, emotion: 'Content', notes: 'Normal day, nothing special but nothing bad either', factors: ['Routine', 'Stable work', 'Quiet evening'], activities: ['Working', 'Reading', 'Cooking'], energy: 6, stress: 4, sleep: 7, aiAnalysis: 'Baseline contentment is a healthy state. Your consistent routines contribute to stability. Consider adding small positive experiences to elevate from content to happy.', suggestions: ['Try something new today', 'Connect with a friend', 'Plan something to look forward to'], userId: user1.id },
      { rating: 4, emotion: 'Anxious', notes: 'Worried about upcoming presentation, had trouble focusing', factors: ['Work pressure', 'Deadline stress', 'Poor sleep'], activities: ['Working', 'Worrying', 'Preparing presentation'], energy: 5, stress: 8, sleep: 5, aiAnalysis: 'Anxiety before presentations is common. Poor sleep is both a symptom and amplifier of anxiety. Breaking the cycle requires addressing sleep first. Preparation can also reduce anxiety.', suggestions: ['Practice presentation aloud', 'Deep breathing exercises', 'Prioritize sleep tonight', 'Limit caffeine'], userId: user1.id },
      { rating: 9, emotion: 'Excited', notes: 'Received promotion news! Celebrating with family tonight', factors: ['Career success', 'Recognition', 'Family support'], activities: ['Working', 'Celebrating', 'Dining out'], energy: 9, stress: 2, sleep: 7, aiAnalysis: 'Major life achievements create peak emotional experiences. Family celebration amplifies positive emotions. Savor this moment and create lasting memories.', suggestions: ['Write about this experience', 'Share gratitude with supporters', 'Set new goals'], userId: user1.id },
      { rating: 3, emotion: 'Frustrated', notes: 'Technical issues all day, lost 2 hours of work', factors: ['Tech problems', 'Lost productivity', 'Interruptions'], activities: ['Troubleshooting', 'Meetings', 'Rework'], energy: 4, stress: 7, sleep: 6, aiAnalysis: 'Technical setbacks are frustrating but temporary. Lost work compounds stress through wasted effort feelings. Building better backup habits can prevent future frustration.', suggestions: ['Take a break from screen', 'Auto-save documents', 'Deep breathing', 'Tomorrow is new day'], userId: user1.id },
      { rating: 7, emotion: 'Calm', notes: 'Peaceful weekend, meditation and nature walk', factors: ['Rest', 'Nature', 'Mindfulness'], activities: ['Meditating', 'Walking', 'Resting'], energy: 7, stress: 2, sleep: 8, aiAnalysis: 'Weekend recovery with nature and meditation is highly beneficial. This combination effectively reduces cortisol and improves baseline mood. Schedule these activities regularly.', suggestions: ['Make nature walks weekly habit', 'Morning meditation daily', 'Protect weekend rest time'], userId: user1.id },
      { rating: 5, emotion: 'Tired', notes: 'Long week catching up to me, low energy all day', factors: ['Accumulated fatigue', 'Busy week', 'Poor diet'], activities: ['Working', 'Resting', 'Light tasks'], energy: 3, stress: 5, sleep: 6, aiAnalysis: 'Accumulated fatigue indicates recovery deficit. Your energy level suggests need for strategic rest, not just sleep. Consider active recovery like gentle movement and nutrition focus.', suggestions: ['Early bedtime tonight', 'Healthy meal prep', 'Light exercise only', 'Limit screen time'], userId: user1.id },
      { rating: 8, emotion: 'Grateful', notes: 'Family video call, reminded of support system', factors: ['Family connection', 'Social support', 'Perspective'], activities: ['Video calling', 'Sharing stories', 'Laughing'], energy: 7, stress: 2, sleep: 7, aiAnalysis: 'Social connection with family significantly boosts mood. Gratitude and perspective are powerful mood regulators. Regular family contact should be prioritized.', suggestions: ['Schedule regular family calls', 'Express gratitude directly', 'Share positive updates'], userId: user1.id },
      { rating: 2, emotion: 'Sad', notes: 'Missing friend who moved away, feeling lonely', factors: ['Loneliness', 'Change', 'Missing connection'], activities: ['Reflecting', 'Looking at photos', 'Quiet time'], energy: 3, stress: 4, sleep: 5, aiAnalysis: 'Sadness from losing proximity to friends is valid grief. This emotion needs acknowledgment, not fixing. Consider maintaining connection through scheduled calls and visits.', suggestions: ['Schedule call with friend', 'Plan future visit', 'Join local group', 'Be patient with yourself'], userId: user1.id },
      { rating: 7, emotion: 'Motivated', notes: 'Started new learning project, excited about progress', factors: ['New challenge', 'Learning', 'Progress visible'], activities: ['Coding', 'Learning', 'Building'], energy: 8, stress: 3, sleep: 7, aiAnalysis: 'New projects create engagement and motivation. Visible progress is key to maintaining this state. Break larger goals into smaller milestones to sustain momentum.', suggestions: ['Set daily learning goals', 'Document progress', 'Share what you learn'], userId: user1.id },
      { rating: 6, emotion: 'Neutral', notes: 'Average day, went through the motions', factors: ['Routine', 'No highlights', 'No lowlights'], activities: ['Working', 'Commuting', 'Chores'], energy: 5, stress: 4, sleep: 7, aiAnalysis: 'Neutral days are part of normal emotional range. However, too many may indicate need for novelty or challenge. Consider adding small positive activities to daily routine.', suggestions: ['Try new lunch spot', 'Call a friend', 'Start small project', 'Change up routine'], userId: user1.id },
      { rating: 9, emotion: 'Joyful', notes: 'Perfect day: sunshine, friends, and good food', factors: ['Social connection', 'Perfect weather', 'Great food'], activities: ['Brunch', 'Park hangout', 'Games'], energy: 9, stress: 1, sleep: 8, aiAnalysis: 'This represents an ideal combination of social connection, environment, and sensory pleasure. These peak experiences are memorable and restorative. Plan similar days regularly.', suggestions: ['Schedule monthly friend gatherings', 'More outdoor activities', 'Savor these moments'], userId: user1.id },
      { rating: 4, emotion: 'Overwhelmed', notes: 'Too many deadlines, feeling underwater', factors: ['Multiple deadlines', 'High workload', 'Time pressure'], activities: ['Multitasking', 'Meetings', 'Rushing'], energy: 5, stress: 9, sleep: 5, aiAnalysis: 'Overwhelm signals need for prioritization and boundaries. High stress with moderate energy is unsustainable. Consider what can be delegated, delayed, or dropped.', suggestions: ['List and prioritize tasks', 'Ask for deadline extension', 'Delegate if possible', 'Focus on one thing at a time'], userId: user1.id },
      { rating: 7, emotion: 'Proud', notes: 'Received positive feedback on project from senior leadership', factors: ['Recognition', 'Achievement', 'Validation'], activities: ['Presenting', 'Receiving feedback', 'Team meeting'], energy: 7, stress: 3, sleep: 7, aiAnalysis: 'External recognition validates internal effort. Pride from achievement is healthy and motivating. Use this positive feedback to build confidence for future challenges.', suggestions: ['Document the achievement', 'Thank your team', 'Set next challenging goal'], userId: user1.id },
      { rating: 5, emotion: 'Bored', notes: 'Repetitive tasks all day, craving something new', factors: ['Monotony', 'Lack of challenge', 'Routine fatigue'], activities: ['Administrative tasks', 'Meetings', 'Data entry'], energy: 5, stress: 3, sleep: 7, aiAnalysis: 'Boredom often signals underutilization of skills or lack of autonomy. This is an opportunity to seek new challenges or approach routine tasks differently.', suggestions: ['Request new project', 'Learn new skill', 'Gamify boring tasks', 'Take creative break'], userId: user1.id },
      { rating: 8, emotion: 'Peaceful', notes: 'Morning yoga, quiet afternoon, evening reading', factors: ['Self-care', 'Solitude', 'Mindfulness'], activities: ['Yoga', 'Reading', 'Journaling'], energy: 7, stress: 1, sleep: 8, aiAnalysis: 'Intentional peace through self-care activities creates deep restoration. This day demonstrates healthy solo time usage. Balance social and solitary time for optimal wellbeing.', suggestions: ['Make this a weekly ritual', 'Protect quiet time', 'Continue journaling practice'], userId: user2.id },
    ],
  });
  console.log(`Created ${moods.count} mood entries`);

  // Seed Predictions (15+ items)
  const predictions = await prisma.prediction.createMany({
    data: [
      { title: 'Q2 Sales Performance', description: 'Predicting sales team will exceed quarterly targets', category: 'Business', scenario: 'New product launch combined with improved sales processes', factors: ['New product launch', 'Sales training completed', 'Market demand strong'], probability: 75, timeframe: 'Q2 2025', confidence: 'high', aiPrediction: 'Based on the factors provided, there is a strong likelihood of exceeding Q2 targets. New product launches typically boost sales by 15-25%. Combined with recent training, a 75% probability is reasonable. Monitor early indicators closely.', status: 'pending', userId: user1.id },
      { title: 'Project Delivery On Time', description: 'Will the current sprint deliver all planned features?', category: 'Work', scenario: 'Sprint has 10 story points remaining with 5 days left', factors: ['Team velocity stable', 'No blockers identified', 'Clear requirements'], probability: 85, timeframe: '5 days', confidence: 'high', aiPrediction: 'With stable velocity and no blockers, on-time delivery is highly probable. The 10 story points in 5 days aligns with historical team capacity. Main risk is unexpected issues emerging.', status: 'pending', userId: user1.id },
      { title: 'Stock Market Direction', description: 'Predicting market will be up by end of month', category: 'Finance', scenario: 'Fed signals no rate changes, earnings season strong', factors: ['Stable interest rates', 'Strong earnings', 'Low unemployment'], probability: 60, timeframe: '1 month', confidence: 'medium', aiPrediction: 'Market predictions are inherently uncertain. While fundamentals are positive, external shocks can occur. A 60% probability acknowledges both the positive indicators and inherent unpredictability.', status: 'pending', userId: user1.id },
      { title: 'Job Offer Acceptance', description: 'Candidate will accept our offer', category: 'Hiring', scenario: 'Strong candidate received competitive offer, good rapport during interviews', factors: ['Competitive salary', 'Good culture fit', 'Growth opportunities'], probability: 70, timeframe: '1 week', confidence: 'medium', aiPrediction: 'Candidate engagement suggests strong interest. The offer is competitive but they may have other options. Following up personally and highlighting unique aspects could increase acceptance probability.', status: 'pending', userId: user1.id },
      { title: 'Weight Loss Goal Achievement', description: 'Will reach target weight of 175 lbs by June', category: 'Health', scenario: 'Currently at 190 lbs, following consistent diet and exercise plan', factors: ['Consistent exercise routine', 'Diet tracking active', 'Support from family'], probability: 80, timeframe: 'June 2025', confidence: 'high', aiPrediction: 'A 15 lb loss over several months is achievable at 1-2 lbs per week. Your consistency factors and support system make this highly probable. Maintain current habits and track weekly.', actualResult: null, status: 'pending', userId: user1.id },
      { title: 'Tech Certification Pass', description: 'Will pass AWS Solutions Architect exam on first attempt', category: 'Education', scenario: 'Completed course, scoring 80%+ on practice exams', factors: ['Course completed', 'Practice exam scores high', 'Hands-on experience'], probability: 85, timeframe: '2 weeks', confidence: 'high', aiPrediction: 'Practice exam scores of 80%+ correlate strongly with exam success. Combined with hands-on experience, first-attempt pass is highly likely. Review weak areas identified in practice tests.', status: 'pending', userId: user1.id },
      { title: 'Startup Funding Round', description: 'Series A funding will close successfully', category: 'Business', scenario: 'Strong metrics, interested investors, market timing good', factors: ['MRR growing 15% monthly', '3 term sheets received', 'Market conditions favorable'], probability: 90, timeframe: '2 months', confidence: 'high', aiPrediction: 'Multiple term sheets and strong growth metrics suggest high probability of closing. Focus on due diligence preparation and maintaining relationships with all interested parties.', status: 'pending', userId: user1.id },
      { title: 'Home Purchase Approval', description: 'Mortgage application will be approved', category: 'Finance', scenario: 'Good credit score, stable income, reasonable debt-to-income ratio', factors: ['Credit score 750+', 'Stable 5-year employment', 'DTI under 30%'], probability: 95, timeframe: '3 weeks', confidence: 'high', aiPrediction: 'Strong financial profile suggests near-certain approval. The only risk is documentation issues. Ensure all requested documents are complete and accurate.', status: 'pending', userId: user1.id },
      { title: 'Team Restructure Success', description: 'Reorganized team will be more productive within 3 months', category: 'Work', scenario: 'Moving from functional to cross-functional teams', factors: ['Clear communication plan', 'Training provided', 'Leadership support'], probability: 65, timeframe: '3 months', confidence: 'medium', aiPrediction: 'Team reorganizations typically see a productivity dip before improvement. A 65% success probability accounts for change resistance and learning curves. Strong communication is critical.', status: 'pending', userId: user1.id },
      { title: 'Relationship Milestone', description: 'Partner will say yes to moving in together', category: 'Personal', scenario: 'Dating for 2 years, frequent discussions about future', factors: ['Strong relationship', 'Financial readiness', 'Prior positive discussions'], probability: 85, timeframe: '1 month', confidence: 'medium', aiPrediction: 'Previous positive discussions and relationship stability suggest high probability. The key is timing and presenting it as a mutual decision. Consider their perspective and readiness.', status: 'pending', userId: user1.id },
      { title: 'Product Launch Success', description: 'New feature will achieve 50% user adoption in first month', category: 'Business', scenario: 'Feature addresses top customer request, beta feedback positive', factors: ['Customer-requested feature', 'Beta testing successful', 'Marketing plan ready'], probability: 70, timeframe: '1 month', confidence: 'medium', aiPrediction: '50% adoption is ambitious but achievable for a top-requested feature. Beta success is a good indicator. Consider in-app announcements and email campaigns to boost awareness.', status: 'pending', userId: user1.id },
      { title: 'Conference Talk Acceptance', description: 'Abstract will be accepted for tech conference', category: 'Career', scenario: 'Unique topic, relevant to conference theme, first-time speaker', factors: ['Novel topic', 'Well-written abstract', 'Conference theme alignment'], probability: 40, timeframe: '2 months', confidence: 'low', aiPrediction: 'Conference acceptance rates are typically 20-30%. A novel, relevant topic improves odds but first-time speaker status is a disadvantage. Apply to multiple conferences to increase overall chances.', status: 'pending', userId: user1.id },
      { title: 'Car Sale Price Achievement', description: 'Will sell used car at asking price of $15,000', category: 'Finance', scenario: 'Car in good condition, priced at market value, good photos', factors: ['Below average mileage', 'No accidents', 'Popular model'], probability: 60, timeframe: '1 month', confidence: 'medium', aiPrediction: 'Market-priced vehicles typically sell within 5% of asking. Factor in negotiation room by listing slightly higher. Timing and presentation quality significantly impact sale speed.', status: 'pending', userId: user1.id },
      { title: 'Habit Streak Continuation', description: 'Will maintain daily meditation streak for 30 more days', category: 'Personal', scenario: 'Current streak is 15 days, motivation high', factors: ['Established routine', 'High motivation', 'Visible benefits'], probability: 75, timeframe: '30 days', confidence: 'medium', aiPrediction: 'Habit research shows 21-66 days to form habits. At day 15 with high motivation and routine, continuation is probable. Plan for low-motivation days with minimum viable meditation.', status: 'pending', userId: user1.id },
      { title: 'Interview Success', description: 'Will receive job offer after final round interview', category: 'Career', scenario: 'Reached final round, positive feedback from earlier rounds', factors: ['Made final round', 'Good rapport with team', 'Skills match requirements'], probability: 50, timeframe: '2 weeks', confidence: 'medium', aiPrediction: 'Final round typically has 2-4 candidates. At 50% probability, focus on preparation and differentiation. Research the company deeply and prepare thoughtful questions.', status: 'pending', userId: user1.id },
      { title: 'Weather Prediction: Beach Day', description: 'Weather will be good for planned beach trip', category: 'Personal', scenario: 'Trip planned for next Saturday, current forecast shows sun', factors: ['Favorable current forecast', 'Season appropriate', 'Inland high pressure'], probability: 70, timeframe: '7 days', confidence: 'low', aiPrediction: 'Week-out weather predictions have about 80% accuracy for general conditions. A 70% probability accounts for forecast uncertainty. Have a backup plan for indoor activities.', status: 'pending', userId: user2.id },
    ],
  });
  console.log(`Created ${predictions.count} predictions`);

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
