"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar, User } from "lucide-react";

// Placeholder blog data
const blogs = [
  {
    id: 1,
    title: "How to Scale Your E-commerce Store with Meta Ads in 2024",
    excerpt: "Discover the exact frameworks and campaign structures we use to generate 5x ROAS for our e-commerce clients.",
    category: "Paid Advertising",
    author: "Alex Founder",
    date: "Oct 15, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "The Ultimate Guide to B2B Lead Generation Funnels",
    excerpt: "Stop wasting money on cold outreach. Learn how to build an inbound machine that brings qualified leads on autopilot.",
    category: "Funnels",
    author: "Sarah LeadGen",
    date: "Oct 12, 2024",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Why Your Website Design is Killing Your Conversion Rate",
    excerpt: "A beautiful website is useless if it doesn't convert. Here are 5 UX mistakes you need to fix immediately.",
    category: "CRO",
    author: "Mike Design",
    date: "Oct 08, 2024",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="px-4 py-2 rounded-full glass border border-border text-sm font-medium text-primary mb-6 inline-block">
              Our Insights & Resources
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              Latest from the <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-secondary max-w-2xl mx-auto text-lg">
              Strategies, insights, and tactical advice to help you scale your business and dominate your market.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl overflow-hidden flex flex-col group cursor-pointer"
              >
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-foreground">
                    {blog.category}
                  </div>
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-foreground/50 mb-3">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {blog.date}</span>
                    <span className="flex items-center gap-1"><User size={14} /> {blog.author}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-secondary text-sm mb-6 flex-grow">
                    {blog.excerpt}
                  </p>
                  <Link href={`/blog/${blog.id}`} className="text-primary font-medium flex items-center gap-2 group-hover:gap-3 transition-all mt-auto">
                    Read More <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
