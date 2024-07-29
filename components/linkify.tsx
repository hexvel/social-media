"use client";

import Link from "next/link";
import { ReactNode, useCallback } from "react";
import { LinkIt, LinkItUrl } from "react-linkify-it";
import LinkPreview from "./link-preview";
import UserLinkWithTooltip from "./user-link-with-tooltip";

interface LinkifyProps {
  children: ReactNode;
}

export default function Linkify({ children }: LinkifyProps) {
  return (
    <LinkifyUsername>
      <LinkifyHashtag>
        <LinkifyUrl>{children}</LinkifyUrl>
      </LinkifyHashtag>
    </LinkifyUsername>
  );
}

function LinkifyUrl({ children }: LinkifyProps) {
  const renderLinkPreview = useCallback(
    () => <LinkPreview>{children}</LinkPreview>,
    [children],
  );

  return (
    <LinkItUrl className="text-primary hover:underline">
      {renderLinkPreview()}
    </LinkItUrl>
  );
}

function LinkifyUsername({ children }: LinkifyProps) {
  return (
    <LinkIt
      regex={/(@[a-zA-Z0-9_]+)/}
      component={(match, key) => (
        <UserLinkWithTooltip key={key} username={match.slice(1)}>
          {match}
        </UserLinkWithTooltip>
      )}
    >
      {children}
    </LinkIt>
  );
}

function LinkifyHashtag({ children }: LinkifyProps) {
  return (
    <LinkIt
      regex={/(#[a-zA-Z0-9_]+)/}
      component={(match, key) => (
        <Link
          key={key}
          href={`/hashtag/${match.slice(1)}`}
          className={`text-primary hover:underline`}
        >
          {match}
        </Link>
      )}
    >
      {children}
    </LinkIt>
  );
}
