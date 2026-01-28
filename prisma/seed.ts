import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
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
