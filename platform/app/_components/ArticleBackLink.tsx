// The "← Back to …" line that closes every article.
export function ArticleBackLink({ href, label }: { href: string; label: string }) {
  return (
    <div className="mt-12 border-t border-border pt-6 font-mono text-xs text-dim">
      <a href={href} className="hover:text-secondary">{label}</a>
    </div>
  );
}
