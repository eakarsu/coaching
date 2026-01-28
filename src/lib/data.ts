import prisma from './prisma';

export async function getStats() {
  return prisma.stat.findMany({
    orderBy: { order: 'asc' },
  });
}

export async function getServices() {
  return prisma.service.findMany({
    orderBy: { order: 'asc' },
  });
}

export async function getFeaturedServices(limit = 3) {
  return prisma.service.findMany({
    orderBy: [{ popular: 'desc' }, { order: 'asc' }],
    take: limit,
  });
}

export async function getAdditionalServices() {
  return prisma.additionalService.findMany({
    orderBy: { order: 'asc' },
  });
}

export async function getTestimonials() {
  return prisma.testimonial.findMany({
    orderBy: { order: 'asc' },
  });
}

export async function getFeaturedTestimonials(limit = 6) {
  return prisma.testimonial.findMany({
    orderBy: [{ featured: 'desc' }, { order: 'asc' }],
    take: limit,
  });
}

export async function getCompanies() {
  return prisma.company.findMany({
    orderBy: { order: 'asc' },
  });
}

export async function getBlogPosts() {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getFeaturedBlogPosts(limit = 4) {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    take: limit,
  });
}

export async function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug },
  });
}

export async function getAllBlogSlugs() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return posts.map((post) => post.slug);
}

export async function getResources() {
  return prisma.resource.findMany({
    orderBy: { order: 'asc' },
  });
}

export async function getFeaturedResources(limit = 3) {
  return prisma.resource.findMany({
    orderBy: { order: 'asc' },
    take: limit,
  });
}

export async function getTimeSlots() {
  return prisma.timeSlot.findMany({
    where: { available: true },
    orderBy: [{ day: 'asc' }, { time: 'asc' }],
  });
}

export async function createBooking(data: {
  name: string;
  email: string;
  phone?: string;
  topic?: string;
  day: string;
  time: string;
}) {
  return prisma.booking.create({
    data,
  });
}

export async function createContact(data: {
  name: string;
  email: string;
  company?: string;
  message: string;
}) {
  return prisma.contact.create({
    data,
  });
}
