import Linkify from "linkify-react";
import type { IntermediateRepresentation } from "linkifyjs";
import Link from "next/link";
import { getBaseUrl } from "@/utils/url";

type ContentProps = {
  children: string;
  titleMap?: Record<string, string> | null;
};

type RenderFn = (ir: IntermediateRepresentation) => React.ReactNode;

const makeRender =
  (titleMap?: Record<string, string> | null): RenderFn =>
  // eslint-disable-next-line react/display-name
  ({ attributes, content }) => {
    const attrs = attributes as Record<string, unknown>;

    const hrefVal = attrs["href"];
    if (typeof hrefVal !== "string") {
      return content;
    }

    const href = hrefVal;
    const { ...rest } = attrs;

    const isInternal = href.includes(getBaseUrl());
    const url = isInternal ? href.replace(getBaseUrl(), "") : href;

    const handleClick = (event: React.SyntheticEvent) => {
      if (isInternal) return;
      if (!confirm("Are you sure you want to leave this page?")) {
        event.preventDefault();
      }
    };

    let label: React.ReactNode = content;

    const match = url.match(/^\/tickets\/([^/?#]+)/);
    const id = match?.[1];

    if (id && titleMap && titleMap[id]) {
      label = `${titleMap[id]}`;
    } else if (id) {
      label = `Ticket: ${id}`;
    }

    return (
      <Link href={url} {...rest} onClick={handleClick} className="underline">
        {label}
      </Link>
    );
  };

const CommentContent = ({ children, titleMap }: ContentProps) => {
  return (
    <Linkify
      as="p"
      className="whitespace-pre-line"
      options={{ render: makeRender(titleMap) }}
    >
      {children}
    </Linkify>
  );
};

export { CommentContent };
