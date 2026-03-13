import { useMDXComponents as getNextraMDXComponents } from "nextra/mdx-components";
import type { MDXComponents } from "nextra/mdx-components";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...getNextraMDXComponents(),
    ...components,
  };
}
