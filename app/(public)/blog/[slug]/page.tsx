import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/marketing/blog/blog-article";
import {
  type BlogPostSlug,
  blogPostDetails,
  blogPosts,
} from "@/lib/marketing/site-content";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return {};
  }

  return {
    description: post.description,
    title: `${post.title} | Tandaan.AI Blog`,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  const detail = blogPostDetails[slug as BlogPostSlug];

  if (!post || !detail) {
    notFound();
  }

  return <BlogArticle detail={detail} post={post} />;
}
