import Link from "next/link";
import React from "react";
import Badge from "react-bootstrap/Badge";

const RouteBadge = ({
  color,
  textColor,
  name,
  href,
}: {
  color: string;
  textColor: string;
  name: string;
  href?: string;
}) => {
  const badge = (
    <Badge
      ref={(node: any) => {
        if (node) {
          // override bootstraps stupid !important statement on background color
          node.style.setProperty("background-color", color, "important");
        }
      }}
      style={{
        color: textColor,
        cursor: href ? "pointer" : "inherit",
      }}
    >
      {name}
    </Badge>
  );

  if (href) {
    return <Link href={href}>{badge}</Link>;
  }

  return badge;
};

export default RouteBadge;
