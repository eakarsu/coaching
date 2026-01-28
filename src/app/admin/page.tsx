import prisma from '@/lib/prisma';
import AdminClient from './AdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  // Fetch all data from database
  const [
    stats,
    services,
    additionalServices,
    testimonials,
    companies,
    blogPosts,
    resources,
    timeSlots,
    bookings,
    contacts,
  ] = await Promise.all([
    prisma.stat.findMany({ orderBy: { order: 'asc' } }),
    prisma.service.findMany({ orderBy: { order: 'asc' } }),
    prisma.additionalService.findMany({ orderBy: { order: 'asc' } }),
    prisma.testimonial.findMany({ orderBy: { order: 'asc' } }),
    prisma.company.findMany({ orderBy: { order: 'asc' } }),
    prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.resource.findMany({ orderBy: { order: 'asc' } }),
    prisma.timeSlot.findMany({ orderBy: [{ day: 'asc' }, { time: 'asc' }] }),
    prisma.booking.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.contact.findMany({ orderBy: { createdAt: 'desc' } }),
  ]);

  // Serialize dates for client component
  const serializeData = (items: any[]) =>
    items.map(item => ({
      ...item,
      createdAt: item.createdAt?.toISOString?.() || item.createdAt,
      updatedAt: item.updatedAt?.toISOString?.() || item.updatedAt,
    }));

  return (
    <AdminClient
      data={{
        stats: serializeData(stats),
        services: serializeData(services),
        additionalServices: serializeData(additionalServices),
        testimonials: serializeData(testimonials),
        companies: serializeData(companies),
        blogPosts: serializeData(blogPosts),
        resources: serializeData(resources),
        timeSlots: serializeData(timeSlots),
        bookings: serializeData(bookings),
        contacts: serializeData(contacts),
      }}
    />
  );
}
