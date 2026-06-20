import Link from "next/link";

interface TopNavProps {
  title: string;
  description?: string;
}

export default function TopNav({ title, description }: TopNavProps) {
  return (
    <header className="top-nav">
      <div>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      <Link className="button ghost" href="/">
        返回首页
      </Link>
    </header>
  );
}
