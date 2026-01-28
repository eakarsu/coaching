'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AdminClientProps {
  data: {
    stats: any[];
    services: any[];
    additionalServices: any[];
    testimonials: any[];
    companies: any[];
    blogPosts: any[];
    resources: any[];
    timeSlots: any[];
    bookings: any[];
    contacts: any[];
  };
}

type TableName = 'stats' | 'services' | 'additionalServices' | 'testimonials' | 'companies' | 'blogPosts' | 'resources' | 'timeSlots' | 'bookings' | 'contacts';

const tableConfig: Record<TableName, { label: string; color: string; icon: string }> = {
  stats: { label: 'Stats', color: 'blue', icon: '📊' },
  services: { label: 'Services', color: 'green', icon: '💼' },
  additionalServices: { label: 'Additional Services', color: 'emerald', icon: '➕' },
  testimonials: { label: 'Testimonials', color: 'purple', icon: '💬' },
  companies: { label: 'Companies', color: 'indigo', icon: '🏢' },
  blogPosts: { label: 'Blog Posts', color: 'orange', icon: '📝' },
  resources: { label: 'Resources', color: 'teal', icon: '📚' },
  timeSlots: { label: 'Time Slots', color: 'cyan', icon: '🕐' },
  bookings: { label: 'Bookings', color: 'rose', icon: '📅' },
  contacts: { label: 'Contacts', color: 'amber', icon: '✉️' },
};

export default function AdminClient({ data }: AdminClientProps) {
  const [activeTable, setActiveTable] = useState<TableName>('stats');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '-';
    if (value instanceof Date) return new Date(value).toLocaleString();
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  const renderTable = () => {
    const items = data[activeTable];
    if (!items || items.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          No {tableConfig[activeTable].label.toLowerCase()} found.
        </div>
      );
    }

    const columns = Object.keys(items[0]).filter(key => !['createdAt', 'updatedAt'].includes(key));

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {columns.slice(0, 6).map((col) => (
                <th key={col} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {col.replace(/([A-Z])/g, ' $1').trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item: any, index: number) => (
              <tr
                key={item.id || index}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedItem(item)}
              >
                {columns.slice(0, 6).map((col) => (
                  <td key={col} className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {col === 'imageUrl' && item[col] ? (
                      <img src={item[col]} alt="" className="w-12 h-8 object-cover rounded" />
                    ) : col === 'id' ? (
                      <span className="font-mono text-xs">{String(item[col]).slice(0, 8)}...</span>
                    ) : col === 'popular' || col === 'featured' || col === 'published' || col === 'available' ? (
                      <span className={`px-2 py-1 rounded text-xs ${item[col] ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {item[col] ? 'Yes' : 'No'}
                      </span>
                    ) : (
                      <span className="truncate block max-w-[200px]">{formatValue(item[col])}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold">Database Admin</h1>
          <p className="text-slate-400 text-sm mt-1">PostgreSQL Data Viewer</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {(Object.keys(tableConfig) as TableName[]).map((key) => {
            const config = tableConfig[key];
            const count = data[key]?.length || 0;
            const isActive = activeTable === key;

            return (
              <button
                key={key}
                onClick={() => setActiveTable(key)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span>{config.icon}</span>
                  <span className="font-medium">{config.label}</span>
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isActive ? 'bg-blue-500' : 'bg-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Website
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {tableConfig[activeTable].icon} {tableConfig[activeTable].label}
              </h2>
              <p className="text-gray-500 mt-1">
                {data[activeTable]?.length || 0} records found
              </p>
            </div>
            <div className="flex gap-4">
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <span className="text-sm text-gray-500">Total Records:</span>
                <span className="ml-2 font-semibold text-gray-900">
                  {Object.values(data).reduce((sum, arr) => sum + (arr?.length || 0), 0)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Table Content */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {renderTable()}
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {tableConfig[activeTable].icon} {tableConfig[activeTable].label} Details
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              {selectedItem.imageUrl && (
                <div className="mb-6">
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title || 'Image'}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="space-y-4">
                {Object.entries(selectedItem).map(([key, value]) => (
                  <div key={key} className="border-b border-gray-100 pb-3">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <div className="mt-1">
                      {key === 'imageUrl' && value ? (
                        <a href={value as string} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm break-all">
                          {value as string}
                        </a>
                      ) : key === 'slug' && activeTable === 'blogPosts' ? (
                        <Link href={`/blog/${value}`} className="text-blue-600 hover:underline">
                          /blog/{value as string}
                        </Link>
                      ) : key === 'features' && Array.isArray(value) ? (
                        <ul className="list-disc list-inside text-gray-900 text-sm space-y-1">
                          {(value as string[]).map((feature, i) => (
                            <li key={i}>{feature}</li>
                          ))}
                        </ul>
                      ) : key === 'content' && value ? (
                        <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50 p-3 rounded-lg max-h-40 overflow-y-auto">
                          <div dangerouslySetInnerHTML={{ __html: value as string }} />
                        </div>
                      ) : key === 'quote' || key === 'description' || key === 'excerpt' || key === 'message' ? (
                        <p className="text-gray-900 text-sm whitespace-pre-wrap">{formatValue(value)}</p>
                      ) : typeof value === 'boolean' ? (
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          value ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {value ? 'Yes' : 'No'}
                        </span>
                      ) : (
                        <p className="text-gray-900 text-sm font-medium">{formatValue(value)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t px-6 py-4 bg-gray-50 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
